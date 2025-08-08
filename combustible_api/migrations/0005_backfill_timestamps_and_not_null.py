from django.db import migrations, models
import django.utils.timezone

def backfill_timestamps(apps, schema_editor):
  Generador = apps.get_model('combustible_api', 'GeneradorElectrico')
  now = django.utils.timezone.now()
  Generador.objects.filter(fecha_creacion__isnull=True).update(fecha_creacion=now)
  Generador.objects.filter(fecha_actualizacion__isnull=True).update(fecha_actualizacion=now)

class Migration(migrations.Migration):

  dependencies = [
      ('combustible_api', '0004_merge_20250808_0741'),
  ]

  operations = [
      migrations.RunPython(backfill_timestamps, migrations.RunPython.noop),
      migrations.AlterField(
          model_name='generadorelectrico',
          name='fecha_creacion',
          field=models.DateTimeField(auto_now_add=True, null=False),
      ),
      migrations.AlterField(
          model_name='generadorelectrico',
          name='fecha_actualizacion',
          field=models.DateTimeField(auto_now=True, null=False),
      ),
  ]