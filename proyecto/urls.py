from django.urls import path, include
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.authtoken.views import obtain_auth_token  # Para token authentication

urlpatterns = [
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