@echo off
echo 🔍 Depurando errores de React...
echo ================================

echo.
echo 📋 Verificando archivos de componentes...

REM Verificar que los archivos existen
if exist "frontend\src\components\ListadoGeneradores.js" (
    echo ✅ ListadoGeneradores.js existe
) else (
    echo ❌ ListadoGeneradores.js NO existe
)

if exist "frontend\src\App.js" (
    echo ✅ App.js existe
) else (
    echo ❌ App.js NO existe
)

echo.
echo 🧹 Limpiando cache de React...
cd frontend
if exist "node_modules\.cache" (
    rmdir /s /q "node_modules\.cache"
    echo ✅ Cache eliminado
)

echo.
echo 🔄 Reiniciando servidor React...
echo Presiona Ctrl+C para detener el servidor anterior si está ejecutándose
echo Luego ejecuta: npm start

pause