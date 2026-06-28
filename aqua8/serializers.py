from rest_framework import serializers
from .models import Module, TelemetryReading, Alarm, SystemStatus

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
