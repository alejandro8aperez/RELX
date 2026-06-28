from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from django.contrib.contenttypes.models import ContentType
from hashlib import sha256
from .models import FlujoAprobacion, EtapaAprobacion, Aprobacion, DelegacionAprobacion
from .serializers import FlujoAprobacionSerializer, EtapaAprobacionSerializer, AprobacionSerializer, DelegacionAprobacionSerializer

class FlujoAprobacionViewSet(viewsets.ModelViewSet):
    queryset = FlujoAprobacion.objects.filter(activo=True).prefetch_related('etapas')
    serializer_class = FlujoAprobacionSerializer

class EtapaAprobacionViewSet(viewsets.ModelViewSet):
    queryset = EtapaAprobacion.objects.all().select_related('flujo')
    serializer_class = EtapaAprobacionSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['flujo', 'estado_origen', 'estado_destino']

class AprobacionViewSet(viewsets.ModelViewSet):
    queryset = Aprobacion.objects.all().select_related('aprobador', 'etapa', 'content_type')
    serializer_class = AprobacionSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['accion', 'aprobador', 'content_type', 'object_id']

    def _generar_firma(self, aprobacion):
        data = f"{aprobacion.id}:{aprobacion.aprobador.id}:{aprobacion.created_at.isoformat()}:{aprobacion.accion}"
        return sha256(data.encode()).hexdigest()

    def perform_create(self, serializer):
        aprobacion = serializer.save(aprobador=self.request.user)
        aprobacion.firma_digital = self._generar_firma(aprobacion)
        aprobacion.firma_timestamp = timezone.now()
        aprobacion.save()
        return aprobacion

    @action(detail=False, methods=['post'])
    def transicionar(self, request):
        content_type_id = request.data.get('content_type')
        object_id = request.data.get('object_id')
        accion = request.data.get('accion')
        comentario = request.data.get('comentario', '')
        try:
            ct = ContentType.objects.get(id=content_type_id)
            entidad = ct.get_object_for_this_type(id=object_id)
        except Exception:
            return Response({'error': 'Entidad no encontrada'}, status=status.HTTP_404_NOT_FOUND)
        flujo = FlujoAprobacion.objects.filter(content_type=ct, activo=True).first()
        estado_anterior = getattr(entidad, 'estado', '')
        estados_memoria = {
            'borrador': {'aprobacion': 'calculado', 'rechazo': 'borrador'},
            'calculado': {'aprobacion': 'verificado', 'rechazo': 'borrador'},
            'verificado': {'aprobacion': 'aprobado', 'rechazo': 'calculado'},
            'aprobado': {'aprobacion': 'aprobado', 'rechazo': 'verificado'},
        }
        estados_capitulo = {
            'pendiente': {'aprobacion': 'en_desarrollo', 'rechazo': 'pendiente'},
            'en_desarrollo': {'aprobacion': 'en_revision', 'rechazo': 'pendiente'},
            'en_revision': {'aprobacion': 'aprobado', 'rechazo': 'en_desarrollo'},
            'aprobado': {'aprobacion': 'aprobado', 'rechazo': 'en_revision'},
        }
        estado_map = estados_memoria if hasattr(entidad, 'normativa') else estados_capitulo
        estado_nuevo = estado_map.get(estado_anterior, {}).get(accion, estado_anterior)
        entidad.estado = estado_nuevo
        if hasattr(entidad, 'version'): entidad.version += 1
        entidad.save()
        etapa = None
        if flujo:
            etapa = EtapaAprobacion.objects.filter(flujo=flujo, estado_origen=estado_anterior, estado_destino=estado_nuevo).first()
        aprobacion = Aprobacion.objects.create(content_type=ct, object_id=object_id, etapa=etapa, accion=accion,
            aprobador=request.user, comentario=comentario, estado_anterior=estado_anterior, estado_nuevo=estado_nuevo)
        aprobacion.firma_digital = self._generar_firma(aprobacion)
        aprobacion.firma_timestamp = timezone.now()
        aprobacion.save()
        return Response({'status': 'Transición realizada', 'estado_anterior': estado_anterior, 'estado_nuevo': estado_nuevo,
            'aprobacion': AprobacionSerializer(aprobacion).data})

    @action(detail=False, methods=['get'])
    def historial(self, request):
        content_type_id = request.query_params.get('content_type')
        object_id = request.query_params.get('object_id')
        if not content_type_id or not object_id:
            return Response({'error': 'Se requiere content_type y object_id'}, status=400)
        aprobaciones = self.queryset.filter(content_type_id=content_type_id, object_id=object_id)
        return Response(self.get_serializer(aprobaciones, many=True).data)

class DelegacionAprobacionViewSet(viewsets.ModelViewSet):
    queryset = DelegacionAprobacion.objects.all().select_related('delegador', 'delegado', 'flujo')
    serializer_class = DelegacionAprobacionSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['delegador', 'delegado', 'activa', 'flujo']
