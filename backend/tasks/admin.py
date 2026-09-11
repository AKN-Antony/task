from django.contrib import admin
from .models import Task, Comment, Attachment

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'status', 'priority', 'assignee', 'organization', 'created_at')
    list_filter = ('status', 'priority', 'is_deleted')
    search_fields = ('title', 'description')

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('author', 'task', 'created_at')
    search_fields = ('content', 'author__email', 'task__title')

@admin.register(Attachment)
class AttachmentAdmin(admin.ModelAdmin):
    list_display = ('filename', 'task', 'uploader', 'created_at')
    search_fields = ('filename', 'task__title', 'uploader__email')
