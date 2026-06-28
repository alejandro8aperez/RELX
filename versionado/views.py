from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Version, ComentarioRevision
from .serializers import VersionSerializer, ComentarioRevisionSerializer

class VersionViewSet(viewsets.ModelViewSet):
    queryset = Version.objects.all().select_related('realizado_por').prefetch_related('comentarios')
    serializer_class = VersionSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['content_type', 'accion', 'realizado_por']
    ordering_fields = ['fecha', 'numero_version']

class ComentarioRevisionViewSet(viewsets.ModelViewSet):
    queryset = ComentarioRevision.objects.all()
    serializer_class = ComentarioRevisionSerializer
    filterset_fields = ['version', 'resuelto']
