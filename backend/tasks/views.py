from django.utils import timezone
from rest_framework import viewsets, permissions, filters
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
        return Task.objects.filter(is_deleted=False, organization=self.request.user.organization)

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

class TagViewSet(viewsets.ModelViewSet):
    serializer_class = TagSerializer

    def get_queryset(self):
        return Tag.objects.filter(organization=self.request.user.organization)

    def perform_create(self, serializer):
        serializer.save(organization=self.request.user.organization)

# (Comment and Attachment views can be nested or act independently. We will add them next if needed).
