# Diagrama de Arquitectura - Sistema de Gestión de Combustible

```mermaid
graph TB
    subgraph "Cliente (Navegador)"
        UI[React App<br/>Puerto 3001]
        COMP[Componentes React<br/>Material-UI]
    end
    
    subgraph "Servidor Backend"
        API[Django REST API<br/>Puerto 8000]
        AUTH[Sistema de Autenticación<br/>Token + Session]
        VIEWS[ViewSets<br/>GeneradorViewSet<br/>ConsumoViewSet]
    end
    
    subgraph "Capa de Datos"
        MODELS[Modelos Django<br/>GeneradorElectrico<br/>DatosConsumo]
        DB[(Base de Datos<br/>SQLite)]
    end
    
    subgraph "Servicios Externos"
        EXPORT[Servicios de Exportación<br/>Excel, PDF, JSON]
        CHARTS[Librerías de Gráficos<br/>Chart.js]
    end
    
    UI --> API
    COMP --> API
    API --> AUTH
    API --> VIEWS
    VIEWS --> MODELS
    MODELS --> DB
    UI --> CHARTS
    API --> EXPORT
    
    classDef frontend fill:#e1f5fe
    classDef backend fill:#f3e5f5
    classDef database fill:#e8f5e8
    classDef external fill:#fff3e0
    
    class UI,COMP frontend
    class API,AUTH,VIEWS backend
    class MODELS,DB database
    class EXPORT,CHARTS external