from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from .models import GeneradorElectrico, DatosConsumo
from .serializers import GeneradorSerializer, ConsumoSerializer
from django.http import HttpResponse, JsonResponse
from rest_framework.exceptions import ValidationError
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
import logging

logger = logging.getLogger(__name__)

def home(request):
    return HttpResponse("Bienvenido al Sistema Web de Gestión de Combustible - CANTV Lara")

@api_view(['GET'])
def api_root(request, format=None):
    """Punto de entrada principal de la API con enlaces a todos los endpoints"""
    return Response({
        'message': 'API de Gestión de Combustible CANTV Lara',
        'version': '1.0.0',
        'status': 'OK',
        'endpoints': {
            'generadores': reverse('generadorelectrico-list', request=request, format=format),
            'consumos': reverse('datosconsumo-list', request=request, format=format),
            'status': reverse('api_status', request=request, format=format),
        },
        'authentication': {
            'login': request.build_absolute_uri('/api/auth/login/'),
            'logout': request.build_absolute_uri('/api/auth/logout/'),
            'token': request.build_absolute_uri('/api/token-auth/'),
        }
    })

@api_view(['GET'])
def api_status(request):
    """Endpoint para verificar el estado de la API"""
    try:
        # Verificar conexión a base de datos
        total_generadores = GeneradorElectrico.objects.count()
        total_consumos = DatosConsumo.objects.count()
        
        return Response({
            'status': 'OK',
            'message': 'API funcionando correctamente',
            'version': '1.0.0',
            'database': {
                'connected': True,
                'generadores': total_generadores,
                'consumos': total_consumos
            },
            'user': str(request.user) if request.user.is_authenticated else 'Anonymous',
        })
    except Exception as e:
        logger.error(f"Error en api_status: {e}")
        return Response({
            'status': 'ERROR',
            'message': f'Error de conexión: {str(e)}',
            'database': {'connected': False}
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GeneradorViewSet(viewsets.ModelViewSet):
    """API endpoint para ver y editar datos de generadores eléctricos."""
    queryset = GeneradorElectrico.objects.all().order_by('id')  # ✅ ORDENAMIENTO EXPLÍCITO
    serializer_class = GeneradorSerializer
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]

    def list(self, request, *args, **kwargs):
        """Override list para manejar errores y logging"""
        try:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            logger.info(f"Generadores enviados: {len(serializer.data)}")
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error en GeneradorViewSet.list: {e}")
            return Response({
                'error': 'Error al obtener generadores',
                'detail': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ConsumoViewSet(viewsets.ModelViewSet):
    """API endpoint para registrar y mostrar consumos."""
    queryset = DatosConsumo.objects.all().order_by('-fecha')  # ✅ ORDENAMIENTO EXPLÍCITO
    serializer_class = ConsumoSerializer
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        """Filtra los registros por parámetros de consulta"""
        try:
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
        except Exception as e:
            logger.error(f"Error en get_queryset: {e}")
            return DatosConsumo.objects.none()

    def list(self, request, *args, **kwargs):
        """Override list para manejar errores y logging"""
        try:
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            logger.info(f"Consumos enviados: {len(serializer.data)}")
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error en ConsumoViewSet.list: {e}")
            return Response({
                'error': 'Error al obtener consumos',
                'detail': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def perform_create(self, serializer):
        """Calcula o recibe el consumo desde el frontend."""
        try:
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
            logger.info(f"Consumo creado para generador {generador_id}")
        except Exception as e:
            logger.error(f"Error en perform_create: {e}")
            raise ValidationError(f"Error al crear consumo: {str(e)}")