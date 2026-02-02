# CRUDTASK - Quick Start Guide

## 🚀 Getting Started

1. **Open the application**: Double-click `index.html` or open it in your web browser
2. **No installation needed**: Everything runs in your browser using localStorage

## 👤 Default Login Credentials

### Admin Account
- **Email**: `admin@crudtask.com`
- **Password**: `admin123`
- **Access**: Full admin dashboard, task management, user management

### Create User Account
1. Click "Register here" on the login page
2. Fill in your details
3. You'll be automatically assigned the "user" role
4. Login with your new credentials

## 📋 Features Overview

### As a User:
- ✅ Register and login
- ✅ Create, edit, and delete your own tasks
- ✅ Change task status (Pending → In Progress → Completed)
- ✅ Filter tasks by status
- ✅ View your profile

### As an Admin:
- ✅ View dashboard with system metrics
- ✅ Manage all tasks (create, edit, delete)
- ✅ Assign tasks to any user
- ✅ View all registered users
- ✅ See total tasks, pending, in progress, and completed counts

## 🔒 Security Features

- Role-based access control
- Users cannot access admin pages
- Admins cannot access user pages
- Session persistence (stays logged in until logout)
- Automatic redirect to login if not authenticated

## 💾 Data Storage

All data is stored in your browser's localStorage:
- Users data
- Tasks data
- Current session

**Note**: Clearing browser data will reset everything. This is intentional for a local-only project.

## 🎨 UI Framework

- **Bootstrap 5** (via CDN)
- **Responsive design** - works on desktop, tablet, and mobile
- **Modern, clean interface**

## 🛠️ Technology Stack

- HTML5
- CSS3
- Bootstrap 5 (CDN)
- Vanilla JavaScript (no frameworks)
- localStorage API (no backend needed)

## 📁 Project Files

- `index.html` - Login page
- `register.html` - Registration page
- `tasks.html` - User task management
- `profile.html` - User profile
- `admin-dashboard.html` - Admin dashboard
- `admin-tasks.html` - Admin task management
- `admin-users.html` - Admin user list
- `css/style.css` - Custom styles
- `js/api.js` - Mock API (localStorage)
- `js/auth.js` - Authentication
- `js/tasks.js` - Task management
- `js/admin.js` - Admin functions

Enjoy using CRUDTASK! 🎉
