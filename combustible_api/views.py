# combustible_api/views.py

from rest_framework import viewsets
from .models import GeneradorElectrico, DatosConsumo
from .serializers import GeneradorSerializer, ConsumoSerializer
from django.http import HttpResponse
from rest_framework.exceptions import ValidationError
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated


def home(request):
    return HttpResponse("Bienvenido al Sistema Web de Gestión de Combustible - CANTV Lara")


class GeneradorViewSet(viewsets.ModelViewSet):
    """
    API endpoint para ver y editar datos de generadores eléctricos.
    """
    queryset = GeneradorElectrico.objects.all()
    serializer_class = GeneradorSerializer
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]


class ConsumoViewSet(viewsets.ModelViewSet):
    """
    API endpoint para registrar y mostrar consumos.
    """
    # AGREGAR ESTA LÍNEA - Define el queryset base
    queryset = DatosConsumo.objects.all()
    serializer_class = ConsumoSerializer
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Filtra los registros por:
        - ?generador=ID
        - ?desde=YYYY-MM-DD
        - ?hasta=YYYY-MM-DD
        """
        # Usar el queryset base y aplicar filtros
        queryset = self.queryset

        # Filtro por ID del generador
        generador_id = self.request.query_params.get('generador')
        if generador_id:
            try:
                generador_id = int(generador_id)
                queryset = queryset.filter(generador_id=generador_id)
            except ValueError:
                raise ValidationError("El ID del generador debe ser un número válido.")

        # Filtro por fecha desde
        desde_fecha = self.request.query_params.get('desde')
        if desde_fecha:
            queryset = queryset.filter(fecha__gte=desde_fecha)

        # Filtro por fecha hasta
        hasta_fecha = self.request.query_params.get('hasta')
        if hasta_fecha:
            queryset = queryset.filter(fecha__lte=hasta_fecha)

        return queryset.order_by('-fecha')

    def perform_create(self, serializer):
        """
        Calcula o recibe el consumo desde el frontend.
        """
        # Obtener datos del formulario
        generador_id = self.request.data.get('generador')
        nivel_actual = float(self.request.data.get('nivel_actual', 0))
        consumo = float(self.request.data.get('consumo', 0))

        # Validar que el generador exista
        try:
            generador = GeneradorElectrico.objects.get(id=int(generador_id))
        except (GeneradorElectrico.DoesNotExist, ValueError):
            raise ValidationError("El generador especificado no existe.")

        # Calcular consumo si no se envía manualmente
        if consumo == 0:
            ultimo_registro = DatosConsumo.objects.filter(generador=generador).order_by('-fecha').first()
            nivel_anterior = ultimo_registro.nivel_actual if ultimo_registro else nivel_actual
            consumo_calculado = abs(nivel_anterior - nivel_actual)
        else:
            consumo_calculado = consumo

        # Guardamos los datos
        serializer.save(
            generador=generador,
            nivel_actual=nivel_actual,
            consumo=consumo_calculado
        )