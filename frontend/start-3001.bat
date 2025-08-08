@echo off
echo 🚀 Iniciando React en puerto 3001 (compatibilidad)...
echo ====================================================

REM Verificar si node_modules existe
if not exist "node_modules" (
    echo ❌ node_modules no existe. Instalando dependencias...
    npm install
)

REM Configurar puerto y iniciar
set PORT=3001
set BROWSER=none
echo ✅ Puerto configurado: %PORT%
echo 🌐 URL: http://localhost:%PORT%
echo.

npm start