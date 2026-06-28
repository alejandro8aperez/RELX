from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'proyectos', views.ProyectoViewSet)
router.register(r'capitulos', views.CapituloViewSet)
router.register(r'documentos', views.DocumentoViewSet)
router.register(r'memoria', views.MemoriaCalculoViewSet)
router.register(r'presupuesto/categorias', views.CategoriaPresupuestoViewSet)
router.register(r'presupuesto/partidas', views.PartidaPresupuestariaViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('telemetry/', views.telemetry, name='telemetry'),
    path('alarms/', views.alarms, name='alarms'),
    path('historical/', views.historical, name='historical'),
    path('status/', views.system_status, name='system_status'),
    path('simulate/', views.simulate_tick, name='simulate_tick'),
]
