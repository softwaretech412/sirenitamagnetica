// Admin functions

function loadDashboardMetrics() {
    const tasks = taskAPI.getAllTasks();
    const users = API.getUsers().filter(u => u.role === 'user');
    
    // Calculate metrics
    const totalTasks = tasks.length;
    const pendingTasks = tasks.filter(t => t.status === 'pending').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in progress').length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    
    // Calculate overall progress
    const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // Calculate high priority pending tasks (for demo, we'll use pending tasks with no due date logic)
    const highPriorityPending = pendingTasks; // Simplified - can be enhanced with due date logic
    
    // Update dashboard
    const totalTasksEl = document.getElementById('totalTasks');
    const pendingTasksEl = document.getElementById('pendingTasks');
    const completedTasksEl = document.getElementById('completedTasks');
    const overallProgressEl = document.getElementById('overallProgress');
    const totalTasksTrendEl = document.getElementById('totalTasksTrend');
    const highPriorityCountEl = document.getElementById('highPriorityCount');
    
    if (totalTasksEl) totalTasksEl.textContent = totalTasks;
    if (pendingTasksEl) pendingTasksEl.textContent = pendingTasks;
    if (completedTasksEl) completedTasksEl.textContent = completedTasks;
    if (overallProgressEl) overallProgressEl.textContent = overallProgress + '%';
    if (totalTasksTrendEl) totalTasksTrendEl.textContent = '+12%'; // Demo value
    if (highPriorityCountEl) highPriorityCountEl.textContent = highPriorityPending + ' High Priority';
    
    // Update other elements if they exist (for old dashboard)
    const inProgressTasksEl = document.getElementById('inProgressTasks');
    const totalUsersEl = document.getElementById('totalUsers');
    if (inProgressTasksEl) inProgressTasksEl.textContent = inProgressTasks;
    if (totalUsersEl) totalUsersEl.textContent = users.length;
    
    // Load recent tasks (if element exists)
    const recentTasksEl = document.getElementById('recentTasks');
    if (recentTasksEl) {
        loadRecentTasks();
    }
}

function loadRecentTasks() {
    const tasks = taskAPI.getAllTasks();
    const recentTasks = tasks.slice(-5).reverse(); // Get last 5 tasks
    
    const recentTasksDiv = document.getElementById('recentTasks');
    
    if (recentTasks.length === 0) {
        recentTasksDiv.innerHTML = '<p class="text-gray-600">No tasks yet.</p>';
        return;
    }
    
    let html = '<div class="space-y-2">';
    recentTasks.forEach(task => {
        const user = API.getUsers().find(u => u.id === task.userId);
        const userName = user ? user.name : 'Unknown';
        
        const statusColors = {
            'pending': 'bg-yellow-500',
            'in progress': 'bg-cyan-500',
            'completed': 'bg-green-500'
        };
        
        const statusColor = statusColors[task.status] || 'bg-gray-500';
        
        html += `
            <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                    <h6 class="font-semibold text-gray-800 mb-1">${escapeHtml(task.title)}</h6>
                    <small class="text-gray-600">By: ${escapeHtml(userName)}</small>
                </div>
                <span class="px-3 py-1 ${statusColor} text-white text-xs font-semibold rounded-full">${task.status}</span>
            </div>
        `;
    });
    html += '</div>';
    
    recentTasksDiv.innerHTML = html;
}

function loadAllTasks(statusFilter = null) {
    let tasks = taskAPI.getAllTasks();
    
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
        const taskCard = createAdminTaskCard(task);
        tasksList.appendChild(taskCard);
    });
}

function createAdminTaskCard(task) {
    const col = document.createElement('div');
    
    const user = API.getUsers().find(u => u.id === task.userId);
    const userName = user ? user.name : 'Unknown';
    
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
            <p class="text-gray-600 mb-2">${escapeHtml(task.description || 'No description')}</p>
            <p class="text-sm text-gray-500 mb-4">Assigned to: ${escapeHtml(userName)}</p>
            <div class="flex gap-2">
                <button class="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700" onclick="editTask(${task.id})">Edit</button>
                <button class="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        </div>
    `;
    
    return col;
}

function loadUsersForDropdown() {
    const users = API.getUsers().filter(u => u.role === 'user');
    const select = document.getElementById('taskUserId');
    
    select.innerHTML = '<option value="">Select User</option>';
    users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id;
        option.textContent = user.name;
        select.appendChild(option);
    });
}

function loadUsers(searchTerm = '', roleFilter = 'all') {
    let users = API.getUsers();
    const tbody = document.getElementById('usersTableBody');
    
    if (!tbody) return;
    
    // Apply role filter
    if (roleFilter === 'admin') {
        users = users.filter(user => user.role === 'admin');
    } else if (roleFilter === 'user') {
        users = users.filter(user => user.role === 'user');
    }
    // If roleFilter is 'all', show all users
    
    // Apply search filter
    if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        users = users.filter(user => 
            user.name.toLowerCase().includes(searchLower) ||
            user.email.toLowerCase().includes(searchLower) ||
            user.id.toString().includes(searchTerm) ||
            (user.role && user.role.toLowerCase().includes(searchLower))
        );
    }
    
    tbody.innerHTML = '';
    
    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-8 text-center text-gray-500">No users found.</td></tr>';
        return;
    }
    
    users.forEach(user => {
        const tasks = taskAPI.getTasksByUser(user.id);
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        const roleColor = user.role === 'admin' ? 'bg-red-500' : 'bg-blue-500';
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${user.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${escapeHtml(user.name)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${escapeHtml(user.email)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span class="px-3 py-1 ${roleColor} text-white text-xs font-semibold rounded-full">${user.role}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${tasks.length}</td>
        `;
        tbody.appendChild(row);
    });
}

