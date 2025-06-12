# views.py

from rest_framework import viewsets, serializers
from .models import GeneradorElectrico, DatosConsumo
from .serializers import GeneradorSerializer, ConsumoSerializer
from django.http import JsonResponse, HttpResponse
from django.views import View


def home(request):
    return HttpResponse("¡Bienvenido al Sistema Web de Gestión de Combustible - CANTV Lara!")


# --- Vistas para la API REST ---
class GeneradorViewSet(viewsets.ModelViewSet):
    queryset = GeneradorElectrico.objects.all()
    serializer_class = GeneradorSerializer


class ConsumoViewSet(viewsets.ModelViewSet):
    queryset = DatosConsumo.objects.all()
    serializer_class = ConsumoSerializer

    def perform_create(self, serializer):
        # Obtiene el ID del generador desde request.data
        generador_id = self.request.data.get('generador')

        try:
            generador = GeneradorElectrico.objects.get(id=int(generador_id))
        except (GeneradorElectrico.DoesNotExist, ValueError):
            raise serializers.ValidationError("El generador especificado no existe.")

        nivel_actual = float(self.request.data.get('nivel_actual', 0))
        consumo = float(self.request.data.get('consumo', 0))  # Usa el consumo enviado

        # Calcula el consumo basado en el nivel anterior
        ultimo_registro = DatosConsumo.objects.filter(generador=generador).order_by('-fecha').first()
        nivel_anterior = ultimo_registro.nivel_actual if ultimo_registro else nivel_actual

        # Guardamos con el cálculo realizado
        serializer.save(
            generador=generador,
            consumo=consumo,  # Usa el consumo enviado o calculado
            nivel_actual=nivel_actual
        )