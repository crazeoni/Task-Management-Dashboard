$(document).ready(function() {
    
    
    // Load tasks on page load
    loadTasks();

    // Function to load tasks
    function loadTasks() {
        $.ajax({
            url: '/tasks/status/all/',
            method: 'GET',
            success: function(data) {
                let inProgressTasks = data.in_progress;
                let completedTasks = data.completed;
                let overdueTasks = data.overdue;

                let taskListInProgress = $('#task-list-in-progress');
                let taskListCompleted = $('#task-list-completed');
                let taskListOverdue = $('#task-list-overdue');

                taskListInProgress.empty();
                taskListCompleted.empty();
                taskListOverdue.empty();

                inProgressTasks.forEach(task => {
                    taskListInProgress.append(createTaskCard(task));
                });

                completedTasks.forEach(task => {
                    taskListCompleted.append(createTaskCard(task));
                });

                overdueTasks.forEach(task => {
                    taskListOverdue.append(createTaskCard(task));
                });
            }
        });
    }
    
			// Event listener for filtering tasks by priority
            $('#filter-priority').on('change', function() {
                const priority = $(this).val().toLowerCase();
                filterTasks({ priority: priority });
            });

            // Event listener for filtering tasks by due date
            $('#filter-due-date').on('change', function() {
                const dueDate = $(this).val();
                filterTasks({ due_date: dueDate });
            });

            // Event listener for filtering tasks by category
            $('#filter-category').on('change', function() {
                const category = $(this).val().toLowerCase();
                filterTasks({ category: category });
            });

            // Function to filter tasks based on criteria
            function filterTasks(filters) {
                $.ajax({
                    url: '/tasks/filter/',
                    method: 'GET',
                    data: filters,
                    success: function(data) {
                        displayTasks(data.tasks);
                    },
                    error: function(error) {
                        console.error('Error filtering tasks:', error);
                    }
                });
            }
    
    // Event listener for search input
    $('#search-input').on('input', function() {
    const query = $(this).val().trim();

    $.ajax({
        url: '/tasks/search/',
        method: 'GET',
        data: {
            query: query
        },
        success: function(data) {
            displayTasks(data.tasks); // Update task list based on search results
        },
        error: function(error) {
            console.error('Error searching tasks:', error);
        }
    });
});

    // Function to display tasks
    function displayTasks(tasks) {
        $('#task-list').empty(); // Clear previous results
        tasks.forEach(task => {
            $('#task-list').append(`
                <div class="p-4 bg-white rounded-lg shadow-md task-card">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center space-x-2">
                                        <span class="px-2 py-1 text-xs font-semibold text-red-600 bg-red-100 rounded-full">${task.priority}</span>
                                        <span class="text-sm text-gray-500">${new Date(task.due_date).toLocaleDateString()}</span>
                                        <span class="text-sm text-gray-500">${task.category}</span>
                                    </div>
                                    <div class="flex items-center space-x-2">
										<button class="text-gray-500 hover:text-gray-700">
											<span class="material-icons">visibility</span>
										</button>
                                        <button class="edit-task text-gray-500 hover:text-gray-700 edit-task">
                                            <span class="material-icons edit-task" >edit</span>
                                        </button>
                                        <button class="delete-task text-gray-500 hover:text-gray-700">
                                            <span class="material-icons">delete</span>
                                        </button>
                                    </div>
                                </div>
                                <h3 class="mt-2 text-lg font-bold">${task.title}</h3>
                                <a href="{% url 'tasks:task_detail' task.id %}">task d</a>
                                <p class="mt-1 text-sm text-gray-600">${task.description}</p>
                                <div class="flex items-center justify-between mt-4">
                                    <div class="flex items-center space-x-2">
                                        <img src="https://via.placeholder.com/24" alt="User" class="rounded-full">
                                        <img src="https://via.placeholder.com/24" alt="User" class="rounded-full">
                                        <img src="https://via.placeholder.com/24" alt="User" class="rounded-full">
                                    </div>
                                    <div class="text-sm text-gray-500">3/3</div>
                                </div>
                            </div>
            `);
        });
    }
    
    function createTaskCard(task) {
        return `
			<div class="p-4 bg-white rounded-lg shadow-md task-card">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center space-x-2">
                                        <span class="px-2 py-1 text-xs font-semibold text-red-600 bg-red-100 rounded-full">${task.priority}</span>
                                        <span class="text-sm text-gray-500">${new Date(task.due_date).toLocaleDateString()}</span>
                                        <span class="text-sm text-gray-500">${task.category}</span>
                                    </div>
                                    <div class="flex items-center space-x-2">
										<button class="text-gray-500 hover:text-gray-700">
											<span class="material-icons">visibility</span>
										</button>
                                        <button class="edit-task text-gray-500 hover:text-gray-700 edit-task">
                                            <span class="material-icons edit-task" >edit</span>
                                        </button>
                                        <button class="delete-task text-gray-500 hover:text-gray-700">
                                            <span class="material-icons">delete</span>
                                        </button>
                                    </div>
                                </div>
                                <h3 class="mt-2 text-lg font-bold">${task.title}</h3>
                                <a href="{% url 'tasks:task_detail' task.id %}">task d</a>
                                <p class="mt-1 text-sm text-gray-600">${task.description}</p>
                                <div class="flex items-center justify-between mt-4">
                                    <div class="flex items-center space-x-2">
                                        <img src="https://via.placeholder.com/24" alt="User" class="rounded-full">
                                        <img src="https://via.placeholder.com/24" alt="User" class="rounded-full">
                                        <img src="https://via.placeholder.com/24" alt="User" class="rounded-full">
                                    </div>
                                    <div class="text-sm text-gray-500">3/3</div>
                                </div>
                            </div>
			
            
        `;
    }
    
    
	
    // Event listener for creating a new task
    $('#create-task').on('click', function() {
        $('#task-modal').removeClass('hidden');
        $('#task-form').html(`
            <label>Title</label>
            <input type="text" name="title" class="w-full border p-2 mb-2">
            <label>Description</label>
            <textarea name="description" class="w-full border p-2 mb-2"></textarea>
            <label>Status</label>
            <select name="status" class="w-full border p-2 mb-2">
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
            </select>
            <label>Priority</label>
            <select name="priority" class="w-full border p-2 mb-2">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>
            <label>Due Date</label>
            <input type="datetime-local" name="due_date" class="w-full border p-2 mb-2">
            <label>Category</label>
            <input type="text" name="category" class="w-full border p-2 mb-2">
            <button type="submit" class="bg-blue-500 text-white px-4 py-2">Save</button>
        `);
    });

    // Event listener for submitting the task form
    $('#task-form').on('submit', function(event) {
        event.preventDefault();
        $.ajax({
            url: '/tasks/new/',
            method: 'POST',
            headers: {
				'Authorization': 'Token ' + localStorage.getItem('token'),
				'X-CSRFToken': Cookies.get('csrftoken')  // Make sure to include 'js.cookie' library for this
			},
            data: $(this).serialize(),
            success: function(data) {
                $('#task-modal').addClass('hidden');
                loadTasks();
            }
        });
    });
    
    // Event listener for editing a task
            $(document).on('click', '.edit-task', function () {
                let taskId = $(this).data('id');
                $.ajax({
                    url: `/tasks/${taskId}/`,
                    method: 'GET',
                    success: function (data) {
                        let task = data.task;
                        $('#edit-task-modal').removeClass('hidden');
                        $('#edit-task-form').html(`
                            <input type="hidden" name="id" value="${task.id}">
                            <label>Title</label>
                            <input type="text" name="title" value="${task.title}" class="w-full border p-2 mb-2">
                            <label>Description</label>
                            <textarea name="description" class="w-full border p-2 mb-2">${task.description}</textarea>
                            <label>Status</label>
                            <select name="status" class="w-full border p-2 mb-2">
                                <option value="in_progress" ${task.status === 'in_progress' ? 'selected' : ''}>In Progress</option>
                                <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>Completed</option>
                                <option value="overdue" ${task.status === 'overdue' ? 'selected' : ''}>Overdue</option>
                            </select>
                            <label>Priority</label>
                            <select name="priority" class="w-full border p-2 mb-2">
                                <option value="low" ${task.priority === 'low' ? 'selected' : ''}>Low</option>
                                <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>Medium</option>
                                <option value="high" ${task.priority === 'high' ? 'selected' : ''}>High</option>
                            </select>
                            <label>Due Date</label>
                            <input type="datetime-local" name="due_date" value="${task.due_date}" class="w-full border p-2 mb-2">
                            <label>Category</label>
                            <input type="text" name="category" value="${task.category}" class="w-full border p-2 mb-2">
                            <button type="submit" class="bg-blue-500 text-white px-4 py-2">Save</button>
                        `);
                    }
                });
            });
            
            // Event listener for submitting the task form (edit)
            $(document).on('submit', '#edit-task-form', function (event) {
                event.preventDefault();
                let taskId = $('input[name="id"]').val();
                $.ajax({
                    url: `/tasks/${taskId}/`,
                    method: 'POST',
                    data: $(this).serialize(),
                    success: function (data) {
                        $('#edit-task-modal').addClass('hidden');
                        loadTasks();
                    }
                });
            });
            
            

            
            
            // Event listener for delete buttons
    $(document).on('click', '.delete-task', function() {
        const taskId = $(this).data('id');
        $('#delete-task-modal').removeClass('hidden');
        $('#confirm-delete').off('click').on('click', function() {
            $.ajax({
                url: `/tasks/${taskId}/`,
                method: 'DELETE',
                success: function(data) {
                    $('#delete-task-modal').addClass('hidden');
                    loadTasks();
                },
                error: function(error) {
                    console.error('Error deleting task:', error);
                }
            });
        });
        $('#cancel-delete').off('click').on('click', function() {
            $('#delete-task-modal').addClass('hidden');
        });
    });
});
