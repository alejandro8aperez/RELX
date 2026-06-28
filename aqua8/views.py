import random
from datetime import datetime, timedelta
from django.utils import timezone
from django.db.models import Avg
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Module, TelemetryReading, Alarm, SystemStatus
from .serializers import (ModuleSerializer, TelemetryReadingSerializer, 
                          AlarmSerializer, SystemStatusSerializer)

@api_view(['GET'])
def telemetry(request):
    """Devuelve telemetría en vivo de todos los módulos."""
    modules = Module.objects.all()
    data = {}

    for mod in modules:
        reading = mod.readings.first()
        if reading:
            data[mod.code] = {
                'name': mod.name,
                'status': mod.status,
                'temp': reading.temperature,
                'pressure': reading.pressure,
                'flow': reading.flow_rate,
            }
            if mod.code == 'B':
                data[mod.code]['tds_in'] = reading.tds_in
                data[mod.code]['tds_out'] = reading.tds_out
            elif mod.code == 'C':
                data[mod.code]['tank_level'] = reading.tank_level
            elif mod.code == 'D':
                data[mod.code]['solar_prod'] = reading.solar_production
                data[mod.code]['battery'] = reading.battery_level
                data[mod.code]['consumption'] = reading.energy_consumption
                data[mod.code]['scada_status'] = reading.scada_status
        else:
            data[mod.code] = {'name': mod.name, 'status': mod.status}

    sys_status = SystemStatus.objects.first()
    production = sys_status.total_production_liters if sys_status else 0
    uptime = int((timezone.now() - sys_status.started_at).total_seconds()) if sys_status else 0

    return Response({
        'modules': data,
        'production_total': production,
        'uptime_seconds': uptime,
        'timestamp': timezone.now().isoformat(),
        'location': {
            'name': sys_status.location_name if sys_status else 'Manaure, La Guajira',
            'lat': sys_status.latitude if sys_status else 11.78,
            'lon': sys_status.longitude if sys_status else -72.45
        }
    })

@api_view(['GET'])
def alarms(request):
    """Devuelve alarmas activas recientes."""
    recent_alarms = Alarm.objects.filter(is_resolved=False)[:20]
    serializer = AlarmSerializer(recent_alarms, many=True)
    return Response({'alarms': serializer.data, 'count': len(serializer.data)})

@api_view(['GET'])
def historical(request):
    """Devuelve datos históricos para gráficos."""
    hours = int(request.GET.get('hours', 24))
    since = timezone.now() - timedelta(hours=hours)

    readings = TelemetryReading.objects.filter(timestamp__gte=since).order_by('timestamp')

    data = []
    for r in readings:
        data.append({
            'timestamp': r.timestamp.isoformat(),
            'production': r.flow_rate * 15 if r.flow_rate else 0,  # aprox
            'energy_consumption': r.energy_consumption,
            'solar_generation': r.solar_production,
            'tds_out': r.tds_out,
            'tank_level': r.tank_level,
        })

    return Response({'data': data})

@api_view(['GET'])
def system_status(request):
    """Estado general de la plataforma."""
    sys_status = SystemStatus.objects.first()
    if not sys_status:
        return Response({'error': 'System not initialized'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

    serializer = SystemStatusSerializer(sys_status)
    return Response({
        'platform': serializer.data['platform_name'],
        'version': serializer.data['version'],
        'status': 'operational',
        'modules_online': serializer.data['modules_online'],
        'timestamp': timezone.now().isoformat()
    })

@api_view(['POST'])
def simulate_tick(request):
    """Genera un nuevo tick de datos simulados (para testing)."""
    modules = Module.objects.all()
    sys_status = SystemStatus.objects.first()

    for mod in modules:
        reading = TelemetryReading(module=mod)

        if mod.code == 'A':
            reading.temperature = round(28 + random.uniform(-2, 2), 1)
            reading.pressure = round(2.0 + random.uniform(-0.3, 0.3), 2)
            reading.flow_rate = int(450 + random.uniform(-30, 30))
        elif mod.code == 'B':
            reading.temperature = round(26 + random.uniform(-1, 1), 1)
            reading.pressure = round(55 + random.uniform(-5, 5), 1)
            reading.flow_rate = int(420 + random.uniform(-20, 20))
            reading.tds_in = int(35000 + random.uniform(-500, 500))
            reading.tds_out = int(450 + random.uniform(-50, 50))
        elif mod.code == 'C':
            reading.temperature = round(25 + random.uniform(-1, 1), 1)
            reading.pressure = round(1.5 + random.uniform(-0.2, 0.2), 2)
            reading.flow_rate = int(415 + random.uniform(-15, 15))
            reading.tank_level = min(100, max(0, 78 + random.uniform(-5, 5)))
        elif mod.code == 'D':
            reading.solar_production = round(18.5 + random.uniform(-3, 3), 1)
            reading.battery_level = min(100, max(0, 92 + random.uniform(-2, 2)))
            reading.energy_consumption = round(12.3 + random.uniform(-1, 1), 1)
            reading.scada_status = 'active'

        reading.save()

    # Actualizar producción total
    if sys_status:
        sys_status.total_production_liters += int(7 * 3)  # ~7 L/min * 3 min
        sys_status.save()

    # Generar alarmas aleatorias
    if random.random() < 0.05:
        alarm_types = [
            ('warning', 'Presión RO ligeramente alta', 'B'),
            ('info', 'Limpieza automática iniciada', 'A'),
            ('warning', 'Nivel de tanque > 90%', 'C'),
            ('info', 'Optimización energética activada', 'D'),
        ]
        atype, msg, mcode = random.choice(alarm_types)
        module = Module.objects.filter(code=mcode).first()
        Alarm.objects.create(module=module, alarm_type=atype, message=msg)

    return Response({'status': 'tick generated', 'timestamp': timezone.now().isoformat()})
