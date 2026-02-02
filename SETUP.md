# CRUDTASK - Setup Instructions

## Quick Start

This project runs entirely in the browser using localStorage - no Node.js or npm required!

1. **Open the project**: Simply open `index.html` in your web browser
2. **Default Admin Login**:
   - Email: `admin@crudtask.com`
   - Password: `admin123`

## Project Structure

```
test-project/
├── index.html              # Login page
├── register.html           # Registration page
├── tasks.html              # User tasks page
├── profile.html            # User profile page
├── admin-dashboard.html    # Admin dashboard
├── admin-tasks.html        # Admin task management
├── admin-users.html        # Admin user management
├── css/
│   └── style.css          # Custom styles
└── js/
    ├── api.js             # Mock API using localStorage
    ├── auth.js            # Authentication functions
    ├── tasks.js           # Task management for users
    └── admin.js           # Admin functions
```

## Features

### User Features
- ✅ Register new account
- ✅ Login/Logout
- ✅ Create, edit, delete tasks
- ✅ Filter tasks by status (pending, in progress, completed)
- ✅ View profile

### Admin Features
- ✅ Dashboard with metrics
- ✅ View all tasks
- ✅ Create/edit/delete any task
- ✅ View all registered users
- ✅ Assign tasks to users

## How It Works

- **No Backend**: All data is stored in browser's localStorage
- **Mock API**: The `api.js` file simulates a JSON Server API
- **Session Management**: Uses localStorage to persist login sessions
- **Role-Based Access**: Users and admins have separate views

## Testing

1. Register a new user account
2. Login with the new account to see user features
3. Login with admin credentials to see admin features
4. Create tasks, edit them, change statuses
5. Test logout and session persistence

## Browser Compatibility

Works in all modern browsers that support:
- ES6 JavaScript
- localStorage API
- Bootstrap 5 (loaded via CDN)
