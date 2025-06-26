# combustible_api/views.py

from rest_framework import viewsets
from .models import GeneradorElectrico, DatosConsumo
from .serializers import GeneradorSerializer, ConsumoSerializer
from django.http import HttpResponse


def home(request):
    return HttpResponse("Bienvenido al Sistema Web de Gestión de Combustible - CANTV Lara")


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
        """
        Calcula o recibe el consumo según lo enviado desde el frontend.
        """
        # Obtener datos del formulario
        generador_id = self.request.data.get('generador')
        nivel_actual = float(self.request.data.get('nivel_actual', 0))
        consumo = float(self.request.data.get('consumo', 0))  # Si no viene, usa 0

        try:
            generador = GeneradorElectrico.objects.get(id=int(generador_id))
        except (GeneradorElectrico.DoesNotExist, ValueError):
            raise serializers.ValidationError("El generador especificado no existe.")

        # Si el consumo es 0, calcularlo automáticamente basado en el último registro
        if consumo == 0:
            ultimo_registro = DatosConsumo.objects.filter(generador=generador).order_by('-fecha').first()
            nivel_anterior = ultimo_registro.nivel_actual if ultimo_registro else nivel_actual
            consumo_calculado = abs(nivel_anterior - nivel_actual)
        else:
            consumo_calculado = consumo

        # Guardar con los valores calculados o enviados
        serializer.save(
            generador=generador,
            nivel_actual=nivel_actual,
            consumo=consumo_calculado
        )