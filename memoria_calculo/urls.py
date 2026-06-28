from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MemoriaCalculoViewSet, SeccionMemoriaViewSet
router = DefaultRouter()
router.register(r'', MemoriaCalculoViewSet)
router.register(r'secciones', SeccionMemoriaViewSet)
urlpatterns = [path('', include(router.urls))]
