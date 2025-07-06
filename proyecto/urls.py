from django.urls import path, include
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.authtoken.views import obtain_auth_token  # Para token authentication
from django.shortcuts import redirect
from django.http import HttpResponse

def redirect_to_admin(request):
    """Redirige desde la raíz hacia el admin"""
    return redirect('/admin/')

def home_view(request):
    """Vista de bienvenida del sistema"""
    return HttpResponse("""
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sistema de Gestión de Combustible - CANTV Lara</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .container { 
                max-width: 500px; 
                background: white; 
                padding: 40px; 
                border-radius: 15px; 
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                text-align: center;
            }
            .logo { font-size: 48px; margin-bottom: 20px; }
            h1 { color: #2c3e50; margin-bottom: 10px; font-size: 24px; }
            h2 { color: #3498db; margin-bottom: 30px; font-size: 18px; }
            .links { display: flex; flex-direction: column; gap: 15px; margin-top: 30px; }
            .btn { 
                display: block; 
                padding: 15px 25px; 
                background: #3498db; 
                color: white; 
                text-decoration: none; 
                border-radius: 8px; 
                transition: all 0.3s ease;
                font-weight: 500;
            }
            .btn:hover { background: #2980b9; transform: translateY(-2px); }
            .btn.admin { background: #e74c3c; }
            .btn.admin:hover { background: #c0392b; }
            .btn.api { background: #27ae60; }
            .btn.api:hover { background: #229954; }
            .btn.frontend { background: #f39c12; }
            .btn.frontend:hover { background: #e67e22; }
            .footer { margin-top: 30px; color: #7f8c8d; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">⛽</div>
            <h1>Sistema de Gestión de Combustible</h1>
            <h2>CANTV Lara</h2>
            <p style="color: #7f8c8d; margin-bottom: 20px;">
                Sistema de monitoreo y control de generadores eléctricos
            </p>
            
            <div class="links">
                <a href="/admin/" class="btn admin">🔧 Panel de Administración</a>
                <a href="/api/" class="btn api">📊 API REST</a>
                <a href="/api/auth/" class="btn">🔐 Autenticación DRF</a>
                <a href="http://localhost:3001" class="btn frontend">🖥️ Aplicación Frontend</a>
            </div>
            
            <div class="footer">
                <p><strong>Proyecto Universitario UNETI</strong></p>
                <p>Desarrollado por: Darwin Colmenares, Yannis Iturriago, GianneFran Radomile</p>
            </div>
        </div>
    </body>
    </html>
    """)

urlpatterns = [
    # NUEVA: Ruta para la página raíz
    path('', home_view, name='home'),  # Opción 1: Página de bienvenida
    # path('', redirect_to_admin, name='home_redirect'),  # Opción 2: Redirección automática
    
    # TUS RUTAS EXISTENTES (sin cambios)
    path('admin/', admin.site.urls),
    
    # Rutas API
    path('api/', include('combustible_api.urls')),
    
    # Autenticación DRF (para pruebas)
    path('api/auth/', include('rest_framework.urls')),  # URLs de sesión de DRF
    
    # Token Authentication
    path('api/token-auth/', obtain_auth_token, name='api_token_auth'),  # Login vía token
]

# Solo incluye esto si usas archivos estáticos durante desarrollo
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)