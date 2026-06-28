from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FlujoAprobacionViewSet, EtapaAprobacionViewSet, AprobacionViewSet, DelegacionAprobacionViewSet
router = DefaultRouter()
router.register(r'flujos', FlujoAprobacionViewSet)
router.register(r'etapas', EtapaAprobacionViewSet)
router.register(r'', AprobacionViewSet)
router.register(r'delegaciones', DelegacionAprobacionViewSet)
urlpatterns = [path('', include(router.urls))]
