# models.py
from django.db import models

class GeneradorElectrico(models.Model):
    modelo = models.CharField(max_length=100)
    capacidad_tanque = models.FloatField()
    estado = models.CharField(max_length=50)
    nivel_actual = models.FloatField(null=True, blank=True)

    def __str__(self):
        return self.modelo


class DatosConsumo(models.Model):
    fecha = models.DateTimeField(auto_now_add=True)
    consumo = models.FloatField()
    nivel_actual = models.FloatField()
    generador = models.ForeignKey(GeneradorElectrico, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.generador} - {self.nivel_actual} L"