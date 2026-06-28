from django.db import models

class Module(models.Model):
    MODULE_CHOICES = [
        ('A', 'Captación y Pretratamiento'),
        ('B', 'Ósmosis Inversa (RO)'),
        ('C', 'Postratamiento y Almacenamiento'),
        ('D', 'Energía Solar y SCADA'),
    ]

    code = models.CharField(max_length=1, choices=MODULE_CHOICES, unique=True)
    name = models.CharField(max_length=100)
    status = models.CharField(max_length=20, default='online')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Módulo {self.code}: {self.name}"

class TelemetryReading(models.Model):
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='readings')
    temperature = models.FloatField(null=True, blank=True)
    pressure = models.FloatField(null=True, blank=True)
    flow_rate = models.FloatField(null=True, blank=True)
    tds_in = models.FloatField(null=True, blank=True, verbose_name='TDS Entrada (ppm)')
    tds_out = models.FloatField(null=True, blank=True, verbose_name='TDS Salida (ppm)')
    tank_level = models.FloatField(null=True, blank=True, verbose_name='Nivel Tanque (%)')
    solar_production = models.FloatField(null=True, blank=True, verbose_name='Producción Solar (kW)')
    battery_level = models.FloatField(null=True, blank=True, verbose_name='Batería (%)')
    energy_consumption = models.FloatField(null=True, blank=True, verbose_name='Consumo (kW)')
    scada_status = models.CharField(max_length=50, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.module} @ {self.timestamp.strftime('%Y-%m-%d %H:%M:%S')}"

class Alarm(models.Model):
    ALARM_TYPES = [
        ('info', 'Información'),
        ('warning', 'Advertencia'),
        ('critical', 'Crítica'),
    ]

    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='alarms', null=True, blank=True)
    alarm_type = models.CharField(max_length=20, choices=ALARM_TYPES, default='info')
    message = models.TextField()
    is_resolved = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"[{self.alarm_type.upper()}] {self.message[:50]}"

class Proyecto(models.Model):
    codigo = models.CharField(max_length=50, unique=True)
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True)
    ubicacion = models.CharField(max_length=200, blank=True)
    estado = models.CharField(max_length=20, choices=[
        ('planificado', 'Planificado'),
        ('ejecucion', 'En Ejecución'),
        ('aprobado', 'Aprobado'),
        ('completado', 'Completado'),
    ], default='planificado')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.codigo}: {self.nombre}"


class CapituloMaestro(models.Model):
    codigo = models.CharField(max_length=50, unique=True)
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True)

    def __str__(self):
        return f"{self.codigo}: {self.nombre}"


class Capitulo(models.Model):
    proyecto = models.ForeignKey(Proyecto, on_delete=models.CASCADE, related_name='capitulos')
    capitulo_maestro = models.ForeignKey(CapituloMaestro, on_delete=models.CASCADE)
    estado = models.CharField(max_length=20, choices=[
        ('pendiente', 'Pendiente'),
        ('en_revision', 'En Revisión'),
        ('aprobado', 'Aprobado'),
    ], default='pendiente')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('proyecto', 'capitulo_maestro')

    def __str__(self):
        return f"{self.proyecto.codigo} - {self.capitulo_maestro.codigo}"


class Documento(models.Model):
    proyecto = models.ForeignKey(Proyecto, on_delete=models.CASCADE, null=True, blank=True, related_name='documentos')
    nombre = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True)
    tipo = models.CharField(max_length=20, choices=[
        ('pdf', 'PDF'),
        ('docx', 'Word'),
        ('xlsx', 'Excel'),
        ('jpg', 'Imagen'),
        ('dwg', 'AutoCAD'),
        ('zip', 'Comprimido'),
        ('otro', 'Otro'),
    ], default='pdf')
    tamano = models.CharField(max_length=20, blank=True)
    archivo = models.FileField(upload_to='documentos/', null=True, blank=True)
    fecha_subida = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nombre


class MemoriaCalculo(models.Model):
    proyecto = models.ForeignKey(Proyecto, on_delete=models.CASCADE, null=True, blank=True, related_name='memorias')
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True)
    tipo_calculo = models.CharField(max_length=100, blank=True)
    resultado = models.CharField(max_length=200, blank=True)
    estado = models.CharField(max_length=20, choices=[
        ('pendiente', 'Pendiente'),
        ('en_revision', 'En Revisión'),
        ('aprobado', 'Aprobado'),
    ], default='pendiente')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.titulo


class SystemStatus(models.Model):
    platform_name = models.CharField(max_length=100, default='AQUA-8 Cloud')
    version = models.CharField(max_length=20, default='1.0.0')
    location_name = models.CharField(max_length=100, default='Manaure, La Guajira')
    latitude = models.FloatField(default=11.78)
    longitude = models.FloatField(default=-72.45)
    total_production_liters = models.BigIntegerField(default=0)
    started_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'System Status'
        verbose_name_plural = 'System Status'

    def __str__(self):
        return f"{self.platform_name} v{self.version}"
