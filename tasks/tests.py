from django.test import TestCase
from django.contrib.auth.models import User
from .models import Task

class TaskModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='password')
        self.task = Task.objects.create(
            title='Test Task',
            description='Test Description',
            status='in_progress',
            priority='medium',
            due_date='2024-06-28T12:00:00Z',
            category='Test Category',
            assigned_to=self.user
        )

    def test_task_creation(self):
        self.assertEqual(self.task.title, 'Test Task')
        self.assertEqual(self.task.description, 'Test Description')
        self.assertEqual(self.task.status, 'in_progress')
        self.assertEqual(self.task.priority, 'medium')
        self.assertEqual(self.task.due_date, '2024-06-28T12:00:00Z')
        self.assertEqual(self.task.category, 'Test Category')
        self.assertEqual(self.task.assigned_to, self.user)

class TaskViewTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='password')
        self.client.login(username='testuser', password='password')
        self.task = Task.objects.create(
            title='Test Task',
            description='Test Description',
            status='in_progress',
            priority='medium',
            due_date='2024-06-28T12:00:00Z',
            category='Test Category',
            assigned_to=self.user
        )

    def test_task_list_view(self):
        response = self.client.get('/tasks/')
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Test Task')

    def test_task_detail_view(self):
        response = self.client.get(f'/tasks/{self.task.id}/')
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Test Task')
