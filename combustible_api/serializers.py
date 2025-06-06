from rest_framework import serializers
from .models import GeneradorElectrico, DatosConsumo

class GeneradorSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeneradorElectrico
        fields = '__all__'

class ConsumoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DatosConsumo
        fields = '__all__'