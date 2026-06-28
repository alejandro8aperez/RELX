from rest_framework import serializers
from .models import Proyecto, ParticipanteProyecto
from django.contrib.auth.models import User

class UserMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']

class ParticipanteProyectoSerializer(serializers.ModelSerializer):
    usuario = UserMiniSerializer(read_only=True)
    class Meta:
        model = ParticipanteProyecto
        fields = '__all__'

class ProyectoSerializer(serializers.ModelSerializer):
    responsable = UserMiniSerializer(read_only=True)
    participantes = ParticipanteProyectoSerializer(many=True, read_only=True)
    class Meta:
        model = Proyecto
        fields = '__all__'
