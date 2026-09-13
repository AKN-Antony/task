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

class AutomationRule(models.Model):
    TRIGGER_CHOICES = (
        ('EVENT', 'Event-based'),
        ('TIME', 'Time-based (Schedule)'),
    )
    ACTION_CHOICES = (
        ('EMAIL', 'Send Email'),
        ('WEBHOOK', 'Trigger Webhook'),
        ('CREATE_TASK', 'Create a Task'),
        ('UPDATE_FIELD', 'Update Task Field'),
        ('NOTIFY', 'Send In-App Notification'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='automation_rules')
    
    trigger_type = models.CharField(max_length=20, choices=TRIGGER_CHOICES, default='EVENT')
    trigger_event = models.CharField(max_length=100, blank=True, help_text="e.g., TASK_CREATED, STATUS_CHANGED")
    cron_expression = models.CharField(max_length=50, blank=True, help_text="For time-based triggers (e.g. 0 9 * * *)")
    
    conditions = models.JSONField(default=list, blank=True, help_text="List of condition objects to evaluate")
    
    action_type = models.CharField(max_length=20, choices=ACTION_CHOICES)
    action_payload = models.JSONField(default=dict, blank=True, help_text="Payload for the action (e.g., email template, webhook body)")
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Webhook(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    url = models.URLField()
    secret = models.CharField(max_length=255, blank=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='webhooks')
    subscribed_events = models.JSONField(default=list, help_text="List of event names to listen for")
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.url})"

