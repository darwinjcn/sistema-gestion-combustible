# =============================================================================
# Script PowerShell para solucionar error onClick
# Sistema de Gestión de Combustible CANTV Lara
# =============================================================================

Write-Host "🔧 Solucionando error onClick de React..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Blue

# Cambiar a directorio frontend
Set-Location frontend

Write-Host "📋 Paso 1: Deteniendo procesos Node.js..." -ForegroundColor Cyan
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

Write-Host "🧹 Paso 2: Limpiando cache y archivos temporales..." -ForegroundColor Yellow
if (Test-Path "node_modules\.cache") { Remove-Item "node_modules\.cache" -Recurse -Force }
if (Test-Path ".eslintcache") { Remove-Item ".eslintcache" -Force }
if (Test-Path "build") { Remove-Item "build" -Recurse -Force }

Write-Host "📦 Paso 3: Limpiando cache de npm..." -ForegroundColor Cyan
npm cache clean --force

Write-Host "🔄 Paso 4: Reinstalando dependencias..." -ForegroundColor Green
npm install

Write-Host ""
Write-Host "✅ Limpieza completada!" -ForegroundColor Green
Write-Host "🚀 Ahora ejecuta: npm start" -ForegroundColor Cyan
Write-Host ""

# Volver al directorio raíz
Set-Location ..

Read-Host "Presiona Enter para continuar"