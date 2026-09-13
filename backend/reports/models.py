import uuid
from django.db import models
from django.conf import settings
from accounts.models import Organization

class ReportType(models.TextChoices):
    WORKLOAD = 'WORKLOAD', 'Workload Distribution'
    COMPLETION_RATE = 'COMPLETION_RATE', 'Task Completion Rate'
    OVERDUE = 'OVERDUE', 'Overdue Tasks'
    BURNDOWN = 'BURNDOWN', 'Sprint Burndown'

class SavedReport(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='saved_reports')
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_reports')
    
    report_type = models.CharField(max_length=50, choices=ReportType.choices)
    filters = models.JSONField(default=dict, blank=True, help_text="JSON payload for report filters (e.g., date ranges, specific users)")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.report_type})"
