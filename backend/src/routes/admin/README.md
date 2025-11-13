# Admin Routes

This directory contains all admin-specific routes. All routes in this directory are protected by the `verifyAdmin` middleware which ensures:

1. User is authenticated (valid JWT token)
2. User has admin role (type === 'admin')
3. User account is active (status === 'active')

## Structure

```
admin/
├── statisticsRoutes.js    - Dashboard statistics endpoints
├── usersRoutes.js         - User management endpoints
├── jobsRoutes.js          - Job management endpoints
├── companiesRoutes.js     - Company management endpoints
├── applicationsRoutes.js  - Application management endpoints
└── reportsRoutes.js       - Reports and analytics endpoints
```

## Usage

All routes are mounted under `/api/admin` prefix.

Example:
- `/api/admin/statistics` - Get dashboard statistics
- `/api/admin/users` - Get all users
- `/api/admin/jobs/:id` - Get job details

## Authentication

All requests must include a valid JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

The token must belong to an account with `type: 'admin'` and `status: 'active'`.

## Error Responses

- `401 Unauthorized` - No token provided or account not found
- `403 Forbidden` - Invalid token, expired token, or non-admin user
- `500 Internal Server Error` - Server error
