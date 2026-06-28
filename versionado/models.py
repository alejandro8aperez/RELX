from django.db import models
from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey

class Version(models.Model):
    ACCION_CHOICES = [
        ('creacion', 'Creación'), ('edicion', 'Edición'), ('revision', 'Revisión'),
        ('aprobacion', 'Aprobación'), ('rechazo', 'Rechazo'), ('eliminacion', 'Eliminación'),
    ]
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    entidad = GenericForeignKey('content_type', 'object_id')
    numero_version = models.PositiveIntegerField()
    accion = models.CharField(max_length=20, choices=ACCION_CHOICES)
    descripcion_cambios = models.TextField(blank=True)
    snapshot = models.JSONField(default=dict)
    realizado_por = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    fecha = models.DateTimeField(auto_now_add=True)
    archivo_version = models.FileField(upload_to='versiones/%Y/%m/', blank=True, null=True)

    class Meta:
        ordering = ['-fecha']

    def __str__(self):
        return f"v{self.numero_version} - {self.accion} - {self.fecha.strftime('%Y-%m-%d %H:%M')}"

class ComentarioRevision(models.Model):
    version = models.ForeignKey(Version, on_delete=models.CASCADE, related_name='comentarios')
    autor = models.ForeignKey(User, on_delete=models.CASCADE)
    comentario = models.TextField()
    resuelto = models.BooleanField(default=False)
    fecha = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-fecha']
