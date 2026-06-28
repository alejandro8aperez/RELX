from rest_framework import serializers
from .models import Module, TelemetryReading, Alarm, SystemStatus, Proyecto, Capitulo, CapituloMaestro, Documento, MemoriaCalculo, CategoriaPresupuesto, PartidaPresupuestaria

class TelemetryReadingSerializer(serializers.ModelSerializer):
    class Meta:
        model = TelemetryReading
        fields = '__all__'

class AlarmSerializer(serializers.ModelSerializer):
    module_code = serializers.CharField(source='module.code', read_only=True, allow_null=True)
    module_name = serializers.CharField(source='module.name', read_only=True, allow_null=True)

    class Meta:
        model = Alarm
        fields = ['id', 'module', 'module_code', 'module_name', 'alarm_type', 'message', 'is_resolved', 'timestamp', 'resolved_at']

class ModuleSerializer(serializers.ModelSerializer):
    latest_reading = serializers.SerializerMethodField()

    class Meta:
        model = Module
        fields = ['id', 'code', 'name', 'status', 'is_active', 'latest_reading', 'created_at', 'updated_at']

    def get_latest_reading(self, obj):
        reading = obj.readings.first()
        if reading:
            return TelemetryReadingSerializer(reading).data
        return None

class ProyectoSerializer(serializers.ModelSerializer):
    capitulos_count = serializers.SerializerMethodField()

    class Meta:
        model = Proyecto
        fields = ['id', 'codigo', 'nombre', 'descripcion', 'ubicacion', 'estado', 'capitulos_count', 'created_at', 'updated_at']

    def get_capitulos_count(self, obj):
        return obj.capitulos.count()


class CapituloMaestroSerializer(serializers.ModelSerializer):
    class Meta:
        model = CapituloMaestro
        fields = ['id', 'codigo', 'nombre', 'descripcion']


class CapituloSerializer(serializers.ModelSerializer):
    proyecto_info = serializers.SerializerMethodField()
    capitulo_maestro_info = CapituloMaestroSerializer(source='capitulo_maestro', read_only=True)
    documentos_count = serializers.SerializerMethodField()

    class Meta:
        model = Capitulo
        fields = ['id', 'proyecto', 'proyecto_info', 'capitulo_maestro', 'capitulo_maestro_info', 'estado', 'documentos_count', 'created_at', 'updated_at']

    def get_proyecto_info(self, obj):
        return {'id': obj.proyecto.id, 'codigo': obj.proyecto.codigo, 'nombre': obj.proyecto.nombre}

    def get_documentos_count(self, obj):
        return Documento.objects.filter(proyecto=obj.proyecto).count()


class DocumentoSerializer(serializers.ModelSerializer):
    proyecto_info = serializers.SerializerMethodField()

    class Meta:
        model = Documento
        fields = ['id', 'proyecto', 'proyecto_info', 'nombre', 'descripcion', 'tipo', 'tamano', 'fecha_subida']

    def get_proyecto_info(self, obj):
        if obj.proyecto:
            return {'id': obj.proyecto.id, 'codigo': obj.proyecto.codigo}
        return None


class MemoriaCalculoSerializer(serializers.ModelSerializer):
    proyecto_info = serializers.SerializerMethodField()

    class Meta:
        model = MemoriaCalculo
        fields = ['id', 'proyecto', 'proyecto_info', 'titulo', 'descripcion', 'tipo_calculo', 'resultado', 'estado', 'created_at', 'updated_at']

    def get_proyecto_info(self, obj):
        if obj.proyecto:
            return {'id': obj.proyecto.id, 'codigo': obj.proyecto.codigo}
        return None


class PartidaPresupuestariaSerializer(serializers.ModelSerializer):
    total_usd = serializers.SerializerMethodField()
    total_cop = serializers.SerializerMethodField()

    class Meta:
        model = PartidaPresupuestaria
        fields = ['id', 'categoria', 'numero', 'descripcion', 'cantidad', 'unidad',
                  'costo_unitario_usd', 'costo_unitario_cop', 'notas', 'total_usd', 'total_cop']

    def get_total_usd(self, obj): return round(obj.total_usd(), 2)
    def get_total_cop(self, obj): return round(obj.total_cop(), 2)


class CategoriaPresupuestoSerializer(serializers.ModelSerializer):
    partidas = PartidaPresupuestariaSerializer(many=True, read_only=True)
    total_usd = serializers.SerializerMethodField()
    total_cop = serializers.SerializerMethodField()

    class Meta:
        model = CategoriaPresupuesto
        fields = ['id', 'proyecto', 'nombre', 'orden', 'partidas', 'total_usd', 'total_cop']

    def get_total_usd(self, obj): return round(obj.total_usd(), 2)
    def get_total_cop(self, obj): return round(obj.total_cop(), 2)


class SystemStatusSerializer(serializers.ModelSerializer):
    uptime_seconds = serializers.SerializerMethodField()
    modules_online = serializers.SerializerMethodField()

    class Meta:
        model = SystemStatus
        fields = ['platform_name', 'version', 'location_name', 'latitude', 'longitude', 
                  'total_production_liters', 'started_at', 'updated_at', 'uptime_seconds', 'modules_online']

    def get_uptime_seconds(self, obj):
        from django.utils import timezone
        return int((timezone.now() - obj.started_at).total_seconds())

    def get_modules_online(self, obj):
        return Module.objects.filter(status='online').count()
