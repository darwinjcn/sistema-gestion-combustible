# =============================================================================
# Script PowerShell para iniciar el proyecto completo
# Sistema de Gestión de Combustible CANTV Lara
# =============================================================================

Write-Host ""
Write-Host "⛽ Sistema de Gestión de Combustible CANTV Lara" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Blue
Write-Host ""

# Verificar si estamos en la raíz del proyecto
if (-not (Test-Path "manage.py")) {
    Write-Host "❌ Error: No se encontró manage.py" -ForegroundColor Red
    Write-Host "Asegúrate de estar en la carpeta raíz del proyecto" -ForegroundColor Yellow
    Read-Host "Presiona Enter para salir"
    exit 1
}

Write-Host "🔍 Verificando configuración..." -ForegroundColor Cyan

# Verificar Python
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ Python encontrado: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python no está instalado o no está en PATH" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}

# Verificar Node.js
try {
    $nodeVersion = node --version 2>&1
    Write-Host "✅ Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js no está instalado o no está en PATH" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}

Write-Host ""
Write-Host "🚀 Iniciando servidores..." -ForegroundColor Green
Write-Host ""

# Iniciar Django en una nueva ventana de PowerShell
Write-Host "🐍 Iniciando Django Backend..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host '🐍 Django Backend - Puerto 8000' -ForegroundColor Green; python manage.py runserver"

# Esperar un poco
Start-Sleep -Seconds 3

# Iniciar React en una nueva ventana de PowerShell
Write-Host "🟨 Iniciando React Frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host '🟨 React Frontend - Puerto 3000' -ForegroundColor Yellow; cd frontend; `$env:PORT='3000'; npm start"

Write-Host "✅ Servidores iniciados en ventanas separadas" -ForegroundColor Green
Write-Host ""
Write-Host "🔗 URLs disponibles:" -ForegroundColor Cyan
Write-Host "  • React Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "  • Django Backend: http://localhost:8000" -ForegroundColor White
Write-Host "  • Django Admin:   http://localhost:8000/admin/" -ForegroundColor White
Write-Host ""
Write-Host "Presiona cualquier tecla para cerrar esta ventana..." -ForegroundColor Gray
Read-Host