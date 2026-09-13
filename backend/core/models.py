import uuid
from django.db import models

class FeatureFlag(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, unique=True, help_text="e.g. 'new_dashboard', 'ai_prioritization'")
    is_active = models.BooleanField(default=False)
    description = models.TextField(blank=True)
    rollout_percentage = models.IntegerField(default=100, help_text="0 to 100")

    def __str__(self):
        return f"{self.name} - {'ON' if self.is_active else 'OFF'}"

class UserFeedback(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey('accounts.CustomUser', on_delete=models.CASCADE, related_name='feedbacks')
    feature = models.CharField(max_length=255, blank=True, help_text="Which feature are they giving feedback on?")
    rating = models.IntegerField(default=5, help_text="1 to 5")
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback from {self.user.email} - {self.rating}/5"
