@echo off
echo 🚀 Iniciando React en puerto 3000...
echo =====================================

REM Verificar si node_modules existe
if not exist "node_modules" (
    echo ❌ node_modules no existe. Instalando dependencias...
    npm install
)

REM Configurar puerto y iniciar
set PORT=3000
set BROWSER=none
echo ✅ Puerto configurado: %PORT%
echo 🌐 URL: http://localhost:%PORT%
echo.

npm start