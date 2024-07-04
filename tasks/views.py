from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponseRedirect
from django.urls import reverse
from .models import Task
from .forms import TaskForm, TaskEditForm
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.utils.dateparse import parse_datetime
from rest_framework import viewsets
from rest_framework.viewsets import ViewSet
from .serializers import TaskSerializer
# Filter tasks by status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.shortcuts import render, redirect
from django.contrib.auth import login
from django.urls import reverse
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import logout


@csrf_exempt
def update_task_status(request):
    if request.method == 'POST':
        task_id = request.POST.get('task_id')
        new_status = request.POST.get('status')
        task = get_object_or_404(Task, id=task_id)
        task.status = new_status
        task.save()
        return JsonResponse({'success': True})
    return JsonResponse({'success': False}, status=400)

def logout_view(request):
    logout(request)
    return redirect(reverse('tasks:task_list'))


def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect(reverse('tasks:task_list'))
    else:
        form = UserCreationForm()
    return render(request, 'tasks/register.html', {'form': form})


class TaskViewSet(viewsets.ModelViewSet):
	queryset = Task.objects.all()
	@action(detail=False, methods=['get'], url_path='status/all')
	def get_tasks_by_status(self, request):
		tasks = Task.objects.all()
		serializer = TaskSerializer(tasks, many=True)
	
		grouped_tasks = {
			'in_progress': [],
			'completed': [],
			'overdue': []
		}
	
		for task in serializer.data:
			grouped_tasks[task['status'].lower().replace(" ", "_")].append(task)
	
		return Response(grouped_tasks)

def filter_tasks(request):
    priority = request.GET.get('priority')
    due_date = request.GET.get('due_date')
    category = request.GET.get('category')

    tasks = Task.objects.all()

    if priority:
        tasks = tasks.filter(priority=priority)
    if due_date:
        tasks = tasks.filter(due_date=due_date)
    if category:
        tasks = tasks.filter(category=category)

    serializer = TaskSerializer(tasks, many=True)
    return JsonResponse({'tasks': serializer.data})

def search_tasks(request):
    query = request.GET.get('query', None)
    if query:
        tasks = Task.objects.filter(title__icontains=query)
    else:
        tasks = Task.objects.all()

    serializer = TaskSerializer(tasks, many=True)
    return JsonResponse({'tasks': serializer.data})


def task_list(request):
    tasks = Task.objects.all()
    in_progress = Task.objects.filter(status='in_progress').order_by('-due_date')
    completed = Task.objects.filter(status='completed').order_by('-due_date')
    overdue = Task.objects.filter(status='overdue').order_by('-due_date')
    return render(request, 'tasks/tasks_list.html', {'tasks': tasks, 'in_progress': in_progress, 'completed': completed, 'overdue': overdue})

@login_required
def task_detail(request, task_id):
    task = get_object_or_404(Task, pk=task_id)
    return render(request, 'tasks/task_detail.html', {'task': task})


def task_create(request):
    if request.method == 'POST':
        form = TaskForm(request.POST)
        if form.is_valid():
            task = form.save()
            #return(HttpResponseRedirect(reverse('tasks:task_detail', task_id=task.id)))
            return redirect('tasks:task_detail', task_id=task.id)
    else:
        form = TaskForm()
    return render(request, 'tasks/task_form.html', {'form': form})


def task_update(request, task_id):
    task = get_object_or_404(Task, pk=task_id)
    if request.method == 'POST':
        form = TaskEditForm(request.POST, instance=task)
        if form.is_valid():
            task = form.save()
            return redirect('task_detail', task_id=task.id)
    else:
        form = TaskEditForm(instance=task)
    return render(request, 'tasks/edit_form.html', {'form': form})


def task_delete(request, task_id):
    task = get_object_or_404(Task, pk=task_id)
    task.delete()
    return redirect('tasks:task_list')

@login_required
def tasks_by_status(request, status):
    tasks = Task.objects.filter(status=status)
    return JsonResponse({'tasks': list(tasks.values())})

@action(detail=False, methods=['get'], url_path='status/all')
def get_tasks_by_status(self, request):
	tasks = Task.objects.all()
	serializer = TaskSerializer(tasks, many=True)
	
	grouped_tasks = {
		'in_progress': [],
		'completed': [],
		'overdue': []
	}
	
	for task in serializer.data:
		grouped_tasks[task['status'].lower().replace(" ", "_")].append(task)
	
	return Response(grouped_tasks)
