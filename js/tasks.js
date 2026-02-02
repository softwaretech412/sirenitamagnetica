// Task Management API

const taskAPI = {
    // Get all tasks for current user
    getTasksByUser: function(userId) {
        const tasks = API.getTasks();
        return tasks.filter(t => t.userId === userId);
    },

    // Get all tasks (for admin)
    getAllTasks: function() {
        return API.getTasks();
    },

    // Get task by ID
    getTaskById: function(taskId) {
        const tasks = API.getTasks();
        return tasks.find(t => t.id === parseInt(taskId));
    },

    // Create new task
    createTask: function(userId, title, description, status, priority = 'medium', dueDate = null, category = null) {
        const tasks = API.getTasks();
        const newTask = {
            id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
            userId: userId,
            title: title,
            description: description || '',
            status: status || 'pending',
            priority: priority || 'medium',
            dueDate: dueDate || null,
            category: category || null,
            createdAt: new Date().toISOString()
        };
        
        tasks.push(newTask);
        API.saveTasks(tasks);
        return newTask;
    },

    // Update task
    updateTask: function(taskId, title, description, status, userId = null, category = null, priority = null) {
        const tasks = API.getTasks();
        const taskIndex = tasks.findIndex(t => t.id === parseInt(taskId));
        
        if (taskIndex !== -1) {
            tasks[taskIndex].title = title;
            tasks[taskIndex].description = description || '';
            tasks[taskIndex].status = status;
            if (userId !== null) {
                tasks[taskIndex].userId = userId;
            }
            if (category !== null) {
                tasks[taskIndex].category = category;
            }
            if (priority !== null) {
                tasks[taskIndex].priority = priority;
            }
            API.saveTasks(tasks);
            return tasks[taskIndex];
        }
        
        return null;
    },

    // Delete task
    deleteTask: function(taskId) {
        const tasks = API.getTasks();
        const filteredTasks = tasks.filter(t => t.id !== parseInt(taskId));
        API.saveTasks(filteredTasks);
        return true;
    },

    // Get tasks by status
    getTasksByStatus: function(status) {
        const tasks = API.getTasks();
        return tasks.filter(t => t.status === status);
    }
};

// Global functions for task management
let currentEditingTaskId = null;

function loadTasks(statusFilter = null) {
    const currentUser = authAPI.getCurrentUser();
    if (!currentUser) return;
    
    let tasks = taskAPI.getTasksByUser(currentUser.id);
    
    if (statusFilter) {
        tasks = tasks.filter(t => t.status === statusFilter);
    }
    
    const tasksList = document.getElementById('tasksList');
    tasksList.innerHTML = '';
    
    if (tasks.length === 0) {
        tasksList.innerHTML = '<div class="col-span-full"><div class="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg">No tasks found.</div></div>';
        return;
    }
    
    tasks.forEach(task => {
        const taskCard = createTaskCard(task);
        tasksList.appendChild(taskCard);
    });
}

function createTaskCard(task) {
    const col = document.createElement('div');
    
    const statusColors = {
        'pending': 'bg-yellow-500',
        'in progress': 'bg-cyan-500',
        'completed': 'bg-green-500'
    };
    
    const statusColor = statusColors[task.status] || 'bg-gray-500';
    
    col.innerHTML = `
        <div class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
            <div class="flex justify-between items-start mb-3">
                <h5 class="text-lg font-bold text-gray-800">${escapeHtml(task.title)}</h5>
                <span class="px-3 py-1 ${statusColor} text-white text-xs font-semibold rounded-full">${task.status}</span>
            </div>
            <p class="text-gray-600 mb-4">${escapeHtml(task.description || 'No description')}</p>
            <div class="flex gap-2">
                <button class="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700" onclick="editTask(${task.id})">Edit</button>
                <button class="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        </div>
    `;
    
    return col;
}

function openTaskModal(taskId = null) {
    currentEditingTaskId = taskId;
    const modalTitle = document.getElementById('modalTitle');
    const taskForm = document.getElementById('taskForm');
    
    if (taskId) {
        modalTitle.textContent = 'Edit Task';
        const task = taskAPI.getTaskById(taskId);
        if (task) {
            document.getElementById('taskId').value = task.id;
            document.getElementById('taskTitle').value = task.title;
            document.getElementById('taskDescription').value = task.description || '';
            document.getElementById('taskStatus').value = task.status;
        }
    } else {
        modalTitle.textContent = 'New Task';
        taskForm.reset();
        document.getElementById('taskId').value = '';
    }
}

function saveTask() {
    const currentUser = authAPI.getCurrentUser();
    if (!currentUser) return;
    
    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDescription').value.trim();
    const status = document.getElementById('taskStatus').value;
    const taskId = document.getElementById('taskId').value;
    
    if (!title) {
        alert('Please enter a task title!');
        return;
    }
    
    if (taskId) {
        // Update existing task
        taskAPI.updateTask(taskId, title, description, status);
    } else {
        // Create new task
        taskAPI.createTask(currentUser.id, title, description, status);
    }
    
    // Close modal
    Modal.hide('taskModal');
    
    // Reload tasks
    loadTasks();
}

function editTask(taskId) {
    window.location.href = `new-task.html?edit=${taskId}`;
}

function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        taskAPI.deleteTask(taskId);
        loadTasks();
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
