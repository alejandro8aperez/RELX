from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Documento
from .serializers import DocumentoSerializer

class DocumentoViewSet(viewsets.ModelViewSet):
    queryset = Documento.objects.all().select_related('capitulo', 'capitulo__capitulo_maestro', 'autor')
    serializer_class = DocumentoSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['capitulo', 'tipo', 'formato', 'es_version_actual']
    search_fields = ['codigo', 'nombre', 'descripcion']
    ordering_fields = ['fecha_emision', 'created_at', 'version']
