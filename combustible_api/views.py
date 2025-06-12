# combustible_api/views.py

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
        generador_id = self.request.data.get('generador')

        try:
            generador = GeneradorElectrico.objects.get(id=int(generador_id))
        except (GeneradorElectrico.DoesNotExist, ValueError):
            raise serializers.ValidationError("El generador especificado no existe.")

        nivel_actual = float(self.request.data.get('nivel_actual', 0))

        # Obtiene el último nivel registrado para este generador
        ultimo_registro = DatosConsumo.objects.filter(generador_id=generador_id).order_by('-fecha').first()
        nivel_anterior = ultimo_registro.nivel_actual if ultimo_registro else nivel_actual

        # Calcula el consumo basado en la diferencia
        consumo_calculado = abs(nivel_anterior - nivel_actual)

        # Guardamos con el cálculo realizado
        serializer.save(
            generador_id=generador.id,
            consumo=consumo_calculado,
            nivel_actual=nivel_actual
        )

# --- Vistas HTML (opcional) ---
def index(request):
    return JsonResponse({
        "mensaje": "¡Bienvenido al Sistema Web de Gestión de Combustible - CANTV Lara!",
        "endpoints": {
            "generadores": "/api/generadores/",
            "consumos": "/api/consumos/"
        }
    })


class HomeView(View):
    def get(self, request):
        return HttpResponse("""
        <h1>Sistema Web de Gestión de Combustible</h1>
        <p>Bienvenido al prototipo del sistema desarrollado para CANTV Lara.</p>
        <ul>
          <li><a href="/api/generadores/">Ver Generadores</a></li>
          <li><a href="/api/consumos/">Ver Registros de Consumo</a></li>
        </ul>
        """)