// Override task functions for admin
function openTaskModal(taskId = null) {
    currentEditingTaskId = taskId;
    const modalTitle = document.getElementById('modalTitle');
    const taskForm = document.getElementById('taskForm');
    
    // Load users for dropdown
    loadUsersForDropdown();
    
    if (taskId) {
        modalTitle.textContent = 'Edit Task';
        const task = taskAPI.getTaskById(taskId);
        if (task) {
            document.getElementById('taskId').value = task.id;
            document.getElementById('taskUserId').value = task.userId;
            document.getElementById('taskTitle').value = task.title;
            document.getElementById('taskDescription').value = task.description || '';
            document.getElementById('taskStatus').value = task.status;
            if (document.getElementById('taskCategory')) {
                document.getElementById('taskCategory').value = task.category || '';
            }
            if (document.getElementById('taskPriority')) {
                document.getElementById('taskPriority').value = task.priority || 'medium';
            }
        }
    } else {
        modalTitle.textContent = 'New Task';
        taskForm.reset();
        document.getElementById('taskId').value = '';
        if (document.getElementById('taskPriority')) {
            document.getElementById('taskPriority').value = 'medium';
        }
    }
}

function saveTask() {
    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDescription').value.trim();
    const status = document.getElementById('taskStatus').value;
    const userId = parseInt(document.getElementById('taskUserId').value);
    const taskId = document.getElementById('taskId').value;
    const category = document.getElementById('taskCategory')?.value || '';
    const priority = document.getElementById('taskPriority')?.value || 'medium';
    
    if (!title) {
        alert('Please enter a task title!');
        return;
    }
    
    if (!userId) {
        alert('Please select a user!');
        return;
    }
    
    if (taskId) {
        // Update existing task
        taskAPI.updateTask(taskId, title, description, status, userId, category, priority);
    } else {
        // Create new task
        taskAPI.createTask(userId, title, description, status, priority, null, category);
    }
    
    // Close modal
    Modal.hide('taskModal');
    
    // Reload tasks
    const tasksTableBody = document.getElementById('tasksTableBody');
    if (tasksTableBody) {
        const searchInput = document.getElementById('searchTasks');
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const activeFilter = document.querySelector('.filter-tab.active')?.getAttribute('data-filter') || 'all';
        
        // Check if it's admin-tasks page (has checkbox column)
        const hasCheckbox = tasksTableBody.closest('table')?.querySelector('thead tr')?.querySelector('input[type="checkbox"]');
        if (hasCheckbox) {
            loadTasksTableForAdmin(searchTerm, activeFilter);
        } else {
            loadTasksTable(searchTerm, activeFilter);
        }
    } else {
        loadAllTasks();
    }
    
    // Reload metrics if on dashboard
    if (document.getElementById('totalTasks')) {
        loadDashboardMetrics();
    }
}

function editTask(taskId) {
    // Check if we're on admin-tasks page (has modal)
    const taskModal = document.getElementById('taskModal');
    if (taskModal) {
        // Open modal for editing
        openTaskModal(taskId);
        Modal.show('taskModal');
    } else {
        // Redirect to new-task page
        window.location.href = `new-task.html?edit=${taskId}`;
    }
}

