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
    # ✅ CORRECTO: PrimaryKeyRelatedField maneja la validación
    generador = serializers.PrimaryKeyRelatedField(queryset=GeneradorElectrico.objects.all())

    class Meta:
        model = DatosConsumo
        fields = '__all__'

    # ❌ ELIMINA este método: validate_generador
    # Django REST Framework ya valida que el ID exista en el queryset
    # Si lo sobrescribes mal, rompes el flujo

    def validate_nivel_actual(self, value):
        if value < 0:
            raise serializers.ValidationError("El nivel actual no puede ser negativo.")
        return value

    def validate_consumo(self, value):
        if value < 0:
            raise serializers.ValidationError("El consumo no puede ser negativo.")
        return value

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if hasattr(instance, 'generador') and instance.generador:
            data['generador'] = instance.generador.id
        return data