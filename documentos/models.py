from django.db import models
from django.contrib.auth.models import User
from capitulos.models import CapituloProyecto

class Documento(models.Model):
    TIPO_CHOICES = [
        ('especificacion', 'Especificación Técnica'), ('planos', 'Planos'),
        ('informe', 'Informe Técnico'), ('acta', 'Acta de Revisión'),
        ('correspondencia', 'Correspondencia'), ('anexo', 'Anexo'), ('otro', 'Otro'),
    ]
    FORMATO_CHOICES = [
        ('pdf', 'PDF'), ('dwg', 'AutoCAD DWG'), ('docx', 'Word'),
        ('xlsx', 'Excel'), ('md', 'Markdown'), ('tex', 'LaTeX'),
        ('jpg', 'Imagen'), ('png', 'Imagen PNG'),
    ]
    capitulo = models.ForeignKey(CapituloProyecto, on_delete=models.CASCADE, related_name='documentos')
    codigo = models.CharField(max_length=50)
    nombre = models.CharField(max_length=200)
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    formato = models.CharField(max_length=10, choices=FORMATO_CHOICES)
    archivo = models.FileField(upload_to='documentos/%Y/%m/')
    descripcion = models.TextField(blank=True)
    autor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='documentos_creados')
    version = models.PositiveIntegerField(default=1)
    es_version_actual = models.BooleanField(default=True)
    fecha_emision = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.codigo} - {self.nombre} (v{self.version})"
