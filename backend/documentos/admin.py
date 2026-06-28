from django.contrib import admin
from .models import Documento
@admin.register(Documento)
class DocumentoAdmin(admin.ModelAdmin):
    list_display = ['codigo', 'nombre', 'tipo', 'formato', 'capitulo', 'version', 'es_version_actual']
    list_filter = ['tipo', 'formato', 'es_version_actual']
    search_fields = ['codigo', 'nombre']
