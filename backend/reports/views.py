from rest_framework import viewsets, views
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Q
from django.utils import timezone
from .models import SavedReport
from .serializers import SavedReportSerializer
from tasks.models import Task, TaskStatus

class SavedReportViewSet(viewsets.ModelViewSet):
    serializer_class = SavedReportSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SavedReport.objects.filter(organization=self.request.user.organization)

    def perform_create(self, serializer):
        serializer.save(
            creator=self.request.user,
            organization=self.request.user.organization
        )

class AnalyticsAPIView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        organization = request.user.organization
        now = timezone.now()
        
        # 1. Workload Distribution
        workload = Task.objects.filter(
            organization=organization,
            is_deleted=False
        ).exclude(
            status__in=[TaskStatus.DONE, TaskStatus.ARCHIVED]
        ).values('assignee__email').annotate(open_tasks=Count('id')).order_by('-open_tasks')

        # 2. Overdue Tasks
        overdue_count = Task.objects.filter(
            organization=organization,
            is_deleted=False,
            due_date__lt=now
        ).exclude(status__in=[TaskStatus.DONE, TaskStatus.ARCHIVED]).count()

        # 3. Completion Rate (Total Tasks vs Done Tasks)
        total_tasks = Task.objects.filter(organization=organization, is_deleted=False).count()
        completed_tasks = Task.objects.filter(
            organization=organization, 
            is_deleted=False, 
            status=TaskStatus.DONE
        ).count()
        completion_rate = (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0

        return Response({
            'workload_distribution': list(workload),
            'overdue_tasks_count': overdue_count,
            'completion_rate_percentage': round(completion_rate, 2),
            'total_tasks': total_tasks,
            'completed_tasks': completed_tasks
        })
