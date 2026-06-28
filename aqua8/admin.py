from django.contrib import admin
from .models import Module, TelemetryReading, Alarm, SystemStatus

@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'status', 'is_active', 'updated_at']
    list_filter = ['status', 'is_active']
    search_fields = ['name']

@admin.register(TelemetryReading)
class TelemetryReadingAdmin(admin.ModelAdmin):
    list_display = ['module', 'timestamp', 'temperature', 'pressure', 'flow_rate']
    list_filter = ['module', 'timestamp']
    date_hierarchy = 'timestamp'

@admin.register(Alarm)
class AlarmAdmin(admin.ModelAdmin):
    list_display = ['alarm_type', 'module', 'message', 'is_resolved', 'timestamp']
    list_filter = ['alarm_type', 'is_resolved', 'timestamp']
    search_fields = ['message']

@admin.register(SystemStatus)
class SystemStatusAdmin(admin.ModelAdmin):
    list_display = ['platform_name', 'version', 'total_production_liters', 'started_at']
