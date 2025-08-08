@echo off
echo 🔎 Buscando usos de onClick problematicos en frontend/src...
echo ============================================================

cd frontend

REM Muestra todas las líneas con onClick=
findstr /s /n /i "onClick=" src\*.js src\*.jsx src\*.ts src\*.tsx

echo.
echo ⚠️ Revisa que cada onClick reciba una función:
echo   Bien:   onClick={() => hacerAlgo()}
echo   Bien:   onClick={handleClick}
echo   MAL:    onClick={true}, onClick={"texto"}, onClick={valor && handleClick()} (si valor no es funcion)
echo.
pause