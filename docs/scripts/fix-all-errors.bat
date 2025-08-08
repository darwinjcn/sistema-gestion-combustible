@echo off
echo 🔧 Solucionando todos los errores del sistema...
echo ===============================================

echo 📋 Paso 1: Aplicando migraciones de Django...
python manage.py migrate

echo 📋 Paso 2: Creando directorio static...
if not exist "static" mkdir static

echo 📋 Paso 3: Limpiando React...
cd frontend
if exist "node_modules\.cache" rmdir /s /q "node_modules\.cache"
if exist ".eslintcache" del ".eslintcache"
npm cache clean --force
cd ..

echo ✅ Errores corregidos. Reinicia ambos servidores.
pause