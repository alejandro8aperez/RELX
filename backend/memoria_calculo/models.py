from django.db import models
from django.contrib.auth.models import User
from capitulos.models import CapituloProyecto

class MemoriaCalculo(models.Model):
    ESTADO_CHOICES = [
        ('borrador', 'Borrador'), ('calculado', 'Calculado'),
        ('verificado', 'Verificado'), ('aprobado', 'Aprobado'),
    ]
    capitulo = models.OneToOneField(CapituloProyecto, on_delete=models.CASCADE, related_name='memoria_calculo')
    codigo = models.CharField(max_length=50, unique=True)
    titulo = models.CharField(max_length=200)
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='borrador')
    normativa = models.CharField(max_length=200, blank=True)
    software = models.CharField(max_length=100, blank=True)
    unidades = models.CharField(max_length=50, default='SI')
    elaborado_por = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='memorias_elaboradas')
    revisado_por = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='memorias_revisadas')
    aprobado_por = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='memorias_aprobadas')
    contenido = models.JSONField(default=dict)
    archivo_principal = models.FileField(upload_to='memorias/%Y/%m/', blank=True, null=True)
    archivo_backup = models.FileField(upload_to='memorias/backup/%Y/%m/', blank=True, null=True)
    version = models.PositiveIntegerField(default=1)
    fecha_version = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.codigo} - {self.titulo} (v{self.version})"

class SeccionMemoria(models.Model):
    TIPO_CHOICES = [
        ('introduccion', 'Introducción'), ('datos', 'Datos de Entrada'),
        ('metodologia', 'Metodología'), ('calculo', 'Desarrollo del Cálculo'),
        ('resultados', 'Resultados'), ('conclusiones', 'Conclusiones'), ('anexos', 'Anexos'),
    ]
    memoria = models.ForeignKey(MemoriaCalculo, on_delete=models.CASCADE, related_name='secciones')
    orden = models.PositiveIntegerField(default=0)
    titulo = models.CharField(max_length=200)
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    contenido = models.TextField()
    formulas = models.JSONField(default=list)
    resultados = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['orden']

    def __str__(self):
        return f"{self.memoria.codigo} - {self.titulo}"
