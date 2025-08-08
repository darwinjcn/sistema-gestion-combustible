@echo off
echo 🐍 Aplicando migraciones de Django...
echo =====================================

REM Detén el server si está corriendo
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000 ^| findstr LISTENING') do taskkill /PID %%a /F >nul 2>&1

REM Migraciones aplicaciones
python manage.py makemigrations combustible_api
python manage.py migrate
python manage.py migrate authtoken

echo ✅ Migraciones aplicadas. Inicia otra vez:
echo    python manage.py runserver
pause