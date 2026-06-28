from rest_framework import viewsets
from django.contrib.auth.models import User
from .models import PerfilUsuario
from .serializers import UserSerializer, PerfilUsuarioSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().select_related('perfil')
    serializer_class = UserSerializer

class PerfilUsuarioViewSet(viewsets.ModelViewSet):
    queryset = PerfilUsuario.objects.all()
    serializer_class = PerfilUsuarioSerializer
