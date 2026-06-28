from rest_framework import serializers
from .models import MemoriaCalculo, SeccionMemoria
from proyectos.serializers import UserMiniSerializer

class SeccionMemoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = SeccionMemoria
        fields = '__all__'

class MemoriaCalculoSerializer(serializers.ModelSerializer):
    elaborado_por = UserMiniSerializer(read_only=True)
    revisado_por = UserMiniSerializer(read_only=True)
    aprobado_por = UserMiniSerializer(read_only=True)
    secciones = SeccionMemoriaSerializer(many=True, read_only=True)
    capitulo_nombre = serializers.CharField(source='capitulo.capitulo_maestro.nombre', read_only=True)
    proyecto_codigo = serializers.CharField(source='capitulo.proyecto.codigo', read_only=True)
    class Meta:
        model = MemoriaCalculo
        fields = '__all__'
