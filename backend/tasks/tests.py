from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from accounts.models import CustomUser, Organization, Role
from tasks.models import Task, TaskPriority

class TaskAPITestCase(APITestCase):
    def setUp(self):
        # Setup Organization
        self.org1 = Organization.objects.create(name="Tech Corp")
        self.org2 = Organization.objects.create(name="Other Corp")

        # Setup Users
        self.admin = CustomUser.objects.create_user(email="admin@tech.com", password="password123", role=Role.ADMIN, organization=self.org1)
        self.member = CustomUser.objects.create_user(email="member@tech.com", password="password123", role=Role.MEMBER, organization=self.org1)
        self.outsider = CustomUser.objects.create_user(email="outsider@other.com", password="password123", role=Role.MEMBER, organization=self.org2)

        # Setup Task
        self.task = Task.objects.create(title="Initial Task", creator=self.admin, organization=self.org1)

    def test_create_task_authenticated(self):
        self.client.force_authenticate(user=self.member)
        response = self.client.post('/api/v1/tasks/', {
            'title': 'New Task',
            'priority': TaskPriority.HIGH
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Task.objects.count(), 2)

    def test_create_task_unauthenticated(self):
        response = self.client.post('/api/v1/tasks/', {'title': 'New Task'})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_tenant_isolation(self):
        """Users should only see tasks from their own organization"""
        self.client.force_authenticate(user=self.outsider)
        response = self.client.get('/api/v1/tasks/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Outsider is in org2, so they should see 0 tasks (Task is in org1)
        self.assertEqual(len(response.data['results']), 0)

        # Member should see the task
        self.client.force_authenticate(user=self.member)
        response = self.client.get('/api/v1/tasks/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
