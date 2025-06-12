# combustible_api/views.py

from rest_framework import viewsets
from .models import GeneradorElectrico, DatosConsumo
from .serializers import GeneradorSerializer, ConsumoSerializer
from django.http import JsonResponse, HttpResponse
from django.views import View


def home(request):
    return HttpResponse("¡Bienvenido al Sistema Web de Gestión de Combustible - CANTV Lara!")

# --- Vistas para la API REST ---
class GeneradorViewSet(viewsets.ModelViewSet):
    """
    API endpoint para ver y editar datos de generadores eléctricos.
    """
    queryset = GeneradorElectrico.objects.all()
    serializer_class = GeneradorSerializer


class ConsumoViewSet(viewsets.ModelViewSet):
    """
    API endpoint para ver y editar registros de consumo de combustible.
    """
    queryset = DatosConsumo.objects.all()
    serializer_class = ConsumoSerializer

    def perform_create(self, serializer):
        generador = self.request.data.get('generador')
        nivel_actual = float(self.request.data.get('nivel_actual'))
        
        # Obtiene el último nivel registrado del generador
        ultimo_registro = DatosConsumo.objects.filter(generador_id=generador).order_by('-fecha').first()
        nivel_anterior = ultimo_registro.nivel_actual if ultimo_registro else nivel_actual

        consumo_calculado = abs(nivel_anterior - nivel_actual)

        serializer.save(
            consumo=consumo_calculado
        )


# --- Vistas HTML (opcional) ---
def index(request):
    """
    Vista básica de bienvenida del sistema web.
    """
    return JsonResponse({
        "mensaje": "¡Bienvenido al Sistema Web de Gestión de Combustible - CANTV Lara!",
        "endpoints": {
            "generadores": "/api/generadores/",
            "consumos": "/api/consumos/"
        }
    })


class HomeView(View):
    """
    Página inicial del sistema web (puedes conectarla con un frontend React.js)
    """
    def get(self, request):
        return HttpResponse("""
        <h1>Sistema Web de Gestión de Combustible</h1>
        <p>Bienvenido al prototipo del sistema desarrollado para CANTV Lara.</p>
        <ul>
            <li><a href="/api/generadores/">Ver Generadores</a></li>
            <li><a href="/api/consumos/">Ver Registros de Consumo</a></li>
        </ul>
        """)