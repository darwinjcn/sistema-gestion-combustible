# Generated manually to add missing timestamp fields and ensure ordering exists.
from django.db import migrations, models
import django.utils.timezone

def set_defaults_for_existing(apps, schema_editor):
    Generador = apps.get_model('combustible_api', 'GeneradorElectrico')
    now = django.utils.timezone.now()
    for g in Generador.objects.all():
        if getattr(g, 'fecha_creacion', None) is None:
            g.fecha_creacion = now
        if getattr(g, 'fecha_actualizacion', None) is None:
            g.fecha_actualizacion = now
        g.save(update_fields=['fecha_creacion', 'fecha_actualizacion'])

class Migration(migrations.Migration):

    dependencies = [
        ('combustible_api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='generadorelectrico',
            name='fecha_creacion',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
        migrations.AddField(
            model_name='generadorelectrico',
            name='fecha_actualizacion',
            field=models.DateTimeField(auto_now=True, null=True),
        ),
        migrations.RunPython(set_defaults_for_existing, migrations.RunPython.noop),
        # Nota: el ordering se maneja en Meta del modelo; no se requiere operación de migración específica.
    ]