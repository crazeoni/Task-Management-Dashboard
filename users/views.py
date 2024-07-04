from django.shortcuts import render

# Create your views here.
from django.contrib.auth import logout
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.forms import UserCreationForm
# views.py
from django.shortcuts import redirect
from django.contrib.auth import logout



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



def logout_view(request):
	logout(request)
	return redirect(reverse('tasks:task_list'))
