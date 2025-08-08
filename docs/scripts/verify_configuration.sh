#!/bin/bash

# =============================================================================
# Script de Verificación de Configuración
# Sistema de Gestión de Combustible CANTV Lara
# =============================================================================

echo "🔍 Verificando configuración del proyecto..."
echo "============================================="

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Función para verificar puertos
check_port() {
    local port=$1
    local service=$2
    
    if lsof -i :$port >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Puerto $port ($service) está en uso${NC}"
        lsof -i :$port | head -2
    else
        echo -e "${RED}❌ Puerto $port ($service) está libre${NC}"
    fi
    echo ""
}

# Verificar puertos
echo -e "${BLUE}📡 Verificando puertos...${NC}"
check_port 3000 "React Frontend"
check_port 8000 "Django Backend"
check_port 5432 "PostgreSQL"

# Verificar archivos de configuración
echo -e "${BLUE}📁 Verificando archivos de configuración...${NC}"

# Verificar .env del frontend
if [ -f "frontend/.env" ]; then
    echo -e "${GREEN}✅ frontend/.env existe${NC}"
    echo "Contenido:"
    cat frontend/.env | grep -E "^(PORT|REACT_APP_API_URL)" | head -5
else
    echo -e "${RED}❌ frontend/.env no existe${NC}"
fi
echo ""

# Verificar settings.py
if [ -f "proyecto/settings.py" ]; then
    echo -e "${GREEN}✅ proyecto/settings.py existe${NC}"
    echo "CORS configurado para:"
    grep -A 5 "CORS_ALLOWED_ORIGINS" proyecto/settings.py | head -6
else
    echo -e "${RED}❌ proyecto/settings.py no existe${NC}"
fi
echo ""

# Verificar base de datos PostgreSQL
echo -e "${BLUE}🗄️  Verificando conexión a PostgreSQL...${NC}"
if command -v psql >/dev/null 2>&1; then
    if PGPASSWORD=123456 psql -h localhost -U postgres -d db_combustible -c "SELECT version();" >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Conexión a PostgreSQL exitosa${NC}"
    else
        echo -e "${RED}❌ No se puede conectar a PostgreSQL${NC}"
        echo "Verifica que PostgreSQL esté ejecutándose y las credenciales sean correctas"
    fi
else
    echo -e "${YELLOW}⚠️  psql no está instalado, no se puede verificar PostgreSQL${NC}"
fi
echo ""

# Verificar dependencias Python
echo -e "${BLUE}🐍 Verificando dependencias Python...${NC}"
if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
    echo -e "${GREEN}✅ Entorno virtual activado${NC}"
    
    # Verificar Django
    if python -c "import django; print(f'Django {django.get_version()}')" 2>/dev/null; then
        echo -e "${GREEN}✅ Django instalado correctamente${NC}"
    else
        echo -e "${RED}❌ Django no está instalado${NC}"
    fi
    
    # Verificar DRF
    if python -c "import rest_framework; print('DRF instalado')" 2>/dev/null; then
        echo -e "${GREEN}✅ Django REST Framework instalado${NC}"
    else
        echo -e "${RED}❌ Django REST Framework no está instalado${NC}"
    fi
    
    # Verificar CORS
    if python -c "import corsheaders; print('CORS instalado')" 2>/dev/null; then
        echo -e "${GREEN}✅ django-cors-headers instalado${NC}"
    else
        echo -e "${RED}❌ django-cors-headers no está instalado${NC}"
    fi
else
    echo -e "${RED}❌ Entorno virtual no encontrado${NC}"
fi
echo ""

# Verificar dependencias Node.js
echo -e "${BLUE}🟨 Verificando dependencias Node.js...${NC}"
if [ -d "frontend/node_modules" ]; then
    echo -e "${GREEN}✅ node_modules existe en frontend${NC}"
    
    cd frontend/
    if npm list react >/dev/null 2>&1; then
        echo -e "${GREEN}✅ React instalado${NC}"
    else
        echo -e "${RED}❌ React no está instalado${NC}"
    fi
    
    if npm list @mui/material >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Material-UI instalado${NC}"
    else
        echo -e "${RED}❌ Material-UI no está instalado${NC}"
    fi
    cd ..
else
    echo -e "${RED}❌ node_modules no existe en frontend${NC}"
    echo "Ejecuta: cd frontend && npm install"
fi
echo ""

# Resumen final
echo -e "${BLUE}📋 Resumen de configuración:${NC}"
echo "================================="
echo -e "• React Frontend: ${GREEN}http://localhost:3000${NC}"
echo -e "• Django Backend: ${GREEN}http://localhost:8000${NC}"
echo -e "• Django Admin: ${GREEN}http://localhost:8000/admin/${NC}"
echo -e "• API REST: ${GREEN}http://localhost:8000/api/${NC}"
echo -e "• Base de datos: ${GREEN}PostgreSQL (localhost:5432)${NC}"
echo ""

echo -e "${YELLOW}💡 Para iniciar el proyecto:${NC}"
echo "1. Backend: source venv/bin/activate && python manage.py runserver"
echo "2. Frontend: cd frontend && npm start"
echo ""

echo -e "${GREEN}🎉 Verificación completada!${NC}"