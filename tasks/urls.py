from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet
from users.views import logout_view

router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')

app_name = "tasks"
urlpatterns = [
    path('', views.task_list, name='task_list'),
    path('<int:task_id>/', views.task_detail, name='task_detail'),
    path('new/', views.task_create, name='task_create'),
    path('<int:task_id>/edit/', views.task_update, name='task_update'),
    path('<int:task_id>/delete/', views.task_delete, name='task_delete'),
    path('status/<str:status>/', views.tasks_by_status, name='tasks_by_status'),
    path('tasks/status/all/', TaskViewSet.as_view({'get': 'get_tasks_by_status'}), name='tasks-by-status-all'),
    path('tasks/search/', views.search_tasks, name='search_tasks'),
    path('tasks/filter/', views.filter_tasks, name='filter_tasks'),
    path('logout/', logout_view, name='logout'),
    path('register/', views.register, name='register'),
    path('tasks/update_status/', views.update_task_status, name='update_task_status'),
    path('', include(router.urls)),
]

