from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WorkflowViewSet, WorkflowStageViewSet, TransitionRuleViewSet

router = DefaultRouter()
router.register(r'workflows', WorkflowViewSet, basename='workflow')
router.register(r'workflow-stages', WorkflowStageViewSet, basename='workflowstage')
router.register(r'transition-rules', TransitionRuleViewSet, basename='transitionrule')

urlpatterns = [
    path('', include(router.urls)),
]
