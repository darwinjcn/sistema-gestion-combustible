# combustible_api/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GeneradorViewSet, ConsumoViewSet

router = DefaultRouter()
router.register(r'generadores', GeneradorViewSet)
router.register(r'consumos', ConsumoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]