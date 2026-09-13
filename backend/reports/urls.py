from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SavedReportViewSet, AnalyticsAPIView

router = DefaultRouter()
router.register(r'saved-reports', SavedReportViewSet, basename='savedreport')

urlpatterns = [
    path('analytics/dashboard/', AnalyticsAPIView.as_view(), name='analytics-dashboard'),
    path('', include(router.urls)),
]
