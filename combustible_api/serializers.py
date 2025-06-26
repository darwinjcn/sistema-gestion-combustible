# combustible_api/serializers.py

from rest_framework import serializers
from .models import GeneradorElectrico, DatosConsumo


class GeneradorSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeneradorElectrico
        fields = '__all__'


class ConsumoSerializer(serializers.ModelSerializer):
    generador = serializers.PrimaryKeyRelatedField(queryset=GeneradorElectrico.objects.all())

    class Meta:
        model = DatosConsumo
        fields = '__all__'

    def validate_generador(self, value):
        if isinstance(value, GeneradorElectrico):
            return value.id
        elif isinstance(value, int) and GeneradorElectrico.objects.filter(id=value).exists():
            return value
        else:
            raise serializers.ValidationError("El generador especificado no existe.")

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['generador'] = instance.generador.id
        return data