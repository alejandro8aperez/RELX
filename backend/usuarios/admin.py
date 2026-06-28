from django.contrib import admin
from .models import PerfilUsuario
@admin.register(PerfilUsuario)
class PerfilUsuarioAdmin(admin.ModelAdmin):
    list_display = ['usuario', 'especialidad', 'registro_profesional', 'cargo', 'activo']
    list_filter = ['especialidad', 'activo']
    search_fields = ['usuario__username', 'usuario__first_name', 'registro_profesional']
