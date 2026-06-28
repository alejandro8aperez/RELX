from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VersionViewSet, ComentarioRevisionViewSet
router = DefaultRouter()
router.register(r'', VersionViewSet)
router.register(r'comentarios', ComentarioRevisionViewSet)
urlpatterns = [path('', include(router.urls))]
