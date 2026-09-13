from django.shortcuts import render
from rest_framework import viewsets
from .models import Project, Milestone, Sprint
from .serializers import ProjectSerializer, MilestoneSerializer, SprintSerializer

class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer

    def get_queryset(self):
        return Project.objects.filter(organization=self.request.user.organization)

    def perform_create(self, serializer):
        serializer.save(
            owner=self.request.user,
            organization=self.request.user.organization
        )

class MilestoneViewSet(viewsets.ModelViewSet):
    serializer_class = MilestoneSerializer

    def get_queryset(self):
        return Milestone.objects.filter(project__organization=self.request.user.organization)

class SprintViewSet(viewsets.ModelViewSet):
    serializer_class = SprintSerializer

    def get_queryset(self):
        return Sprint.objects.filter(project__organization=self.request.user.organization)
