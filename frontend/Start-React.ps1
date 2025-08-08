# =============================================================================
# Script PowerShell para iniciar React
# Sistema de Gestión de Combustible CANTV Lara
# =============================================================================

Write-Host "🚀 Iniciando React en puerto 3000..." -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Blue

# Verificar si estamos en la carpeta correcta
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: No se encontró package.json" -ForegroundColor Red
    Write-Host "Asegúrate de estar en la carpeta frontend/" -ForegroundColor Yellow
    exit 1
}

# Verificar si node_modules existe
if (-not (Test-Path "node_modules")) {
    Write-Host "⚠️  node_modules no existe. Instalando dependencias..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error instalando dependencias" -ForegroundColor Red
        exit 1
    }
}

# Configurar variables de entorno
$env:PORT = "3000"
$env:BROWSER = "none"

Write-Host "✅ Puerto configurado: $($env:PORT)" -ForegroundColor Green
Write-Host "🌐 URL: http://localhost:$($env:PORT)" -ForegroundColor Cyan
Write-Host ""
Write-Host "Presiona Ctrl+C para detener el servidor" -ForegroundColor Yellow
Write-Host ""

# Iniciar React
npm start