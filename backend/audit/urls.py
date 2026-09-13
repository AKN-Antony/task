from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AuditLogViewSet, GDPRDataExportView, GDPRAccountDeletionView

router = DefaultRouter()
router.register(r'logs', AuditLogViewSet, basename='auditlog')

urlpatterns = [
    path('gdpr/export/', GDPRDataExportView.as_view(), name='gdpr-export'),
    path('gdpr/delete-account/', GDPRAccountDeletionView.as_view(), name='gdpr-delete-account'),
    path('', include(router.urls)),
]
