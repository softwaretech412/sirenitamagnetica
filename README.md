# sirenitamagnetica

PERFORMANCE TEST – MODULE 3
CRUDTASK

Designs provided in Figma:
https://www.figma.com/design/K3PmKIOlfEsjnbwP54Yc2x/Sin-t%C3%ADtulo?nodeid=33-2&t=Q7CZdp6XFatVh7wZ-1

1. Problem Statement
You are a web developer who has been tasked with developing CRUDTASK, an
application dedicated to academic task management.
The system must allow:
• Users to register, log in, and manage their tasks and profile.
• Administrators to manage tasks and supervise system activity.
Currently, there is no digital system, so a complete web application is required that
simulates the real task management flow using a fake API with JSON Server.
The visual design, screen structure, and UI components are already defined in Figma
(login, tasks, profile, admin dashboard).


2. Project Scope
The coder must build:
✓ Simulated authentication system
✓ Role management (user/admin)
✓ Consumption of fake API with JSON Server
✓ Task management
✓ Administrative panel with metrics
✓ Session persistence
✓ Clear separation between views according to role
✗ No real backend required
✗ No production deployment required (local only)
3. System Roles


Role Description
User (user) Manages their own tasks
Administrator (admin) Manages tasks and supervises activity
> Mandatory business rule:
A user with the user role CANNOT access admin views, and an admin does not use user
views.


4. Mandatory Technologies

• HTML5
• CSS3
• Bootstrap 5, materialize, foundation, bulma, Tailwind CSS
• JavaScript (Vanilla, no frameworks)
• JSON Server (fake API)
• LocalStorage or SessionStorage (session management)


5. User Module – Mandatory Functionalities
    1. Registration
        a. Create new account
        b. Role automatically assigned: user
    2. Login
        a. Validate credentials against JSON Server
        b. Save session
    3. Task Management
        a. List tasks
        b. Create tasks
        c. Edit tasks
        d. Delete tasks
    4. My Tasks
        a. View only their tasks
        b. Change status (pending, in progress, completed)
    5. User Profile
        a. View personal information
        b. Log out



6. Administrator Module – Mandatory Functionalities
    1. Login (same form)
        a. Detect admin role
        b. Redirect to dashboard
    2. Dashboard
Must display:
a. Total registered tasks
b. Pending tasks
c. Completed tasks
d. General system metrics

    3. Task Management
        a. View all tasks
        b. Edit any task
        c. Delete tasks
        d. Change statuses

    4. User Management (optional bonus)
        a. View registered users



7. Security and Logic Rules
• Routes protected by role
• If there is no session → redirect to login
• Validate that:
o User only sees their tasks
o Admin can see all
• Direct data manipulation from the browser without role validation is not allowed


8. UI Design
• Follow what is defined in Figma
• Responsive design
• Expected views according to image:
o Login
o Registration
o Task management
o User profile
o Admin dashboard
