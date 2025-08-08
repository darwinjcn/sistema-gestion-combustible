@echo off
title Sistema de Gestión de Combustible CANTV Lara

echo.
echo ⛽ Sistema de Gestión de Combustible CANTV Lara
echo ===============================================
echo.

REM Verificar si estamos en la raíz del proyecto
if not exist "manage.py" (
    echo ❌ Error: No se encontró manage.py
    echo Asegúrate de estar en la carpeta raíz del proyecto
    pause
    exit /b 1
)

echo 🔍 Verificando configuración...

REM Verificar Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python no está instalado o no está en PATH
    pause
    exit /b 1
) else (
    echo ✅ Python encontrado
)

REM Verificar Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js no está instalado o no está en PATH
    pause
    exit /b 1
) else (
    echo ✅ Node.js encontrado
)

echo.
echo 🚀 Iniciando servidores...
echo.

REM Crear ventana para Django
start "Django Backend - Puerto 8000" cmd /k "echo 🐍 Iniciando Django Backend... && python manage.py runserver"

REM Esperar un poco
timeout /t 3 /nobreak >nul

REM Crear ventana para React
start "React Frontend - Puerto 3000" cmd /k "cd frontend && echo 🟨 Iniciando React Frontend... && set PORT=3000 && npm start"

echo ✅ Servidores iniciados en ventanas separadas
echo.
echo 🔗 URLs disponibles:
echo   • React Frontend: http://localhost:3000
echo   • Django Backend: http://localhost:8000
echo   • Django Admin:   http://localhost:8000/admin/
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
pause >nul