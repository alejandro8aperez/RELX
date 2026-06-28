from django.contrib import admin
from .models import Version, ComentarioRevision

class ComentarioRevisionInline(admin.TabularInline):
    model = ComentarioRevision
    extra = 0

@admin.register(Version)
class VersionAdmin(admin.ModelAdmin):
    list_display = ['numero_version', 'accion', 'entidad', 'realizado_por', 'fecha']
    list_filter = ['accion']
    date_hierarchy = 'fecha'
    inlines = [ComentarioRevisionInline]

@admin.register(ComentarioRevision)
class ComentarioRevisionAdmin(admin.ModelAdmin):
    list_display = ['version', 'autor', 'resuelto', 'fecha']
    list_filter = ['resuelto']
