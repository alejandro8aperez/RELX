from django.db import models
from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
from django.core.exceptions import ValidationError

class FlujoAprobacion(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    activo = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        verbose_name = 'Flujo de Aprobación'
    def __str__(self):
        return self.nombre

class EtapaAprobacion(models.Model):
    flujo = models.ForeignKey(FlujoAprobacion, on_delete=models.CASCADE, related_name='etapas')
    orden = models.PositiveIntegerField()
    nombre = models.CharField(max_length=100)
    estado_origen = models.CharField(max_length=50)
    estado_destino = models.CharField(max_length=50)
    requiere_firma = models.BooleanField(default=True)
    requiere_comentario = models.BooleanField(default=False)
    notificar_a = models.ManyToManyField(User, blank=True, related_name='etapas_notificacion')
    class Meta:
        ordering = ['orden']
    def __str__(self):
        return f"{self.flujo.nombre} - {self.nombre}"

class Aprobacion(models.Model):
    ACCION_CHOICES = [
        ('aprobacion', 'Aprobación'), ('rechazo', 'Rechazo'),
        ('verificacion', 'Verificación'), ('revision', 'Revisión'), ('delegacion', 'Delegación'),
    ]
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    entidad = GenericForeignKey('content_type', 'object_id')
    etapa = models.ForeignKey(EtapaAprobacion, on_delete=models.SET_NULL, null=True, blank=True)
    accion = models.CharField(max_length=20, choices=ACCION_CHOICES)
    aprobador = models.ForeignKey(User, on_delete=models.CASCADE, related_name='aprobaciones_realizadas')
    comentario = models.TextField(blank=True)
    firma_digital = models.TextField(blank=True)
    firma_timestamp = models.DateTimeField(null=True, blank=True)
    estado_anterior = models.CharField(max_length=50, blank=True)
    estado_nuevo = models.CharField(max_length=50, blank=True)
    documento_aprobacion = models.FileField(upload_to='aprobaciones/%Y/%m/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        ordering = ['-created_at']
    def __str__(self):
        return f"{self.accion} - {self.aprobador} - {self.created_at.strftime('%Y-%m-%d')}"
    def clean(self):
        if self.etapa and self.estado_nuevo != self.etapa.estado_destino:
            raise ValidationError('El estado nuevo no coincide con el estado destino de la etapa')

class DelegacionAprobacion(models.Model):
    delegador = models.ForeignKey(User, on_delete=models.CASCADE, related_name='delegaciones_hechas')
    delegado = models.ForeignKey(User, on_delete=models.CASCADE, related_name='delegaciones_recibidas')
    flujo = models.ForeignKey(FlujoAprobacion, on_delete=models.CASCADE, blank=True, null=True)
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()
    activa = models.BooleanField(default=True)
    motivo = models.TextField(blank=True)
    class Meta:
        verbose_name = 'Delegación'
    def __str__(self):
        return f"{self.delegador} -> {self.delegado} ({self.fecha_inicio} a {self.fecha_fin})"
