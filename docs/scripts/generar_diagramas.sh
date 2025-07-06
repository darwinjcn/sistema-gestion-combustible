#!/bin/bash

# =============================================================================
# Script de Generación Automática de Diagramas UML
# Sistema de Gestión de Combustible CANTV Lara
# =============================================================================

set -e  # Salir si hay errores

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuración
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOCS_DIR="$(dirname "$SCRIPT_DIR")"
DIAGRAMAS_DIR="$DOCS_DIR/diagramas"
OUTPUT_DIR="$DIAGRAMAS_DIR/output"
LOG_FILE="/tmp/generar_diagramas.log"

# Archivos de diagramas
PLANTUML_FILE="$DIAGRAMAS_DIR/clases.puml"
MERMAID_FILES=(
    "$DIAGRAMAS_DIR/arquitectura.md"
    "$DIAGRAMAS_DIR/secuencia.md"
    "$DIAGRAMAS_DIR/despliegue.md"
)

# =============================================================================
# FUNCIONES AUXILIARES
# =============================================================================

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1" | tee -a "$LOG_FILE"
}

# Verificar si un comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Crear directorios necesarios
create_directories() {
    log "Creando directorios necesarios..."
    mkdir -p "$OUTPUT_DIR"
    mkdir -p "$OUTPUT_DIR/png"
    mkdir -p "$OUTPUT_DIR/svg"
    mkdir -p "$OUTPUT_DIR/pdf"
}

# =============================================================================
# INSTALACIÓN DE DEPENDENCIAS
# =============================================================================

install_dependencies() {
    log "Verificando e instalando dependencias..."
    
    # Verificar Node.js
    if ! command_exists node; then
        error "Node.js no está instalado. Por favor instala Node.js v16+ desde https://nodejs.org/"
        exit 1
    fi
    
    # Verificar npm
    if ! command_exists npm; then
        error "npm no está disponible. Instala Node.js completo."
        exit 1
    fi
    
    # Instalar dependencias npm
    if [ -f "$DOCS_DIR/package.json" ]; then
        log "Instalando dependencias npm..."
        cd "$DOCS_DIR"
        npm install
    else
        warning "package.json no encontrado. Instalando Mermaid CLI globalmente..."
        npm install -g @mermaid-js/mermaid-cli
    fi
    
    # Verificar Java para PlantUML
    if ! command_exists java; then
        warning "Java no está instalado. PlantUML no funcionará."
        info "Instala Java: sudo apt install default-jre (Linux) o brew install openjdk (macOS)"
    fi
    
    # Verificar PlantUML
    if ! command_exists plantuml; then
        warning "PlantUML no está instalado."
        info "Instala PlantUML: sudo apt install plantuml (Linux) o brew install plantuml (macOS)"
    fi
    
    # Verificar Mermaid CLI
    if ! command_exists mmdc; then
        warning "Mermaid CLI no está disponible globalmente."
        info "Instalando Mermaid CLI..."
        npm install -g @mermaid-js/mermaid-cli
    fi
}

# =============================================================================
# GENERACIÓN DE DIAGRAMAS
# =============================================================================

generate_plantuml() {
    log "Generando diagrama PlantUML (Clases)..."
    
    if [ ! -f "$PLANTUML_FILE" ]; then
        error "Archivo PlantUML no encontrado: $PLANTUML_FILE"
        return 1
    fi
    
    if command_exists plantuml; then
        # Generar PNG
        plantuml "$PLANTUML_FILE" -o "$OUTPUT_DIR/png/" -tpng
        
        # Generar SVG
        plantuml "$PLANTUML_FILE" -o "$OUTPUT_DIR/svg/" -tsvg
        
        log "✅ Diagrama de clases generado exitosamente"
    else
        warning "PlantUML no disponible. Saltando generación de diagrama de clases."
        info "Puedes generar online en: https://www.plantuml.com/plantuml/uml/"
    fi
}

generate_mermaid() {
    log "Generando diagramas Mermaid..."
    
    if ! command_exists mmdc; then
        warning "Mermaid CLI no disponible. Saltando generación de diagramas Mermaid."
        info "Puedes generar online en: https://mermaid.live/"
        return 1
    fi
    
    for file in "${MERMAID_FILES[@]}"; do
        if [ ! -f "$file" ]; then
            warning "Archivo no encontrado: $file"
            continue
        fi
        
        filename=$(basename "$file" .md)
        log "Procesando: $filename"
        
        # Generar PNG
        if mmdc -i "$file" -o "$OUTPUT_DIR/png/${filename}.png" -t default -b white; then
            log "✅ PNG generado: ${filename}.png"
        else
            error "❌ Error generando PNG: $filename"
        fi
        
        # Generar SVG
        if mmdc -i "$file" -o "$OUTPUT_DIR/svg/${filename}.svg" -t default -b white -f svg; then
            log "✅ SVG generado: ${filename}.svg"
        else
            error "❌ Error generando SVG: $filename"
        fi
        
        # Generar PDF (opcional)
        if mmdc -i "$file" -o "$OUTPUT_DIR/pdf/${filename}.pdf" -t default -b white -f pdf; then
            log "✅ PDF generado: ${filename}.pdf"
        else
            warning "⚠️  PDF no generado: $filename (puede requerir dependencias adicionales)"
        fi
    done
}

