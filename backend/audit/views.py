import json
from django.utils import timezone
from django.http import HttpResponse
from rest_framework import viewsets, views, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import AuditLog, AuditAction
from .serializers import AuditLogSerializer
from accounts.models import CustomUser
from tasks.models import Task

class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Managers and Admins can view audit logs.
    """
    serializer_class = AuditLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return AuditLog.objects.filter(organization=self.request.user.organization)

class GDPRDataExportView(views.APIView):
    """
    GDPR Right to Access: Exports all user data as a JSON file.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        
        # Log the export action
        AuditLog.objects.create(
            user=user,
            organization=user.organization,
            action=AuditAction.EXPORT,
            entity_type='CustomUser',
            entity_id=str(user.id)
        )

        # Collect user data
        tasks = Task.objects.filter(creator=user).values('id', 'title', 'status', 'created_at')
        user_data = {
            'email': user.email,
            'role': user.role,
            'timezone': user.timezone,
            'date_joined': str(user.date_joined),
            'tasks_created': list(tasks)
        }
        
        response = HttpResponse(json.dumps(user_data, default=str), content_type='application/json')
        response['Content-Disposition'] = f'attachment; filename="gdpr_export_{user.email}.json"'
        return response

class GDPRAccountDeletionView(views.APIView):
    """
    GDPR Right to be Forgotten: Deletes the user account.
    """
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        user = request.user
        # Optional: Hand over tasks to organization admin instead of deleting
        user.delete()
        return Response({"message": "Account successfully deleted."}, status=status.HTTP_204_NO_CONTENT)
