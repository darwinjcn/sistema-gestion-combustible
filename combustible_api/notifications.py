from django.core.mail import send_mail
from django.conf import settings

def send_low_level_email(generador, umbral, to_emails, nivel_actual):
    """
    Envía correo de alerta cuando el nivel de combustible está por debajo del umbral.
    En desarrollo usa EMAIL_BACKEND de consola.
    """
    if not to_emails:
        return
    subject = f"Alerta: Nivel bajo en {generador.modelo} (ID: {generador.id})"
    body = (
        f"Generador: {generador.modelo} (ID: {generador.id})\n"
        f"Nivel actual: {nivel_actual} L\n"
        f"Umbral: {umbral} L\n"
        f"Estado: {generador.estado}\n\n"
        "Por favor, tome las acciones correspondientes."
    )
    from_email = getattr(settings, "DEFAULT_FROM_EMAIL", "no-reply@localhost")
    try:
        send_mail(subject, body, from_email, to_emails, fail_silently=True)
    except Exception:
        # No interrumpir el flujo si el correo falla
        pass