from rest_framework import serializers
from .models import PerfilUsuario
from django.contrib.auth.models import User

class PerfilUsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = PerfilUsuario
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    perfil = PerfilUsuarioSerializer(read_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'perfil', 'is_staff', 'date_joined']
