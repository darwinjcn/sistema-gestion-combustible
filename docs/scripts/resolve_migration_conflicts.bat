@echo off
echo 🔧 Resolviendo conflictos de migraciones (combustible_api)...
echo ============================================================

REM 1) Mostrar el estado actual
echo.
echo 📋 Estado actual de migraciones:
python manage.py showmigrations combustible_api

REM 2) Crear migracion de merge
echo.
echo 🔀 Creando migracion de MERGE...
echo (Responde 'y' si te pregunta)
python manage.py makemigrations combustible_api --merge

REM 3) Mostrar nuevamente para ver la nueva merge creada
echo.
echo 📋 Estado luego del MERGE:
python manage.py showmigrations combustible_api

REM 4) Aplicar migraciones
echo.
echo 🐍 Aplicando migraciones...
python manage.py migrate

REM 5) Si authtoken sigue pendiente, migrarla también
echo.
echo 🔑 Aplicando migraciones de authtoken (si quedan pendientes)...
python manage.py migrate authtoken

echo.
echo ✅ Listo. Si ves todas las migraciones con [X], ya quedó resuelto.
pause