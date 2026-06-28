from django.db import models
from django.contrib.auth.models import User

class PerfilUsuario(models.Model):
    ESPECIALIDAD_CHOICES = [
        ('civil', 'Ingeniería Civil'), ('mecanica', 'Ingeniería Mecánica'),
        ('electrica', 'Ingeniería Eléctrica'), ('hidraulica', 'Ingeniería Hidráulica'),
        ('ambiental', 'Ingeniería Ambiental'), ('geotecnia', 'Geotecnia'),
        ('arquitectura', 'Arquitectura'), ('admin', 'Administrativo'),
    ]
    usuario = models.OneToOneField(User, on_delete=models.CASCADE, related_name='perfil')
    especialidad = models.CharField(max_length=20, choices=ESPECIALIDAD_CHOICES, blank=True)
    registro_profesional = models.CharField(max_length=50, blank=True)
    firma_digital = models.ImageField(upload_to='firmas/', blank=True, null=True)
    telefono = models.CharField(max_length=20, blank=True)
    cargo = models.CharField(max_length=100, blank=True)
    activo = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Perfil de Usuario'

    def __str__(self):
        return f"{self.usuario.get_full_name()} - {self.get_especialidad_display()}"
