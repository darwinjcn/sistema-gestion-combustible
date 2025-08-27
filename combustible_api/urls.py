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

    # ✅ NUEVA: Ruta para carga masiva
    path('carga-masiva/', views.cargar_datos_masivos, name='carga_masiva'),
]