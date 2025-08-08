@echo off
echo 🔧 Solucionando error onClick de React...
echo ========================================

cd frontend

echo 📋 Paso 1: Deteniendo servidor React...
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul

echo 🧹 Paso 2: Limpiando completamente...
if exist "node_modules\.cache" rmdir /s /q "node_modules\.cache"
if exist ".eslintcache" del ".eslintcache"
if exist "build" rmdir /s /q "build"

echo 📦 Paso 3: Reinstalando dependencias...
npm cache clean --force
npm install

echo ✅ Limpieza completada. Ahora inicia con: npm start
pause