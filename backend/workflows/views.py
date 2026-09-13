from rest_framework import viewsets
from .models import Workflow, WorkflowStage, TransitionRule, AutomationRule, Webhook
from .serializers import WorkflowSerializer, WorkflowStageSerializer, TransitionRuleSerializer, AutomationRuleSerializer, WebhookSerializer

class WorkflowViewSet(viewsets.ModelViewSet):
    serializer_class = WorkflowSerializer

    def get_queryset(self):
        return Workflow.objects.filter(organization=self.request.user.organization)

    def perform_create(self, serializer):
        serializer.save(organization=self.request.user.organization)

class WorkflowStageViewSet(viewsets.ModelViewSet):
    serializer_class = WorkflowStageSerializer

    def get_queryset(self):
        return WorkflowStage.objects.filter(workflow__organization=self.request.user.organization)

class TransitionRuleViewSet(viewsets.ModelViewSet):
    serializer_class = TransitionRuleSerializer

    def get_queryset(self):
        return TransitionRule.objects.filter(workflow__organization=self.request.user.organization)

class AutomationRuleViewSet(viewsets.ModelViewSet):
    serializer_class = AutomationRuleSerializer

    def get_queryset(self):
        return AutomationRule.objects.filter(organization=self.request.user.organization)

    def perform_create(self, serializer):
        serializer.save(organization=self.request.user.organization)

class WebhookViewSet(viewsets.ModelViewSet):
    serializer_class = WebhookSerializer

    def get_queryset(self):
        return Webhook.objects.filter(organization=self.request.user.organization)

    def perform_create(self, serializer):
        serializer.save(organization=self.request.user.organization)
