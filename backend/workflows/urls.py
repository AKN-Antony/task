from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WorkflowViewSet, WorkflowStageViewSet, TransitionRuleViewSet, AutomationRuleViewSet, WebhookViewSet

router = DefaultRouter()
router.register(r'workflows', WorkflowViewSet, basename='workflow')
router.register(r'workflow-stages', WorkflowStageViewSet, basename='workflowstage')
router.register(r'transition-rules', TransitionRuleViewSet, basename='transitionrule')
router.register(r'automation-rules', AutomationRuleViewSet, basename='automationrule')
router.register(r'webhooks', WebhookViewSet, basename='webhook')

urlpatterns = [
    path('', include(router.urls)),
]
