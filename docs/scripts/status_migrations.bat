@echo off
echo 📋 Estado de migraciones de combustible_api
python manage.py showmigrations combustible_api
echo.
echo 🐍 Detectar cambios pendientes en modelos
python manage.py makemigrations --dry-run --check combustible_api
echo.
pause