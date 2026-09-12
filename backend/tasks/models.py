import uuid
from django.db import models
from django.conf import settings
from accounts.models import Organization

class TaskStatus(models.TextChoices):
    BACKLOG = 'BACKLOG', 'Backlog'
    TODO = 'TODO', 'Todo'
    IN_PROGRESS = 'IN_PROGRESS', 'In Progress'
    REVIEW = 'REVIEW', 'Review'
    DONE = 'DONE', 'Done'
    ARCHIVED = 'ARCHIVED', 'Archived'

class TaskPriority(models.TextChoices):
    LOW = 'LOW', 'Low'
    MEDIUM = 'MEDIUM', 'Medium'
    HIGH = 'HIGH', 'High'
    URGENT = 'URGENT', 'Urgent'

class Task(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=TaskStatus.choices, default=TaskStatus.TODO)
    priority = models.CharField(max_length=20, choices=TaskPriority.choices, default=TaskPriority.MEDIUM)
    due_date = models.DateTimeField(null=True, blank=True)
    
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='created_tasks', on_delete=models.CASCADE)
    assignee = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='assigned_tasks', on_delete=models.SET_NULL, null=True, blank=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='tasks')
    
    # Tags
    tags = models.ManyToManyField('Tag', blank=True, related_name='tasks')
    
    # Parent Task for Subtasks
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='subtasks')

    # Soft Delete
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class Comment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    
    # For threaded comments
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Comment by {self.author} on {self.task}"

class Attachment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='attachments')
    uploader = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='uploaded_files')
    file = models.FileField(upload_to='task_attachments/%Y/%m/%d/')
    filename = models.CharField(max_length=255)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.filename} for {self.task.title}"

class Tag(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50)
    color = models.CharField(max_length=20, default="#808080")
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='tags')

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('name', 'organization')

    def __str__(self):
        return self.name
