from django.utils import timezone
from django.http import HttpResponse
from django.contrib.contenttypes.models import ContentType
from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import MemoriaCalculo, SeccionMemoria
from .serializers import MemoriaCalculoSerializer, SeccionMemoriaSerializer
from utils.pdf_generator import MemoriaPDFGenerator
from aprobaciones.models import Aprobacion

class MemoriaCalculoViewSet(viewsets.ModelViewSet):
    queryset = MemoriaCalculo.objects.all().prefetch_related('secciones', 'capitulo__proyecto', 'capitulo__capitulo_maestro')
    serializer_class = MemoriaCalculoSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['estado', 'capitulo__proyecto', 'normativa']
    search_fields = ['codigo', 'titulo']

    @action(detail=True, methods=['post'])
    def nueva_version(self, request, pk=None):
        memoria = self.get_object()
        memoria.version += 1
        memoria.fecha_version = timezone.now()
        memoria.save()
        return Response({'status': 'versión incrementada', 'version': memoria.version})

    @action(detail=True, methods=['get'])
    def generar_pdf(self, request, pk=None):
        memoria = self.get_object()
        generator = MemoriaPDFGenerator(memoria)
        pdf = generator.generate()
        response = HttpResponse(pdf, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="memoria_{memoria.codigo}_v{memoria.version}.pdf"'
        return response

    @action(detail=True, methods=['post'])
    def aprobar(self, request, pk=None):
        memoria = self.get_object()
        comentario = request.data.get('comentario', '')
        if memoria.estado == 'aprobado':
            return Response({'error': 'La memoria ya está aprobada'}, status=400)
        estado_anterior = memoria.estado
        transiciones = {'borrador': 'calculado', 'calculado': 'verificado', 'verificado': 'aprobado'}
        nuevo_estado = transiciones.get(memoria.estado, memoria.estado)
        memoria.estado = nuevo_estado
        if nuevo_estado == 'aprobado': memoria.aprobado_por = request.user
        elif nuevo_estado == 'verificado': memoria.revisado_por = request.user
        memoria.version += 1
        memoria.save()
        ct = ContentType.objects.get_for_model(MemoriaCalculo)
        Aprobacion.objects.create(content_type=ct, object_id=memoria.id, accion='aprobacion',
            aprobador=request.user, comentario=comentario, estado_anterior=estado_anterior, estado_nuevo=nuevo_estado)
        return Response({'status': 'Memoria aprobada', 'estado_anterior': estado_anterior, 'estado_nuevo': nuevo_estado, 'version': memoria.version})

    @action(detail=True, methods=['post'])
    def rechazar(self, request, pk=None):
        memoria = self.get_object()
        comentario = request.data.get('comentario', '')
        if not comentario:
            return Response({'error': 'El rechazo requiere un comentario'}, status=400)
        estado_anterior = memoria.estado
        transiciones = {'calculado': 'borrador', 'verificado': 'calculado', 'aprobado': 'verificado'}
        nuevo_estado = transiciones.get(memoria.estado, 'borrador')
        memoria.estado = nuevo_estado
        memoria.save()
        ct = ContentType.objects.get_for_model(MemoriaCalculo)
        Aprobacion.objects.create(content_type=ct, object_id=memoria.id, accion='rechazo',
            aprobador=request.user, comentario=comentario, estado_anterior=estado_anterior, estado_nuevo=nuevo_estado)
        return Response({'status': 'Memoria rechazada', 'estado_anterior': estado_anterior, 'estado_nuevo': nuevo_estado})

    @action(detail=True, methods=['get'])
    def historial_aprobaciones(self, request, pk=None):
        memoria = self.get_object()
        ct = ContentType.objects.get_for_model(MemoriaCalculo)
        aprobaciones = Aprobacion.objects.filter(content_type=ct, object_id=memoria.id).select_related('aprobador').order_by('-created_at')
        from aprobaciones.serializers import AprobacionSerializer
        return Response(AprobacionSerializer(aprobaciones, many=True).data)

class SeccionMemoriaViewSet(viewsets.ModelViewSet):
    queryset = SeccionMemoria.objects.all().select_related('memoria')
    serializer_class = SeccionMemoriaSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['memoria', 'tipo']
