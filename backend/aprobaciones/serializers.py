from rest_framework import serializers
from .models import FlujoAprobacion, EtapaAprobacion, Aprobacion, DelegacionAprobacion
from proyectos.serializers import UserMiniSerializer

class EtapaAprobacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = EtapaAprobacion
        fields = '__all__'

class FlujoAprobacionSerializer(serializers.ModelSerializer):
    etapas = EtapaAprobacionSerializer(many=True, read_only=True)
    class Meta:
        model = FlujoAprobacion
        fields = '__all__'

class AprobacionSerializer(serializers.ModelSerializer):
    aprobador = UserMiniSerializer(read_only=True)
    entidad_tipo = serializers.CharField(source='content_type.model', read_only=True)
    class Meta:
        model = Aprobacion
        fields = '__all__'
        read_only_fields = ['firma_digital', 'firma_timestamp']

class DelegacionAprobacionSerializer(serializers.ModelSerializer):
    delegador = UserMiniSerializer(read_only=True)
    delegado = UserMiniSerializer(read_only=True)
    class Meta:
        model = DelegacionAprobacion
        fields = '__all__'
