from django.contrib import admin
from .models import Capitulo, CapituloProyecto

@admin.register(Capitulo)
class CapituloAdmin(admin.ModelAdmin):
    list_display = ['codigo', 'nombre', 'disciplina', 'orden', 'activo']
    list_filter = ['disciplina', 'activo']
    search_fields = ['codigo', 'nombre']

@admin.register(CapituloProyecto)
class CapituloProyectoAdmin(admin.ModelAdmin):
    list_display = ['proyecto', 'capitulo_maestro', 'estado', 'responsable', 'version_actual']
    list_filter = ['estado', 'capitulo_maestro__disciplina']
