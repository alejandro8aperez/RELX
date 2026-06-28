from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CapituloViewSet, CapituloProyectoViewSet
router = DefaultRouter()
router.register(r'maestros', CapituloViewSet)
router.register(r'proyecto', CapituloProyectoViewSet)
urlpatterns = [path('', include(router.urls))]
