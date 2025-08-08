from django.db import models
from django.utils import timezone

class GeneradorElectrico(models.Model):
  ESTADO_CHOICES = [
      ('activo', 'Activo'),
      ('inactivo', 'Inactivo'),
      ('mantenimiento', 'Mantenimiento'),
  ]
  
  modelo = models.CharField(max_length=100, verbose_name="Modelo del Generador")
  capacidad_tanque = models.FloatField(verbose_name="Capacidad del Tanque (L)")
  nivel_actual = models.FloatField(default=0, verbose_name="Nivel Actual (L)")
  estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='activo')
  fecha_creacion = models.DateTimeField(auto_now_add=True)
  fecha_actualizacion = models.DateTimeField(auto_now=True)

  class Meta:
      ordering = ['id']
      verbose_name = "Generador Eléctrico"
      verbose_name_plural = "Generadores Eléctricos"

  def __str__(self):
      return f"{self.modelo} (ID: {self.id})"

  def get_porcentaje_nivel(self):
      if self.capacidad_tanque > 0:
          return (self.nivel_actual / self.capacidad_tanque) * 100
      return 0

  def is_nivel_bajo(self, umbral=150):
      return self.nivel_actual < umbral


class DatosConsumo(models.Model):
  generador = models.ForeignKey(GeneradorElectrico, on_delete=models.CASCADE, related_name='consumos')
  fecha = models.DateTimeField(default=timezone.now)
  consumo = models.FloatField(verbose_name="Consumo (L)")
  nivel_actual = models.FloatField(verbose_name="Nivel Actual (L)")

  class Meta:
      ordering = ['-fecha']
      verbose_name = "Datos de Consumo"
      verbose_name_plural = "Datos de Consumos"

  def __str__(self):
      return f"Consumo {self.generador.modelo} - {self.fecha.strftime('%Y-%m-%d %H:%M')}"

  def get_fecha_formateada(self):
      return self.fecha.strftime('%d/%m/%Y %H:%M')