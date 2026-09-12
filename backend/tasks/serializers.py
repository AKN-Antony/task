from rest_framework import serializers
from .models import Task, Comment, Attachment, Tag

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'
        read_only_fields = ('organization', 'created_at')

class AttachmentSerializer(serializers.ModelSerializer):
    uploader_name = serializers.ReadOnlyField(source='uploader.email')

    class Meta:
        model = Attachment
        fields = '__all__'
        read_only_fields = ('uploader', 'task', 'created_at')

class CommentSerializer(serializers.ModelSerializer):
    author_name = serializers.ReadOnlyField(source='author.email')

    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ('author', 'task', 'created_at', 'updated_at')

class TaskSerializer(serializers.ModelSerializer):
    creator_name = serializers.ReadOnlyField(source='creator.email')
    assignee_name = serializers.ReadOnlyField(source='assignee.email')
    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(), source='tags', write_only=True, many=True, required=False
    )
    comments = CommentSerializer(many=True, read_only=True)
    attachments = AttachmentSerializer(many=True, read_only=True)

    class Meta:
        model = Task
        exclude = ('is_deleted', 'deleted_at')
        read_only_fields = ('creator', 'organization', 'created_at', 'updated_at')

