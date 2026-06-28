from django.contrib import admin
from .models import Proyecto, ParticipanteProyecto

@admin.register(Proyecto)
class ProyectoAdmin(admin.ModelAdmin):
    list_display = ['codigo', 'nombre', 'tipo', 'estado', 'responsable', 'fecha_entrega']
    list_filter = ['tipo', 'estado']
    search_fields = ['codigo', 'nombre', 'cliente']

@admin.register(ParticipanteProyecto)
class ParticipanteProyectoAdmin(admin.ModelAdmin):
    list_display = ['proyecto', 'usuario', 'rol', 'fecha_asignacion']
    list_filter = ['rol']
