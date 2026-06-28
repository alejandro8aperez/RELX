from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Proyecto, ParticipanteProyecto
from .serializers import ProyectoSerializer, ParticipanteProyectoSerializer

class ProyectoViewSet(viewsets.ModelViewSet):
    queryset = Proyecto.objects.all().prefetch_related('participantes', 'participantes__usuario')
    serializer_class = ProyectoSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['estado', 'tipo', 'responsable']
    search_fields = ['codigo', 'nombre', 'cliente']
    ordering_fields = ['fecha_inicio', 'fecha_entrega', 'created_at']

    @action(detail=True, methods=['post'])
    def cambiar_estado(self, request, pk=None):
        proyecto = self.get_object()
        nuevo_estado = request.data.get('estado')
        if nuevo_estado in dict(Proyecto.ESTADO_CHOICES):
            proyecto.estado = nuevo_estado
            proyecto.save()
            return Response({'status': 'estado actualizado', 'estado': nuevo_estado})
        return Response({'error': 'Estado no válido'}, status=400)

    @action(detail=True, methods=['get'])
    def resumen(self, request, pk=None):
        proyecto = self.get_object()
        capitulos = proyecto.capitulos.all()
        data = {
            'proyecto': ProyectoSerializer(proyecto).data,
            'total_capitulos': capitulos.count(),
            'capitulos_aprobados': capitulos.filter(estado='aprobado').count(),
            'capitulos_en_desarrollo': capitulos.filter(estado='en_desarrollo').count(),
            'capitulos_pendientes': capitulos.filter(estado='pendiente').count(),
        }
        return Response(data)

class ParticipanteProyectoViewSet(viewsets.ModelViewSet):
    queryset = ParticipanteProyecto.objects.all()
    serializer_class = ParticipanteProyectoSerializer
