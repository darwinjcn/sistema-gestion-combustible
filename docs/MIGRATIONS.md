# Resolver conflictos de migraciones en Django (combustible_api)

Has visto este error:
\`\`\`
CommandError: Conflicting migrations detected; multiple leaf nodes in the migration graph:
(0002_add_timestamps_and_ordering, 0003_auto_20250612_1229 in combustible_api).
To fix them run 'python manage.py makemigrations --merge'
\`\`\`

Significa que tienes dos “ramas finales” de migraciones en la app `combustible_api`. Para resolverlo:

## Paso 1: Ver el estado
\`\`\`bash
python manage.py showmigrations combustible_api
\`\`\`
- Verás las migraciones listadas. Las marcadas con `[X]` están aplicadas, con `[ ]` pendientes.
- Notarás dos últimas migraciones diferentes (p. ej. `0002_...` y `0003_auto_...`) sin relación entre sí.

## Paso 2: Crear la migración de MERGE
\`\`\`bash
python manage.py makemigrations combustible_api --merge
\`\`\`
- Acepta con `y` si te pregunta.
- Django creará una migración del tipo `0004_merge_YYYYMMDD_HHMM.py` (el número y timestamp pueden variar) que depende de las dos ramas.

## Paso 3: Revisar el merge
Abre el archivo creado en `combustible_api/migrations/0004_merge_*.py`. En la mayoría de casos no tendrá `operations` (es solo para reconciliar el grafo). Déjalo así.

Si tu caso tiene conflictos reales (por ejemplo, ambas ramas intentan crear el mismo campo), verás operaciones redundantes. En ese caso:
- Mantén una sola operación de `AddField` por campo (elimina el duplicado).
- Si el campo ya existe en base de datos, convierte la operación redundante en un `RunPython` no-op o elimínala y luego usa `--fake` si fuese necesario.

## Paso 4: Aplicar migraciones
\`\`\`bash
python manage.py migrate
python manage.py migrate authtoken  # si authtoken sigue pendiente
\`\`\`

## Paso 5 (opcional): Si ya existen columnas y falla por duplicado
Si la base de datos ya tiene las columnas (p. ej. `fecha_creacion`, `fecha_actualizacion`) y la migración quiere recrearlas:
- Opción A (recomendada): Editar la migración para quitar el `AddField` duplicado.
- Opción B (avanzada): Marcar como aplicada con `--fake`:
  \`\`\`bash
  python manage.py migrate combustible_api 0003 --fake
  python manage.py migrate
  \`\`\`

## Verificación
- Ir a http://127.0.0.1:8000/api/generadores/ y confirmar que responde 200 con un array.
- Ir a http://127.0.0.1:8000/api/status/ y confirmar `status: OK`.

Si todo está OK, ya no verás el 500 en el frontend y desaparecerán los errores “map is not a function”.
\`\`\`

```python file="combustible_api/migrations/0004_merge_template.py"
# Plantilla de migración de MERGE (ejemplo)
# Nota: Django generará un nombre/timestamp distinto automáticamente.
from django.db import migrations

class Migration(migrations.Migration):

    dependencies = [
        ('combustible_api', '0002_add_timestamps_and_ordering'),
        ('combustible_api', '0003_auto_20250612_1229'),
    ]

    operations = [
        # Generalmente vacío: solo reconcilia las ramas.
    ]