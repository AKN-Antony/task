import uuid
from django.db import models
from django.conf import settings
from accounts.models import Organization

class Project(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='owned_projects', on_delete=models.CASCADE)
    members = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='projects', blank=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='projects')
    
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
