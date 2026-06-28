from django.db import models
from django.contrib.auth.models import User

class Proyecto(models.Model):
    TIPO_CHOICES = [
        ('civil', 'Ingeniería Civil'),
        ('mecanica', 'Ingeniería Mecánica'),
        ('electrica', 'Ingeniería Eléctrica'),
        ('hidraulica', 'Ingeniería Hidráulica'),
        ('ambiental', 'Ingeniería Ambiental'),
        ('multidisciplinar', 'Multidisciplinar'),
    ]
    ESTADO_CHOICES = [
        ('borrador', 'Borrador'),
        ('en_revision', 'En Revisión'),
        ('aprobado', 'Aprobado'),
        ('ejecucion', 'En Ejecución'),
        ('finalizado', 'Finalizado'),
    ]
    codigo = models.CharField(max_length=50, unique=True)
    nombre = models.CharField(max_length=200)
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES, default='multidisciplinar')
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='borrador')
    descripcion = models.TextField(blank=True)
    cliente = models.CharField(max_length=200, blank=True)
    ubicacion = models.CharField(max_length=200, blank=True)
    responsable = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='proyectos_responsable')
    fecha_inicio = models.DateField(null=True, blank=True)
    fecha_entrega = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.codigo} - {self.nombre}"

class ParticipanteProyecto(models.Model):
    ROL_CHOICES = [
        ('director', 'Director de Proyecto'),
        ('disenador', 'Diseñador'),
        ('revisor', 'Revisor'),
        ('calculista', 'Calculista'),
        ('residente', 'Residente'),
    ]
    proyecto = models.ForeignKey(Proyecto, on_delete=models.CASCADE, related_name='participantes')
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    rol = models.CharField(max_length=20, choices=ROL_CHOICES)
    fecha_asignacion = models.DateField(auto_now_add=True)

    class Meta:
        unique_together = ['proyecto', 'usuario', 'rol']
