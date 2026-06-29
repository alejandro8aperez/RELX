from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from django.shortcuts import render
from django.http import Http404
from pathlib import Path

def page_view(request, page_name):
    template_path = f'pages/{page_name}.html'
    full_path = settings.BASE_DIR / 'relx-website' / template_path
    if not full_path.exists():
        raise Http404("Página no encontrada")
    return render(request, template_path)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('aqua8.urls')),
    path('', TemplateView.as_view(template_name='index.html'), name='home'),
    re_path(r'^pages/(?P<page_name>[\w-]+)\.html$', page_view, name='page'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
