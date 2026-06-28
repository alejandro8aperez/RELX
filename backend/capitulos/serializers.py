from rest_framework import serializers
from .models import Capitulo, CapituloProyecto
from proyectos.serializers import UserMiniSerializer

class CapituloSerializer(serializers.ModelSerializer):
    class Meta:
        model = Capitulo
        fields = '__all__'

class CapituloProyectoSerializer(serializers.ModelSerializer):
    capitulo_maestro = CapituloSerializer(read_only=True)
    responsable = UserMiniSerializer(read_only=True)
    class Meta:
        model = CapituloProyecto
        fields = '__all__'
        depth = 1
