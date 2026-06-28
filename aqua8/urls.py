from django.urls import path
from . import views

urlpatterns = [
    path('telemetry/', views.telemetry, name='telemetry'),
    path('alarms/', views.alarms, name='alarms'),
    path('historical/', views.historical, name='historical'),
    path('status/', views.system_status, name='system_status'),
    path('simulate/', views.simulate_tick, name='simulate_tick'),
]
