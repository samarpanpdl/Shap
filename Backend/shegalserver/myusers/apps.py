from django.apps import AppConfig


# users/apps.py
from django.apps import AppConfig

class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'myusers'

    def ready(self):
        import myusers.signals  # <-- make sure this matches your app name
