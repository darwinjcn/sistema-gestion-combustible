# combustible_api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Router para los ViewSets
router = DefaultRouter()
router.register(r'generadores', views.GeneradorViewSet)
router.register(r'consumos', views.ConsumoViewSet)

urlpatterns = [
    # Incluir todas las rutas del router
    path('', include(router.urls)),
    
    # Vista personalizada (opcional)
    path('status/', views.api_status, name='api_status'),
]