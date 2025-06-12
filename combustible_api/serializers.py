# combustible_api/serializers.py

from rest_framework import serializers
from .models import GeneradorElectrico, DatosConsumo


class GeneradorSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeneradorElectrico
        fields = '__all__'

    def validate_modelo(self, value):
        if not value.strip():
            raise serializers.ValidationError("El modelo no puede estar vacío.")
        return value


class ConsumoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DatosConsumo
        fields = '__all__'

    def validate_generador(self, value):
        # Asegúrate de recibir solo el ID del generador
        if not GeneradorElectrico.objects.filter(id=value).exists():
            raise serializers.ValidationError("El generador con este ID no existe.")
        return value

    def validate_nivel_actual(self, value):
        if value < 0:
            raise serializers.ValidationError("El nivel actual no puede ser negativo.")
        return value

    def validate_consumo(self, value):
        if value < 0:
            raise serializers.ValidationError("El consumo no puede ser negativo.")
        return value