function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        taskAPI.deleteTask(taskId);
        
        // Reload based on which page we're on
        const tasksTableBody = document.getElementById('tasksTableBody');
        if (tasksTableBody) {
            const searchInput = document.getElementById('searchTasks');
            const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
            const activeFilter = document.querySelector('.filter-tab.active')?.getAttribute('data-filter') || 'all';
            
            // Check if it's admin-tasks page (has checkbox column)
            const hasCheckbox = tasksTableBody.closest('table')?.querySelector('thead tr')?.querySelector('input[type="checkbox"]');
            if (hasCheckbox) {
                loadTasksTableForAdmin(searchTerm, activeFilter);
            } else {
                loadTasksTable(searchTerm, activeFilter);
            }
        } else {
            loadAllTasks();
        }
        
        // Reload metrics if on dashboard
        if (document.getElementById('totalTasks')) {
            loadDashboardMetrics();
        }
    }
}

function loadTasksTable(searchTerm = '', filter = 'all') {
    let tasks = taskAPI.getAllTasks();
    const tbody = document.getElementById('tasksTableBody');
    
    if (!tbody) return;
    
    // Apply search filter
    if (searchTerm) {
        tasks = tasks.filter(task => {
            const searchLower = searchTerm.toLowerCase();
            const user = API.getUsers().find(u => u.id === task.userId);
            const userName = user ? user.name.toLowerCase() : '';
            return task.title.toLowerCase().includes(searchLower) ||
                   task.id.toString().includes(searchTerm) ||
                   (task.category && task.category.toLowerCase().includes(searchLower)) ||
                   (task.description && task.description.toLowerCase().includes(searchLower)) ||
                   (task.priority && task.priority.toLowerCase().includes(searchLower)) ||
                   (task.status && task.status.toLowerCase().includes(searchLower)) ||
                   userName.includes(searchLower);
        });
    }
    
    // Apply status filter
    if (filter === 'pending') {
        tasks = tasks.filter(t => t.status === 'pending');
    } else if (filter === 'completed') {
        tasks = tasks.filter(t => t.status === 'completed');
    }
    
    tbody.innerHTML = '';
    
    if (tasks.length === 0) {
        const thead = tbody.closest('table')?.querySelector('thead tr');
        const colspan = thead ? thead.children.length : 6;
        tbody.innerHTML = `<tr><td colspan="${colspan}" class="py-8 text-center text-gray-500">No tasks found.</td></tr>`;
        return;
    }
    
    tasks.forEach(task => {
        const user = API.getUsers().find(u => u.id === task.userId);
        const userName = user ? user.name : 'Unknown';
        const userInitial = userName.charAt(0).toUpperCase();
        
        // Status badge colors
        const statusColors = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'in progress': 'bg-blue-100 text-blue-800',
            'completed': 'bg-green-100 text-green-800'
        };
        const statusColor = statusColors[task.status] || 'bg-gray-100 text-gray-800';
        
        // Priority
        const priority = task.priority || 'medium';
        const priorityColors = {
            'high': 'bg-red-500',
            'medium': 'bg-yellow-500',
            'low': 'bg-green-500'
        };
        const priorityColor = priorityColors[priority] || 'bg-gray-500';
        
        // Due date
        let formattedDate = 'No date';
        if (task.dueDate) {
            const dateObj = new Date(task.dueDate);
            formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        } else if (task.createdAt) {
            const dateObj = new Date(task.createdAt);
            formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
        
        const row = document.createElement('tr');
        row.className = 'border-b hover:bg-gray-50';
        row.innerHTML = `
            <td class="py-4 px-4">
                <div class="font-medium text-gray-800">${escapeHtml(task.title)}</div>
            </td>
            <td class="py-4 px-4">
                <div class="flex items-center">
                    <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold mr-2">
                        ${userInitial}
                    </div>
                    <span class="text-gray-700">${escapeHtml(userName)}</span>
                </div>
            </td>
            <td class="py-4 px-4">
                <span class="px-3 py-1 rounded-full text-xs font-semibold ${statusColor}">${task.status}</span>
            </td>
            <td class="py-4 px-4">
                <div class="flex items-center">
                    <div class="w-2 h-2 ${priorityColor} rounded-full mr-2"></div>
                    <span class="text-gray-700 capitalize">${priority}</span>
                </div>
            </td>
            <td class="py-4 px-4">
                <span class="text-gray-700">${formattedDate}</span>
            </td>
            <td class="py-4 px-4">
                <div class="flex items-center space-x-2">
                    <button class="text-blue-600 hover:text-blue-800" onclick="editTask(${task.id})" title="Edit">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                    </button>
                    <button class="text-red-600 hover:text-red-800" onclick="deleteTask(${task.id})" title="Delete">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function loadTasksTableForAdmin(searchTerm = '', filter = 'all') {
    let tasks = taskAPI.getAllTasks();
    const tbody = document.getElementById('tasksTableBody');
    const paginationInfo = document.getElementById('paginationInfo');
    
    if (!tbody) return;
    
    // Apply search filter
    if (searchTerm) {
        tasks = tasks.filter(task => {
            const searchLower = searchTerm.toLowerCase();
            const user = API.getUsers().find(u => u.id === task.userId);
            const userName = user ? user.name.toLowerCase() : '';
            return task.title.toLowerCase().includes(searchLower) ||
                   task.id.toString().includes(searchTerm) ||
                   (task.category && task.category.toLowerCase().includes(searchLower)) ||
                   (task.description && task.description.toLowerCase().includes(searchLower)) ||
                   (task.priority && task.priority.toLowerCase().includes(searchLower)) ||
                   (task.status && task.status.toLowerCase().includes(searchLower)) ||
                   userName.includes(searchLower);
        });
    }
    
    // Apply status filter
    if (filter === 'pending') {
        tasks = tasks.filter(t => t.status === 'pending');
    } else if (filter === 'completed') {
        tasks = tasks.filter(t => t.status === 'completed');
    }
    
    tbody.innerHTML = '';
    
    if (tasks.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="py-8 text-center text-gray-500">No tasks found.</td></tr>';
        if (paginationInfo) paginationInfo.textContent = 'Showing 0 to 0 of 0 results';
        return;
    }
    
    // Show all tasks (or implement pagination if needed)
    const displayedTasks = tasks;
    const totalTasks = tasks.length;
    
    displayedTasks.forEach(task => {
        // Status badge colors
        const statusColors = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'in progress': 'bg-blue-100 text-blue-800',
            'completed': 'bg-green-100 text-green-800'
        };
        const statusColor = statusColors[task.status] || 'bg-gray-100 text-gray-800';
        
        // Priority
        const priority = task.priority || 'medium';
        const priorityColors = {
            'high': 'bg-red-500',
            'medium': 'bg-yellow-500',
            'low': 'bg-green-500'
        };
        const priorityColor = priorityColors[priority] || 'bg-gray-500';
        
        // Category
        const category = task.category || 'General';
        const categoryColors = {
            'Mathematics': 'bg-blue-100 text-blue-800',
            'Physics': 'bg-purple-100 text-purple-800',
            'History': 'bg-orange-100 text-orange-800',
            'Computer Science': 'bg-indigo-100 text-indigo-800',
            'Literature': 'bg-pink-100 text-pink-800'
        };
        const categoryColor = categoryColors[category] || 'bg-gray-100 text-gray-800';
        
        // Task ID
        const taskId = `#TASK-${task.id.toString().padStart(3, '0')}`;
        
        // Due date info
        let dueDateText = 'No date';
        if (task.dueDate) {
            const dateObj = new Date(task.dueDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const taskDate = new Date(dateObj);
            taskDate.setHours(0, 0, 0, 0);
            const diffTime = taskDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays < 0) {
                dueDateText = `Overdue ${Math.abs(diffDays)} days ago`;
            } else if (diffDays === 0) {
                dueDateText = 'Due today';
            } else if (diffDays === 1) {
                dueDateText = 'Due tomorrow';
            } else {
                dueDateText = `Due in ${diffDays} days`;
            }
        } else if (task.createdAt) {
            const dateObj = new Date(task.createdAt);
            dueDateText = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
        
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        row.innerHTML = `
            <td class="py-4 px-4">
                <input type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
            </td>
            <td class="py-4 px-4">
                <div>
                    <div class="font-semibold text-gray-800">${escapeHtml(task.title)}</div>
                    <div class="text-sm text-gray-500 mt-1">
                        <span class="text-gray-400">${taskId}</span>
                        <span class="mx-2">•</span>
                        <span>${dueDateText}</span>
                    </div>
                </div>
            </td>
            <td class="py-4 px-4">
                <span class="px-3 py-1 rounded-full text-xs font-semibold ${categoryColor}">${escapeHtml(category)}</span>
            </td>
            <td class="py-4 px-4">
                <div class="flex items-center">
                    <div class="w-2 h-2 ${priorityColor} rounded-full mr-2"></div>
                    ${priority === 'medium' ? '<span class="text-gray-700 capitalize text-sm">Medium</span>' : '<span class="text-gray-700 capitalize text-sm">' + priority + '</span>'}
                </div>
            </td>
            <td class="py-4 px-4">
                <span class="px-3 py-1 rounded-full text-xs font-semibold ${statusColor}">${task.status}</span>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    // Update pagination info
    if (paginationInfo) {
        paginationInfo.textContent = `Showing 1 to ${displayedTasks.length} of ${totalTasks} results`;
    }
}

function viewTask(taskId) {
    // Simple view - can be enhanced with a modal
    const task = taskAPI.getTaskById(taskId);
    if (task) {
        alert(`Task: ${task.title}\nDescription: ${task.description || 'No description'}\nStatus: ${task.status}`);
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
