from django.contrib import admin
from .models import MemoriaCalculo, SeccionMemoria

class SeccionMemoriaInline(admin.TabularInline):
    model = SeccionMemoria
    extra = 1

@admin.register(MemoriaCalculo)
class MemoriaCalculoAdmin(admin.ModelAdmin):
    list_display = ['codigo', 'titulo', 'estado', 'normativa', 'version', 'capitulo']
    list_filter = ['estado', 'normativa']
    search_fields = ['codigo', 'titulo']
    inlines = [SeccionMemoriaInline]

@admin.register(SeccionMemoria)
class SeccionMemoriaAdmin(admin.ModelAdmin):
    list_display = ['memoria', 'orden', 'titulo', 'tipo']
    list_filter = ['tipo']
    ordering = ['memoria', 'orden']
