from rest_framework import serializers
from .models import Workflow, WorkflowStage, TransitionRule

class WorkflowStageSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkflowStage
        fields = '__all__'
        read_only_fields = ('created_at',)

class TransitionRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransitionRule
        fields = '__all__'
        read_only_fields = ('created_at',)

class WorkflowSerializer(serializers.ModelSerializer):
    stages = WorkflowStageSerializer(many=True, read_only=True)
    transitions = TransitionRuleSerializer(many=True, read_only=True)

    class Meta:
        model = Workflow
        fields = '__all__'
        read_only_fields = ('organization', 'created_at', 'updated_at')
