from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.contenttypes.models import ContentType
from .models import Capitulo, CapituloProyecto
from .serializers import CapituloSerializer, CapituloProyectoSerializer
from aprobaciones.models import Aprobacion

class CapituloViewSet(viewsets.ModelViewSet):
    queryset = Capitulo.objects.filter(activo=True)
    serializer_class = CapituloSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['disciplina']
    search_fields = ['codigo', 'nombre']

class CapituloProyectoViewSet(viewsets.ModelViewSet):
    queryset = CapituloProyecto.objects.all().select_related('capitulo_maestro', 'proyecto', 'responsable')
    serializer_class = CapituloProyectoSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['proyecto', 'estado', 'capitulo_maestro__disciplina']
    ordering_fields = ['capitulo_maestro__orden', 'fecha_inicio']

    @action(detail=True, methods=['post'])
    def avanzar_estado(self, request, pk=None):
        cp = self.get_object()
        comentario = request.data.get('comentario', '')
        estados = ['pendiente', 'en_desarrollo', 'en_revision', 'aprobado']
        estado_anterior = cp.estado
        try:
            idx = estados.index(cp.estado)
            if idx < len(estados) - 1:
                cp.estado = estados[idx + 1]
                cp.version_actual += 1
                cp.save()
                ct = ContentType.objects.get_for_model(CapituloProyecto)
                Aprobacion.objects.create(content_type=ct, object_id=cp.id, accion='aprobacion',
                    aprobador=request.user, comentario=comentario, estado_anterior=estado_anterior, estado_nuevo=cp.estado)
                return Response({'status': 'avanzado', 'nuevo_estado': cp.estado, 'version': cp.version_actual})
            return Response({'status': 'ya está en estado final'})
        except ValueError:
            return Response({'error': 'Estado no reconocido'}, status=400)

    @action(detail=True, methods=['post'])
    def retroceder_estado(self, request, pk=None):
        cp = self.get_object()
        comentario = request.data.get('comentario', '')
        if not comentario:
            return Response({'error': 'El retroceso requiere un comentario'}, status=400)
        estados = ['pendiente', 'en_desarrollo', 'en_revision', 'aprobado']
        estado_anterior = cp.estado
        try:
            idx = estados.index(cp.estado)
            if idx > 0:
                cp.estado = estados[idx - 1]
                cp.save()
                ct = ContentType.objects.get_for_model(CapituloProyecto)
                Aprobacion.objects.create(content_type=ct, object_id=cp.id, accion='rechazo',
                    aprobador=request.user, comentario=comentario, estado_anterior=estado_anterior, estado_nuevo=cp.estado)
                return Response({'status': 'retrocedido', 'nuevo_estado': cp.estado})
            return Response({'status': 'ya está en estado inicial'})
        except ValueError:
            return Response({'error': 'Estado no reconocido'}, status=400)

    @action(detail=True, methods=['get'])
    def historial_aprobaciones(self, request, pk=None):
        cp = self.get_object()
        ct = ContentType.objects.get_for_model(CapituloProyecto)
        aprobaciones = Aprobacion.objects.filter(content_type=ct, object_id=cp.id).select_related('aprobador').order_by('-created_at')
        from aprobaciones.serializers import AprobacionSerializer
        return Response(AprobacionSerializer(aprobaciones, many=True).data)
