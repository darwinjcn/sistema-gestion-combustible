# 📚 Documentación - Sistema de Gestión de Combustible CANTV Lara

**Proyecto Universitario UNETI**  
*Desarrollado por: Darwin Colmenares, Yannis Iturriago, GianneFran Radomile*

---

## 📋 Índice de Contenidos

### 🏗️ [Diagramas UML](#diagramas-uml)
- [Diagrama de Clases](#diagrama-de-clases) (PlantUML)
- [Diagrama de Arquitectura](#diagrama-de-arquitectura) (Mermaid)
- [Diagrama de Secuencia](#diagrama-de-secuencia) (Mermaid)
- [Diagrama de Despliegue](#diagrama-de-despliegue) (Mermaid)

### 🛠️ [Herramientas y Scripts](#herramientas-y-scripts)
- [Generación Automática](#generación-automática)
- [Dependencias](#dependencias)
- [Instalación](#instalación)

### 🚀 [Guías de Uso](#guías-de-uso)
- [Visualización Online](#visualización-online)
- [Herramientas Locales](#herramientas-locales)
- [Exportación](#exportación)

---

## 🏗️ Diagramas UML

### 📊 Diagrama de Clases
**Archivo:** [`diagramas/clases.puml`](diagramas/clases.puml)  
**Formato:** PlantUML  
**Descripción:** Muestra la estructura de clases del sistema, incluyendo modelos Django, ViewSets, y Serializers.

**Componentes principales:**
- `GeneradorElectrico` - Modelo principal
- `DatosConsumo` - Registros de consumo
- `GeneradorViewSet` / `ConsumoViewSet` - Controladores API
- `GeneradorSerializer` / `ConsumoSerializer` - Serializadores

**Visualizar:**
\`\`\`bash
# Online: https://www.plantuml.com/plantuml/uml/
# Local: plantuml diagramas/clases.puml
\`\`\`

### 🏛️ Diagrama de Arquitectura
**Archivo:** [`diagramas/arquitectura.md`](diagramas/arquitectura.md)  
**Formato:** Mermaid  
**Descripción:** Arquitectura cliente-servidor del sistema completo.

**Capas:**
- **Frontend:** React + Material-UI (Puerto 3001)
- **Backend:** Django REST API (Puerto 8000)
- **Base de Datos:** SQLite/PostgreSQL
- **Servicios:** Exportación, Gráficos, Autenticación

### 🔄 Diagrama de Secuencia
**Archivo:** [`diagramas/secuencia.md`](diagramas/secuencia.md)  
**Formato:** Mermaid  
**Descripción:** Flujo completo de guardado de datos de consumo.

**Flujo:**
1. Usuario completa formulario
2. Validación frontend
3. Autenticación API
4. Procesamiento backend
5. Guardado en base de datos
6. Respuesta y actualización UI

### 🌐 Diagrama de Despliegue
**Archivo:** [`diagramas/despliegue.md`](diagramas/despliegue.md)  
**Formato:** Mermaid  
**Descripción:** Arquitectura de deployment en desarrollo y producción.

**Entornos:**
- **Desarrollo:** Local con servidores de desarrollo
- **Producción:** Nginx + Gunicorn + PostgreSQL + Redis
- **Monitoreo:** Prometheus + Grafana
- **CI/CD:** GitHub Actions

---

## 🛠️ Herramientas y Scripts

### 🤖 Generación Automática

#### Script Principal
\`\`\`bash
# Ejecutar desde la carpeta docs/
./scripts/generar_diagramas.sh
\`\`\`

**Funcionalidades:**
- ✅ Instala dependencias automáticamente
- ✅ Genera imágenes PNG/SVG de todos los diagramas
- ✅ Crea carpeta de output organizada
- ✅ Valida códigos PlantUML y Mermaid
- ✅ Genera reporte de estado

#### Comandos Individuales
\`\`\`bash
# Solo PlantUML (Diagrama de Clases)
plantuml diagramas/clases.puml -o output/

# Solo Mermaid (Otros diagramas)
mmdc -i diagramas/arquitectura.md -o output/arquitectura.png
mmdc -i diagramas/secuencia.md -o output/secuencia.png
mmdc -i diagramas/despliegue.md -o output/despliegue.png
\`\`\`

### 📦 Dependencias

#### Herramientas Requeridas
- **Node.js** (v16+) - Para Mermaid CLI
- **Java** (v8+) - Para PlantUML
- **Python** (v3.8+) - Para scripts auxiliares

#### Instalación Automática
\`\`\`bash
# El script instala todo automáticamente
cd docs/
npm install
./scripts/generar_diagramas.sh --install
\`\`\`

---

## 🚀 Guías de Uso

### 🌐 Visualización Online

#### PlantUML Online
1. Ve a: https://www.plantuml.com/plantuml/uml/
2. Copia el contenido de `diagramas/clases.puml`
3. Pega en el editor
4. Haz clic en "Submit"
5. Descarga como PNG/SVG

#### Mermaid Live Editor
1. Ve a: https://mermaid.live/
2. Copia el código mermaid de cualquier archivo `.md`
3. El diagrama se renderiza automáticamente
4. Exporta como PNG/SVG/PDF

### 💻 Herramientas Locales

#### VS Code (Recomendado)
\`\`\`bash
# Instalar extensiones
code --install-extension bierner.markdown-mermaid
code --install-extension plantuml.plantuml

# Abrir cualquier archivo .md o .puml
# Usar Ctrl+Shift+V para preview
\`\`\`

#### CLI Tools
\`\`\`bash
# Instalar herramientas globalmente
npm install -g @mermaid-js/mermaid-cli
sudo apt install plantuml  # Linux
brew install plantuml      # macOS
\`\`\`

### 📤 Exportación

#### Formatos Soportados
- **PNG** - Imágenes rasterizadas
- **SVG** - Gráficos vectoriales
- **PDF** - Documentos imprimibles
- **HTML** - Páginas web interactivas

#### Comandos de Exportación
\`\`\`bash
# PNG (por defecto)
mmdc -i diagramas/arquitectura.md -o output/arquitectura.png

# SVG (vectorial)
mmdc -i diagramas/arquitectura.md -o output/arquitectura.svg -f svg

# PDF (documento)
mmdc -i diagramas/arquitectura.md -o output/arquitectura.pdf -f pdf

# Múltiples formatos
./scripts/generar_diagramas.sh --all-formats
\`\`\`

---

## 📁 Estructura de Archivos

\`\`\`
docs/
├── README.md                    ← Este archivo
├── package.json                 ← Dependencias npm
├── diagramas/
│   ├── clases.puml             ← PlantUML (Clases)
│   ├── arquitectura.md         ← Mermaid (Arquitectura)
│   ├── secuencia.md            ← Mermaid (Secuencia)
│   ├── despliegue.md           ← Mermaid (Despliegue)
│   └── output/                 ← Imágenes generadas
│       ├── clases.png
│       ├── arquitectura.png
│       ├── secuencia.png
│       └── despliegue.png
└── scripts/
    └── generar_diagramas.sh    ← Script de automatización
\`\`\`

---

## 🔧 Configuración del Proyecto

### Variables de Entorno
\`\`\`bash
# .env (opcional)
PLANTUML_JAR_PATH=/usr/share/plantuml/plantuml.jar
MERMAID_CONFIG_PATH=./mermaid.config.json
OUTPUT_DIR=./diagramas/output
\`\`\`

### Configuración Mermaid
\`\`\`json
{
  "theme": "default",
  "themeVariables": {
    "primaryColor": "#3498db",
    "primaryTextColor": "#2c3e50",
    "primaryBorderColor": "#2980b9",
    "lineColor": "#34495e"
  },
  "flowchart": {
    "useMaxWidth": true,
    "htmlLabels": true
  }
}
\`\`\`

---

## 🐛 Solución de Problemas

### Errores Comunes

#### PlantUML no funciona
\`\`\`bash
# Verificar Java
java -version

# Instalar PlantUML
sudo apt install plantuml
# o
brew install plantuml
\`\`\`

#### Mermaid CLI no funciona
\`\`\`bash
# Reinstalar globalmente
npm uninstall -g @mermaid-js/mermaid-cli
npm install -g @mermaid-js/mermaid-cli

# Verificar instalación
mmdc --version
\`\`\`

#### Permisos de script
\`\`\`bash
# Dar permisos de ejecución
chmod +x scripts/generar_diagramas.sh
\`\`\`

### Logs y Debug
\`\`\`bash
# Ejecutar con debug
./scripts/generar_diagramas.sh --verbose

# Ver logs
tail -f /tmp/generar_diagramas.log
\`\`\`

---

## 📞 Soporte

### Contacto del Equipo
- **Darwin Colmenares** - Backend & API
- **Yannis Iturriago** - Frontend & UI/UX  
- **GianneFran Radomile** - Base de Datos & DevOps

### Recursos Adicionales
- **Documentación PlantUML:** https://plantuml.com/
- **Documentación Mermaid:** https://mermaid-js.github.io/mermaid/
- **Django REST Framework:** https://www.django-rest-framework.org/
- **React Documentation:** https://reactjs.org/docs/

---

## 📝 Changelog

### v1.0.0 (2024-01-XX)
- ✅ Diagrama de clases completo
- ✅ Diagrama de arquitectura
- ✅ Diagrama de secuencia
- ✅ Diagrama de despliegue
- ✅ Scripts de automatización
- ✅ Documentación completa

### Próximas Versiones
- 🔄 Diagrama de casos de uso
- 🔄 Diagrama de estados
- 🔄 Documentación de API
- 🔄 Guías de desarrollo

---

**© 2024 - Proyecto Universitario UNETI - Sistema de Gestión de Combustible CANTV Lara**