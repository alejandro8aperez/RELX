from django.db import models
from django.contrib.auth.models import User
from proyectos.models import Proyecto

class Capitulo(models.Model):
    DISCIPLINA_CHOICES = [
        ('general', 'General'), ('civil', 'Civil / Estructural'),
        ('hidraulica', 'Hidráulica / Sanitaria'), ('electrica', 'Eléctrica / Instrumentación'),
        ('mecanica', 'Mecánica'), ('ambiental', 'Ambiental'),
        ('geotecnia', 'Geotecnia'), ('topografia', 'Topografía'),
    ]
    codigo = models.CharField(max_length=10, unique=True)
    nombre = models.CharField(max_length=200)
    disciplina = models.CharField(max_length=20, choices=DISCIPLINA_CHOICES, default='general')
    descripcion = models.TextField(blank=True)
    orden = models.PositiveIntegerField(default=0)
    plantilla_path = models.CharField(max_length=300, blank=True)
    activo = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['orden', 'codigo']

    def __str__(self):
        return f"Cap. {self.codigo} - {self.nombre}"

class CapituloProyecto(models.Model):
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'), ('en_desarrollo', 'En Desarrollo'),
        ('en_revision', 'En Revisión'), ('aprobado', 'Aprobado'), ('rechazado', 'Rechazado'),
    ]
    proyecto = models.ForeignKey(Proyecto, on_delete=models.CASCADE, related_name='capitulos')
    capitulo_maestro = models.ForeignKey(Capitulo, on_delete=models.PROTECT, related_name='instancias')
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='pendiente')
    responsable = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    fecha_inicio = models.DateField(null=True, blank=True)
    fecha_entrega = models.DateField(null=True, blank=True)
    observaciones = models.TextField(blank=True)
    version_actual = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['proyecto', 'capitulo_maestro']
        ordering = ['capitulo_maestro__orden']

    def __str__(self):
        return f"{self.proyecto.codigo} - {self.capitulo_maestro.nombre}"
