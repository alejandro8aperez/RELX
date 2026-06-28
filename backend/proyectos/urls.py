from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProyectoViewSet, ParticipanteProyectoViewSet

router = DefaultRouter()
router.register(r'', ProyectoViewSet)
router.register(r'participantes', ParticipanteProyectoViewSet)

urlpatterns = [path('', include(router.urls))]
