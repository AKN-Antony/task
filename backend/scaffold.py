import os

apps = ['accounts', 'tasks', 'projects', 'workflows', 'notifications', 'reports', 'audit']
base_dir = '/home/anto/Desktop/task/backend'

# Create core project
os.makedirs(f"{base_dir}/core", exist_ok=True)
with open(f"{base_dir}/manage.py", 'w') as f:
    f.write('''#!/usr/bin/env python
import os
import sys

def main():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed?"
        ) from exc
    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    main()
''')

with open(f"{base_dir}/core/__init__.py", 'w') as f:
    f.write('')

with open(f"{base_dir}/core/asgi.py", 'w') as f:
    f.write('''import os
from django.core.asgi import get_asgi_application
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
application = get_asgi_application()
''')

with open(f"{base_dir}/core/wsgi.py", 'w') as f:
    f.write('''import os
from django.core.wsgi import get_wsgi_application
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
application = get_wsgi_application()
''')

with open(f"{base_dir}/core/urls.py", 'w') as f:
    f.write('''from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # Base URL structure: /api/v1/...
]
''')

with open(f"{base_dir}/core/settings.py", 'w') as f:
    f.write('''import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = 'django-insecure-dummy-key-replace-me-in-production'
DEBUG = True
ALLOWED_HOSTS = []

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Third-party
    'rest_framework',
    'corsheaders',
] + [app for app in ['accounts', 'tasks', 'projects', 'workflows', 'notifications', 'reports', 'audit']]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'
WSGI_APPLICATION = 'core.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True
STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
''')

for app in apps:
    os.makedirs(f"{base_dir}/{app}", exist_ok=True)
    os.makedirs(f"{base_dir}/{app}/migrations", exist_ok=True)
    with open(f"{base_dir}/{app}/migrations/__init__.py", 'w') as f: f.write('')
    with open(f"{base_dir}/{app}/__init__.py", 'w') as f: f.write('')
    with open(f"{base_dir}/{app}/admin.py", 'w') as f: f.write('from django.contrib import admin\n')
    with open(f"{base_dir}/{app}/apps.py", 'w') as f:
        f.write(f'''from django.apps import AppConfig
class {app.capitalize()}Config(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = '{app}'
''')
    with open(f"{base_dir}/{app}/models.py", 'w') as f: f.write('from django.db import models\n')
    with open(f"{base_dir}/{app}/tests.py", 'w') as f: f.write('from django.test import TestCase\n')
    with open(f"{base_dir}/{app}/views.py", 'w') as f: f.write('from django.shortcuts import render\n')

print("Scaffold complete!")
