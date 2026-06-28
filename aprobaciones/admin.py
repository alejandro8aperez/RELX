from django.contrib import admin
from .models import FlujoAprobacion, EtapaAprobacion, Aprobacion, DelegacionAprobacion

class EtapaAprobacionInline(admin.TabularInline):
    model = EtapaAprobacion
    extra = 1

@admin.register(FlujoAprobacion)
class FlujoAprobacionAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'content_type', 'activo', 'created_at']
    list_filter = ['activo']
    inlines = [EtapaAprobacionInline]

@admin.register(Aprobacion)
class AprobacionAdmin(admin.ModelAdmin):
    list_display = ['accion', 'aprobador', 'estado_nuevo', 'created_at']
    list_filter = ['accion', 'created_at']
    search_fields = ['aprobador__username', 'comentario']

@admin.register(DelegacionAprobacion)
class DelegacionAprobacionAdmin(admin.ModelAdmin):
    list_display = ['delegador', 'delegado', 'fecha_inicio', 'fecha_fin', 'activa']
    list_filter = ['activa']
