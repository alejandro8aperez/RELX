from rest_framework import serializers
from .models import Documento
from proyectos.serializers import UserMiniSerializer

class DocumentoSerializer(serializers.ModelSerializer):
    autor = UserMiniSerializer(read_only=True)
    capitulo_nombre = serializers.CharField(source='capitulo.capitulo_maestro.nombre', read_only=True)
    class Meta:
        model = Documento
        fields = '__all__'
