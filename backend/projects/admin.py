from django.contrib import admin
from .models import Project

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'organization', 'is_active', 'start_date', 'end_date')
    search_fields = ('name', 'description')
    list_filter = ('is_active', 'organization')
