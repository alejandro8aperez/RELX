from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/proyectos/', include('proyectos.urls')),
    path('api/capitulos/', include('capitulos.urls')),
    path('api/documentos/', include('documentos.urls')),
    path('api/memoria/', include('memoria_calculo.urls')),
    path('api/versionado/', include('versionado.urls')),
    path('api/usuarios/', include('usuarios.urls')),
    path('api/aprobaciones/', include('aprobaciones.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
