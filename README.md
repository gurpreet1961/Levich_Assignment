# Authentication and Comment Permission Service

This is a Node.js backend service that provides:

- User authentication (signup, login, password reset)
- Session management with JWT access/refresh tokens
- Role-based permissions (read, write, delete)
- Comment module with permission-based access
- SQLite database for persistence

## Getting Started

1. Install dependencies:
   npm install

2. Start the server:
   node index.js

## API Overview

- /signup: Register a new user
- /login: Login and receive tokens
- /forgot-password: Initiate password reset (mocked)
- /refresh-token: Refresh access token
- /logout: Invalidate tokens
- /permissions: Assign/update user permissions
- /comments: View, add, or delete comments (based on permissions)

## Notes

- Passwords are securely hashed
- All endpoints require proper authentication/authorization
- See code for more details on each endpoint
