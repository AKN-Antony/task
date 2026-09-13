import uuid
from django.db import models
from django.conf import settings
from accounts.models import Organization

class Workflow(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='workflows')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class WorkflowStage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    workflow = models.ForeignKey(Workflow, on_delete=models.CASCADE, related_name='stages')
    name = models.CharField(max_length=255) # e.g., "Requested", "Approved", "QA"
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.workflow.name} - {self.name}"

class TransitionRule(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    workflow = models.ForeignKey(Workflow, on_delete=models.CASCADE, related_name='transitions')
    from_stage = models.ForeignKey(WorkflowStage, on_delete=models.CASCADE, related_name='outgoing_transitions', null=True, blank=True)
    to_stage = models.ForeignKey(WorkflowStage, on_delete=models.CASCADE, related_name='incoming_transitions')
    
    # Auto-transition conditions can be stored as JSON, 
    # e.g. {"condition": "all_subtasks_done"} or {"condition": "priority_high"}
    condition_payload = models.JSONField(default=dict, blank=True)
    is_automatic = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.from_stage.name if self.from_stage else 'Start'} -> {self.to_stage.name}"
