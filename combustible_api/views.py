# combustible_api/views.py

from rest_framework import viewsets
from .models import GeneradorElectrico, DatosConsumo
from .serializers import GeneradorSerializer, ConsumoSerializer
from django.http import HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
import pandas as pd
from io import BytesIO
from rest_framework.exceptions import ValidationError
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
import logging

logger = logging.getLogger(__name__)

def home(request):
    return HttpResponse("Bienvenido al Sistema Web de Gestión de Combustible - CANTV Lara")


class GeneradorViewSet(viewsets.ModelViewSet):
    queryset = GeneradorElectrico.objects.all()
    serializer_class = GeneradorSerializer
    
    # ⚠️ TEMPORAL: Removemos autenticación para testing
    # authentication_classes = [SessionAuthentication, TokenAuthentication]
    # permission_classes = [IsAuthenticated]
    permission_classes = [AllowAny]
    
    def list(self, request, *args, **kwargs):
        """Override para debug y logging mejorado"""
        try:
            logger.info("🔍 Solicitando lista de generadores...")
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            
            data = serializer.data
            logger.info(f"✅ Devolviendo {len(data)} generadores")
            logger.debug(f"Datos: {data}")
            
            return Response(data)
        except Exception as e:
            logger.error(f"❌ Error en GeneradorViewSet.list: {e}")
            return Response(
                {"error": "Error interno del servidor", "detail": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ConsumoViewSet(viewsets.ModelViewSet):
    queryset = DatosConsumo.objects.all()
    serializer_class = ConsumoSerializer
    
    # ⚠️ TEMPORAL: Removemos autenticación para testing
    # authentication_classes = [SessionAuthentication, TokenAuthentication]
    # permission_classes = [IsAuthenticated]
    permission_classes = [AllowAny]

    def get_queryset(self):
        try:
            queryset = DatosConsumo.objects.all()

            generador_id = self.request.query_params.get('generador')
            if generador_id:
                try:
                    generador_id = int(generador_id)
                    queryset = queryset.filter(generador_id=generador_id)
                except ValueError:
                    raise ValidationError("El ID del generador debe ser un número válido.")

            desde_fecha = self.request.query_params.get('desde')
            if desde_fecha:
                queryset = queryset.filter(fecha__gte=desde_fecha)

            hasta_fecha = self.request.query_params.get('hasta')
            if hasta_fecha:
                queryset = queryset.filter(fecha__lte=hasta_fecha)

            return queryset.order_by('-fecha')
        except Exception as e:
            logger.error(f"❌ Error en ConsumoViewSet.get_queryset: {e}")
            return DatosConsumo.objects.none()
    
    def list(self, request, *args, **kwargs):
        """Override para debug y logging mejorado"""
        try:
            logger.info("🔍 Solicitando lista de consumos...")
            queryset = self.get_queryset()
            serializer = self.get_serializer(queryset, many=True)
            
            data = serializer.data
            logger.info(f"✅ Devolviendo {len(data)} consumos")
            
            return Response(data)
        except Exception as e:
            logger.error(f"❌ Error en ConsumoViewSet.list: {e}")
            return Response(
                {"error": "Error interno del servidor", "detail": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def perform_create(self, serializer):
        try:
            generador_id = self.request.data.get('generador')
            try:
                generador = GeneradorElectrico.objects.get(id=int(generador_id))
            except (GeneradorElectrico.DoesNotExist, ValueError):
                raise ValidationError("El generador especificado no existe.")

            nivel_actual = float(self.request.data.get('nivel_actual', 0))
            consumo = float(self.request.data.get('consumo', 0))

            if consumo == 0:
                ultimo_registro = DatosConsumo.objects.filter(generador=generador).order_by('-fecha').first()
                nivel_anterior = ultimo_registro.nivel_actual if ultimo_registro else nivel_actual
                consumo_calculado = abs(nivel_anterior - nivel_actual)
            else:
                consumo_calculado = consumo

            serializer.save(
                generador=generador,
                nivel_actual=nivel_actual,
                consumo=consumo_calculado
            )
        except Exception as e:
            logger.error(f"❌ Error en perform_create: {e}")
            raise ValidationError(f"Error al crear registro: {str(e)}")


# --- VISTA: Carga Masiva de Datos ---
@api_view(['POST'])
@permission_classes([AllowAny])  # ⚠️ TEMPORAL para testing
def cargar_datos_masivos(request):
    """
    Permite subir un archivo CSV o Excel con datos de consumo.
    Formato esperado: generador_id, nivel_actual, consumo
    """
    archivo = request.FILES.get('archivo')
    if not archivo:
        return Response(
            {'error': 'No se ha proporcionado ningún archivo.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        # Leer archivo según extensión
        if archivo.name.endswith('.csv'):
            df = pd.read_csv(archivo)
        elif archivo.name.endswith('.xlsx') or archivo.name.endswith('.xls'):
            df = pd.read_excel(archivo)
        else:
            return Response(
                {'error': 'Formato de archivo no soportado. Use CSV o Excel.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validar columnas necesarias
        columnas_requeridas = ['generador_id', 'nivel_actual', 'consumo']
        if not all(col in df.columns for col in columnas_requeridas):
            return Response(
                {'error': f'El archivo debe contener las columnas: {columnas_requeridas}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        registros_creados = []
        errores = []

        for index, row in df.iterrows():
            try:
                generador = GeneradorElectrico.objects.get(id=row['generador_id'])
                consumo = DatosConsumo.objects.create(
                    generador=generador,
                    nivel_actual=row['nivel_actual'],
                    consumo=row['consumo']
                )
                registros_creados.append({
                    'id': consumo.id,
                    'fecha': consumo.fecha,
                    'generador': generador.id,
                    'nivel_actual': consumo.nivel_actual,
                    'consumo': consumo.consumo
                })
            except GeneradorElectrico.DoesNotExist:
                errores.append(f"Fila {index+2}: Generador con ID {row['generador_id']} no existe.")
            except Exception as e:
                errores.append(f"Fila {index+2}: Error al procesar fila: {str(e)}")

        return Response({
            'mensaje': f'Carga masiva completada. {len(registros_creados)} registros creados.',
            'registros': registros_creados,
            'errores': errores
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        logger.error(f"❌ Error en carga masiva: {e}")
        return Response(
            {'error': f'Error al procesar el archivo: {str(e)}'},
            status=status.HTTP_400_BAD_REQUEST
        )