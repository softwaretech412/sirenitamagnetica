// Mock API using localStorage
// This simulates a JSON Server API without requiring Node.js

const API = {
    // Initialize data if not exists
    init: function() {
        if (!localStorage.getItem('crudtask_users')) {
            // Default admin user
            const defaultUsers = [
                {
                    id: 1,
                    name: 'Admin User',
                    email: 'admin@crudtask.com',
                    password: 'admin123',
                    role: 'admin'
                }
            ];
            localStorage.setItem('crudtask_users', JSON.stringify(defaultUsers));
        }
        
        if (!localStorage.getItem('crudtask_tasks')) {
            localStorage.setItem('crudtask_tasks', JSON.stringify([]));
        }
    },

    // Get all users
    getUsers: function() {
        const users = localStorage.getItem('crudtask_users');
        return users ? JSON.parse(users) : [];
    },

    // Get all tasks
    getTasks: function() {
        const tasks = localStorage.getItem('crudtask_tasks');
        return tasks ? JSON.parse(tasks) : [];
    },

    // Save users
    saveUsers: function(users) {
        localStorage.setItem('crudtask_users', JSON.stringify(users));
    },

    // Save tasks
    saveTasks: function(tasks) {
        localStorage.setItem('crudtask_tasks', JSON.stringify(tasks));
    }
};

// Initialize on load
API.init();
