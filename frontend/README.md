# University Management System - Frontend

A modern React frontend for the University Management System backend written in Rust.

## Features

- **Authentication**: Login/logout with email and password
- **Role-based Access**: Different dashboards for Admin, Teacher, and Student
- **User Management**: View and manage users (Admin only)
- **Course Management**: Create, view, and manage courses
- **Department Management**: Create and manage departments (Admin only)
- **Course Enrollment**: Students can enroll/unenroll in courses
- **Statistics**: Admin dashboard with system statistics
- **Modern UI**: Built with Material-UI for a professional look

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- The Rust backend running on `http://localhost:8081`

## Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The application will open in your browser at `http://localhost:3000`.

## Usage

### First Time Setup

1. Make sure the Rust backend is running on port 8081
2. Create an admin account using the backend's admin registration endpoint
3. Login with the admin credentials

### User Roles

- **Admin**: Full access to all features including user management, department management, and statistics
- **Teacher**: Can view courses and manage their own courses
- **Student**: Can view available courses and enroll/unenroll

### API Endpoints

The frontend communicates with the following backend endpoints:

- `POST /login` - User authentication
- `GET /users` - Get all users (Admin)
- `GET /students` - Get all students (Admin)
- `GET /teachers` - Get all teachers (Admin)
- `GET /courses` - Get all courses
- `POST /courses` - Create new course (Admin/Teacher)
- `GET /departments` - Get all departments (Admin)
- `POST /departments` - Create new department (Admin)
- `POST /enroll` - Enroll in course (Student)
- `DELETE /unenroll` - Unenroll from course (Student)

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── LoginForm.tsx
│   │   ├── Dashboard.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── TeacherDashboard.tsx
│   │   └── StudentDashboard.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── services/
│   │   └── api.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   └── index.tsx
├── package.json
└── tsconfig.json
```

## Technologies Used

- **React 18** - Frontend framework
- **TypeScript** - Type safety
- **Material-UI** - UI component library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Hook Form** - Form handling

## Development

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

### Environment Variables

The frontend is configured to proxy requests to `http://localhost:8081` (the Rust backend). If you need to change this, update the `proxy` field in `package.json`.

## Troubleshooting

1. **CORS Issues**: Make sure the Rust backend has CORS enabled
2. **Connection Errors**: Verify the backend is running on port 8081
3. **Authentication Issues**: Check that the user credentials are correct and the user exists in the database

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the University Management System. 
