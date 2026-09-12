import uuid
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models

class Role(models.TextChoices):
    ADMIN = 'ADMIN', 'Admin'
    MANAGER = 'MANAGER', 'Manager'
    MEMBER = 'MEMBER', 'Member'
    VIEWER = 'VIEWER', 'Viewer'

class Organization(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', Role.ADMIN)
        return self.create_user(email, password, **extra_fields)

def default_notification_prefs():
    return {"email": True, "in_app": True}

class CustomUser(AbstractUser):
    username = None
    email = models.EmailField(unique=True)
    
    # RBAC & Multi-tenancy
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.MEMBER)
    organization = models.ForeignKey(Organization, on_delete=models.SET_NULL, null=True, blank=True, related_name='users')

    # Profile Fields
    avatar_url = models.URLField(blank=True, null=True)
    timezone = models.CharField(max_length=50, default='UTC')
    notification_preferences = models.JSONField(default=default_notification_prefs)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return f"{self.email} ({self.role})"
