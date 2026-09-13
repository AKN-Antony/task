from django.contrib import admin
from .models import Project, Milestone, Sprint

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'organization', 'is_active', 'start_date', 'end_date')
    search_fields = ('name', 'description')
    list_filter = ('is_active', 'organization')

@admin.register(Milestone)
class MilestoneAdmin(admin.ModelAdmin):
    list_display = ('name', 'project', 'due_date', 'is_completed')
    list_filter = ('is_completed', 'project')

@admin.register(Sprint)
class SprintAdmin(admin.ModelAdmin):
    list_display = ('name', 'project', 'start_date', 'end_date', 'is_completed')
    list_filter = ('is_completed', 'project')
