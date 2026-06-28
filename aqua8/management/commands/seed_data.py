import random
from django.core.management.base import BaseCommand
from django.utils import timezone
from aqua8.models import Module, TelemetryReading, SystemStatus

class Command(BaseCommand):
    help = 'Pobla la base de datos con datos iniciales simulados para AQUA-8'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.WARNING('⚠️  Eliminando datos existentes...'))
        TelemetryReading.objects.all().delete()
        Module.objects.all().delete()
        SystemStatus.objects.all().delete()

        self.stdout.write(self.style.NOTICE('🌊 Creando módulos AQUA-8...'))

        modules_data = [
            {'code': 'A', 'name': 'Captación y Pretratamiento', 'status': 'online'},
            {'code': 'B', 'name': 'Ósmosis Inversa (RO)', 'status': 'online'},
            {'code': 'C', 'name': 'Postratamiento y Almacenamiento', 'status': 'online'},
            {'code': 'D', 'name': 'Energía Solar y SCADA', 'status': 'online'},
        ]

        modules = {}
        for md in modules_data:
            mod = Module.objects.create(**md)
            modules[md['code']] = mod
            self.stdout.write(f"  ✓ Módulo {md['code']}: {md['name']}")

        # Crear SystemStatus
        sys_status = SystemStatus.objects.create(
            platform_name='AQUA-8 Cloud',
            version='1.0.0',
            location_name='Manaure, La Guajira',
            latitude=11.78,
            longitude=-72.45,
            total_production_liters=0
        )
        self.stdout.write(self.style.SUCCESS(f'  ✓ SystemStatus creado: {sys_status}'))

        # Generar datos históricos de las últimas 24 horas
        self.stdout.write(self.style.NOTICE('📊 Generando datos históricos (24h)...'))
        now = timezone.now()

        for i in range(24 * 4):  # Cada 15 minutos
            t = now - __import__('datetime').timedelta(minutes=15 * i)

            for code, mod in modules.items():
                reading = TelemetryReading(module=mod, timestamp=t)

                if code == 'A':
                    reading.temperature = round(28 + random.uniform(-2, 2), 1)
                    reading.pressure = round(2.0 + random.uniform(-0.3, 0.3), 2)
                    reading.flow_rate = int(450 + random.uniform(-30, 30))
                elif code == 'B':
                    reading.temperature = round(26 + random.uniform(-1, 1), 1)
                    reading.pressure = round(55 + random.uniform(-5, 5), 1)
                    reading.flow_rate = int(420 + random.uniform(-20, 20))
                    reading.tds_in = int(35000 + random.uniform(-500, 500))
                    reading.tds_out = int(450 + random.uniform(-50, 50))
                elif code == 'C':
                    reading.temperature = round(25 + random.uniform(-1, 1), 1)
                    reading.pressure = round(1.5 + random.uniform(-0.2, 0.2), 2)
                    reading.flow_rate = int(415 + random.uniform(-15, 15))
                    reading.tank_level = min(100, max(0, 50 + random.uniform(-20, 20)))
                elif code == 'D':
                    reading.solar_production = round(18.5 + random.uniform(-3, 3), 1)
                    reading.battery_level = min(100, max(0, 92 + random.uniform(-2, 2)))
                    reading.energy_consumption = round(12.3 + random.uniform(-1, 1), 1)
                    reading.scada_status = 'active'

                reading.save()

        # Calcular producción total aproximada
        total_flow = sum(r.flow_rate or 0 for r in TelemetryReading.objects.all())
        sys_status.total_production_liters = int(total_flow * 0.25)  # aproximación
        sys_status.save()

        self.stdout.write(self.style.SUCCESS(f'  ✓ {TelemetryReading.objects.count()} lecturas generadas'))
        self.stdout.write(self.style.SUCCESS(f'  ✓ Producción total estimada: {sys_status.total_production_liters} L'))

        self.stdout.write(self.style.SUCCESS('\n🚀 AQUA-8 listo para operar!'))
        self.stdout.write(self.style.NOTICE('   Ejecuta: python manage.py runserver'))
