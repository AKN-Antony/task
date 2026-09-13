from django.utils import timezone
from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Task, Tag, Comment, Attachment
from .serializers import TaskSerializer, TagSerializer, CommentSerializer, AttachmentSerializer

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'priority', 'assignee', 'tags']
    search_fields = ['title', 'description', 'assignee__email', 'tags__name']
    ordering_fields = ['created_at', 'due_date', 'priority']
    ordering = ['-created_at']

    def get_queryset(self):
        # Only return non-deleted tasks for the user's organization
        return Task.objects.select_related('creator', 'assignee', 'organization', 'project').prefetch_related('tags', 'comments', 'attachments').filter(
            is_deleted=False, 
            organization=self.request.user.organization
        )

    def perform_create(self, serializer):
        serializer.save(
            creator=self.request.user,
            organization=self.request.user.organization
        )

    def perform_destroy(self, instance):
        # Soft delete
        instance.is_deleted = True
        instance.deleted_at = timezone.now()
        instance.save()

    @action(detail=False, methods=['post'])
    def ai_smart_prioritize(self, request):
        """
        Phase 14: AI/ML Enhancements.
        Simulated endpoint that uses a hypothetical ML model to auto-assign 
        priorities to the user's unprioritized tasks based on NLP/text analysis of the title.
        """
        tasks = self.get_queryset().filter(priority='LOW')
        # Here we would call our ML microservice or OpenAI API
        # For now, we simulate an AI decision engine:
        updated_count = 0
        for task in tasks:
            if 'urgent' in task.title.lower() or 'asap' in task.title.lower():
                task.priority = 'URGENT'
                task.save()
                updated_count += 1
            elif 'bug' in task.title.lower():
                task.priority = 'HIGH'
                task.save()
                updated_count += 1
                
        return Response({
            "message": f"AI Engine successfully analyzed open tasks and reprioritized {updated_count} items."
        })

class TagViewSet(viewsets.ModelViewSet):
    serializer_class = TagSerializer

    def get_queryset(self):
        return Tag.objects.filter(organization=self.request.user.organization)

    def perform_create(self, serializer):
        serializer.save(organization=self.request.user.organization)

class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer

    def get_queryset(self):
        return Comment.objects.filter(task__organization=self.request.user.organization)

    def perform_create(self, serializer):
        # We expect 'task_id' to be passed in the request data, or we could handle nested routing.
        # Let's assume standard routing where task is passed in payload.
        serializer.save(author=self.request.user)

class AttachmentViewSet(viewsets.ModelViewSet):
    serializer_class = AttachmentSerializer

    def get_queryset(self):
        return Attachment.objects.filter(task__organization=self.request.user.organization)

    def perform_create(self, serializer):
        serializer.save(uploader=self.request.user)
