from rest_framework import viewsets
from .models import GeneradorElectrico, DatosConsumo
from .serializers import GeneradorSerializer, ConsumoSerializer

class GeneradorViewSet(viewsets.ModelViewSet):
    queryset = GeneradorElectrico.objects.all()
    serializer_class = GeneradorSerializer

class ConsumoViewSet(viewsets.ModelViewSet):
    queryset = DatosConsumo.objects.all()
    serializer_class = ConsumoSerializer