# =============================================================================
# VALIDACIÓN Y REPORTE
# =============================================================================

validate_files() {
    log "Validando archivos de entrada..."
    
    local errors=0
    
    # Validar PlantUML
    if [ ! -f "$PLANTUML_FILE" ]; then
        error "Archivo PlantUML faltante: $PLANTUML_FILE"
        ((errors++))
    fi
    
    # Validar Mermaid
    for file in "${MERMAID_FILES[@]}"; do
        if [ ! -f "$file" ]; then
            error "Archivo Mermaid faltante: $file"
            ((errors++))
        fi
    done
    
    if [ $errors -gt 0 ]; then
        error "Se encontraron $errors errores en los archivos de entrada."
        return 1
    fi
    
    log "✅ Todos los archivos de entrada están presentes"
    return 0
}

generate_report() {
    log "Generando reporte de archivos generados..."
    
    local report_file="$OUTPUT_DIR/reporte_generacion.md"
    
    cat > "$report_file" << EOF
# Reporte de Generación de Diagramas

**Fecha:** $(date)
**Script:** generar_diagramas.sh

## Archivos Generados

### PNG (Imágenes Rasterizadas)
EOF
    
    for file in "$OUTPUT_DIR/png"/*.png; do
        if [ -f "$file" ]; then
            filename=$(basename "$file")
            size=$(du -h "$file" | cut -f1)
            echo "- ✅ $filename ($size)" >> "$report_file"
        fi
    done
    
    cat >> "$report_file" << EOF

### SVG (Gráficos Vectoriales)
EOF
    
    for file in "$OUTPUT_DIR/svg"/*.svg; do
        if [ -f "$file" ]; then
            filename=$(basename "$file")
            size=$(du -h "$file" | cut -f1)
            echo "- ✅ $filename ($size)" >> "$report_file"
        fi
    done
    
    cat >> "$report_file" << EOF

### PDF (Documentos)
EOF
    
    for file in "$OUTPUT_DIR/pdf"/*.pdf; do
        if [ -f "$file" ]; then
            filename=$(basename "$file")
            size=$(du -h "$file" | cut -f1)
            echo "- ✅ $filename ($size)" >> "$report_file"
        fi
    done
    
    cat >> "$report_file" << EOF

## Comandos para Visualizar

\`\`\`bash
# Abrir carpeta de output
open $OUTPUT_DIR  # macOS
xdg-open $OUTPUT_DIR  # Linux
explorer $OUTPUT_DIR  # Windows

# Ver imágenes PNG
ls -la $OUTPUT_DIR/png/

# Ver archivos SVG
ls -la $OUTPUT_DIR/svg/
\`\`\`

## Enlaces Útiles

- **PlantUML Online:** https://www.plantuml.com/plantuml/uml/
- **Mermaid Live:** https://mermaid.live/
- **Documentación:** ../README.md
EOF
    
    log "📊 Reporte generado: $report_file"
}

# =============================================================================
# FUNCIÓN PRINCIPAL
# =============================================================================

main() {
    log "🚀 Iniciando generación de diagramas UML..."
    log "📁 Directorio de trabajo: $DOCS_DIR"
    
    # Limpiar log anterior
    > "$LOG_FILE"
    
    # Crear directorios
    create_directories
    
    # Procesar argumentos
    case "${1:-}" in
        --install)
            install_dependencies
            exit 0
            ;;
        --validate)
            validate_files
            exit $?
            ;;
        --help|-h)
            show_help
            exit 0
            ;;
    esac
    
    # Validar archivos de entrada
    if ! validate_files; then
        error "❌ Validación fallida. Abortando."
        exit 1
    fi
    
    # Instalar dependencias
    install_dependencies
    
    # Generar diagramas
    generate_plantuml
    generate_mermaid
    
    # Generar reporte
    generate_report
    
    log "🎉 ¡Generación completada exitosamente!"
    log "📁 Archivos generados en: $OUTPUT_DIR"
    log "📋 Ver reporte completo: $OUTPUT_DIR/reporte_generacion.md"
    log "📝 Log completo: $LOG_FILE"
}

show_help() {
    cat << EOF
🔧 Script de Generación de Diagramas UML
Sistema de Gestión de Combustible CANTV Lara

USO:
    ./generar_diagramas.sh [OPCIÓN]

OPCIONES:
    --install     Instalar solo las dependencias
    --validate    Validar solo los archivos de entrada
    --help, -h    Mostrar esta ayuda

EJEMPLOS:
    ./generar_diagramas.sh              # Generar todos los diagramas
    ./generar_diagramas.sh --install    # Solo instalar dependencias
    ./generar_diagramas.sh --validate   # Solo validar archivos

ARCHIVOS PROCESADOS:
    - diagramas/clases.puml (PlantUML)
    - diagramas/arquitectura.md (Mermaid)
    - diagramas/secuencia.md (Mermaid)
    - diagramas/despliegue.md (Mermaid)

SALIDA:
    - output/png/ (Imágenes PNG)
    - output/svg/ (Gráficos vectoriales)
    - output/pdf/ (Documentos PDF)
    - output/reporte_generacion.md (Reporte)

DEPENDENCIAS:
    - Node.js v16+ (requerido)
    - Java 8+ (para PlantUML)
    - @mermaid-js/mermaid-cli (npm)
    - plantuml (sistema)
EOF
}

# Ejecutar función principal
main "$@"