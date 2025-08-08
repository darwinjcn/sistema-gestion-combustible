# VERSIÓN ALTERNATIVA DE urls.py (si la anterior no funciona)
from django.urls import path, include
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.authtoken.views import obtain_auth_token
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
            .btn.auth { background: #9b59b6; }
            .btn.auth:hover { background: #8e44ad; }
            .footer { margin-top: 30px; color: #7f8c8d; font-size: 12px; }
            .status { 
                background: #e8f5e8; 
                padding: 10px; 
                border-radius: 5px; 
                margin: 20px 0; 
                color: #27ae60;
                font-weight: 500;
            }
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
            
            <div class="status">
                ✅ Django API funcionando correctamente<br>
                🔗 Puerto configurado para React: 3000
            </div>
            
            <div class="links">
                <a href="/admin/" class="btn admin">🔧 Panel de Administración</a>
                <a href="/api/" class="btn api">📊 API REST</a>
                <a href="/api/auth/login/" class="btn auth">🔐 Login DRF</a>
                <a href="/api/token-auth/" class="btn">🎫 Token Auth</a>
                <a href="http://localhost:3000" class="btn frontend">🖥️ Aplicación Frontend (Puerto 3000)</a>
            </div>
            
            <div class="footer">
                <p><strong>Proyecto Universitario UNETI</strong></p>
                <p>Desarrollado por: Darwin Colmenares, Yannis Iturriago, GianneFran Radomile</p>
                <p style="margin-top: 10px; font-size: 10px;">
                    Django 5.2.2 | PostgreSQL | React 18+ | Material-UI
                </p>
            </div>
        </div>
    </body>
    </html>
    """)

urlpatterns = [
    # Ruta para la página raíz
    path('', home_view, name='home'),
    
    # Panel de administración de Django
    path('admin/', admin.site.urls),
    
    # API REST de la aplicación
    path('api/', include('combustible_api.urls')),
    
    # ✅ Autenticación DRF (DEBE IR DESPUÉS de api/)
    path('api/auth/', include('rest_framework.urls')),
    
    # ✅ Token Authentication (para API programática)
    path('api/token-auth/', obtain_auth_token, name='api_token_auth'),
]

# Solo incluye esto si usas archivos estáticos durante desarrollo
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)