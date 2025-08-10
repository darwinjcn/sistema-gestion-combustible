from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token

@csrf_exempt
@api_view(["POST"])
@permission_classes([AllowAny])
@authentication_classes([])  # Desactiva SessionAuthentication (evita CSRF)
def login_view(request):
    """
    Login sin CSRF para clientes externos (React).
    Body JSON: { "username": "...", "password": "..." }
    Respuesta: { "token": "..." }
    """
    username = (request.data.get("username") or "").strip()
    password = request.data.get("password") or ""
    if not username or not password:
        return Response({"detail": "username y password son requeridos"}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(username=username, password=password)
    if not user:
        return Response({"detail": "Unable to log in with provided credentials."}, status=status.HTTP_400_BAD_REQUEST)

    token, _created = Token.objects.get_or_create(user=user)
    return Response({"token": token.key}, status=status.HTTP_200_OK)