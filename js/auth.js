// Authentication API

const authAPI = {
    // Register a new user
    register: function(name, email, password) {
        const users = API.getUsers();
        
        // Check if email already exists
        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            return { success: false, message: 'Email already registered!' };
        }
        
        // Create new user
        const newUser = {
            id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
            name: name,
            email: email,
            password: password,
            role: 'user'
        };
        
        users.push(newUser);
        API.saveUsers(users);
        
        return { success: true, message: 'Registration successful!' };
    },

    // Login
    login: function(email, password) {
        const users = API.getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Store current user session (without password)
            const sessionUser = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            };
            localStorage.setItem('crudtask_currentUser', JSON.stringify(sessionUser));
            return { success: true, user: sessionUser };
        }
        
        return { success: false, message: 'Invalid email or password!' };
    },

    // Get current user
    getCurrentUser: function() {
        const user = localStorage.getItem('crudtask_currentUser');
        return user ? JSON.parse(user) : null;
    },

    // Logout
    logout: function() {
        localStorage.removeItem('crudtask_currentUser');
    }
};
