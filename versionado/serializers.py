from rest_framework import serializers
from .models import Version, ComentarioRevision
from proyectos.serializers import UserMiniSerializer

class ComentarioRevisionSerializer(serializers.ModelSerializer):
    autor = UserMiniSerializer(read_only=True)
    class Meta:
        model = ComentarioRevision
        fields = '__all__'

class VersionSerializer(serializers.ModelSerializer):
    realizado_por = UserMiniSerializer(read_only=True)
    comentarios = ComentarioRevisionSerializer(many=True, read_only=True)
    entidad_tipo = serializers.CharField(source='content_type.model', read_only=True)
    class Meta:
        model = Version
        fields = '__all__'
