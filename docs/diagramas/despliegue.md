# Diagrama de Despliegue - Sistema de Gestión de Combustible

## Sistema de Gestión de Combustible CANTV Lara

```mermaid
graph TB
    subgraph "🖥️ Entorno de Desarrollo"
        subgraph "Máquina Local del Desarrollador"
            DEV_REACT[React Dev Server<br/>📱 Puerto 3001<br/>Webpack HMR]
            DEV_DJANGO[Django Dev Server<br/>🐍 Puerto 8000<br/>DEBUG=True]
            DEV_DB[(SQLite<br/>📁 db.sqlite3<br/>Archivo local)]
            DEV_VS[VS Code<br/>🔧 IDE Principal<br/>Extensions]
        end
        
        DEV_REACT -.->|HTTP Proxy| DEV_DJANGO
        DEV_DJANGO -.->|ORM| DEV_DB
        DEV_VS -.->|Desarrollo| DEV_REACT
        DEV_VS -.->|Desarrollo| DEV_DJANGO
    end

    subgraph "☁️ Entorno de Producción"
        subgraph "🌐 Servidor Web (Ubuntu 20.04)"
            NGINX[Nginx<br/>🔒 Puerto 80/443<br/>Reverse Proxy<br/>SSL/TLS]
            
            subgraph "🐳 Contenedores Docker"
                REACT_BUILD[React Build<br/>📦 Archivos estáticos<br/>Optimizado]
                GUNICORN[Gunicorn<br/>🚀 WSGI Server<br/>3 Workers]
                DJANGO_APP[Django App<br/>🎯 Puerto 8000<br/>PRODUCTION=True]
            end
            
            POSTGRES[(PostgreSQL<br/>🗄️ Puerto 5432<br/>Base de Datos)]
            REDIS[(Redis<br/>⚡ Puerto 6379<br/>Cache/Sessions)]
        end
        
        subgraph "📊 Monitoreo y Logs"
            GRAFANA[Grafana<br/>📈 Dashboard<br/>Puerto 3000]
            PROMETHEUS[Prometheus<br/>📊 Métricas<br/>Puerto 9090]
            LOGS[Log Files<br/>📝 /var/log/<br/>Rotación diaria]
        end
        
        subgraph "💾 Backup y Storage"
            BACKUP[(Backup DB<br/>🔄 Diario<br/>AWS S3)]
            STATIC[Static Files<br/>📁 /static/<br/>CDN Ready]
        end
    end

    subgraph "👥 Usuarios Finales"
        BROWSER[Navegador Web<br/>🌍 Chrome/Firefox<br/>HTTPS]
        MOBILE[Dispositivos Móviles<br/>📱 Responsive<br/>PWA Ready]
        ADMIN[Administradores<br/>👨‍💼 Django Admin<br/>Panel de Control]
    end

    %% Conexiones Desarrollo
    DEV_REACT -->|localhost:3001| BROWSER
    DEV_DJANGO -->|localhost:8000| BROWSER

    %% Conexiones Producción
    BROWSER -->|HTTPS:443| NGINX
    MOBILE -->|HTTPS:443| NGINX
    ADMIN -->|HTTPS:443/admin| NGINX
    
    NGINX -->|Proxy Pass| GUNICORN
    NGINX -->|Static Files| REACT_BUILD
    GUNICORN -->|WSGI| DJANGO_APP
    DJANGO_APP -->|TCP:5432| POSTGRES
    DJANGO_APP -->|TCP:6379| REDIS
    
    %% Monitoreo
    DJANGO_APP -.->|Métricas| PROMETHEUS
    PROMETHEUS -.->|Dashboard| GRAFANA
    DJANGO_APP -.->|Logs| LOGS
    
    %% Backup
    POSTGRES -.->|Backup| BACKUP
    REACT_BUILD -.->|Assets| STATIC

    %% Estilos
    classDef development fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef production fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef database fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    classDef monitoring fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef users fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    
    class DEV_REACT,DEV_DJANGO,DEV_DB,DEV_VS development
    class NGINX,REACT_BUILD,GUNICORN,DJANGO_APP production
    class POSTGRES,REDIS,BACKUP database
    class GRAFANA,PROMETHEUS,LOGS monitoring
    class BROWSER,MOBILE,ADMIN users