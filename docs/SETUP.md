# University Management System - Setup Guide

This guide will help you set up and run both the Rust backend and React frontend.

## Prerequisites

- **Rust** (for backend)
- **Node.js** (v14 or higher, for frontend)
- **npm** or **yarn**

## Step 1: Install Rust (if not already installed)

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source "$HOME/.cargo/env"
```

## Step 2: Start the Backend

1. **Navigate to the project directory:**
   ```bash
   cd /path/to/University-Managment-System-main
   ```

2. **Start the backend using the provided script:**
   ```bash
   ./start_backend.sh
   ```

   Or manually:
   ```bash
   cargo build
   cargo run
   ```

3. **Verify the backend is running:**
   ```bash
   curl http://localhost:8080/
   ```
   You should see: `{"success":true}`

## Step 3: Start the Frontend

1. **Open a new terminal and navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Access the application:**
   Open your browser and go to `http://localhost:3000`

## Step 4: Create Your First Account

### Option A: Create an Admin Account (Recommended)

1. Go to `http://localhost:3000/admin-register`
2. Fill in the form:
   - **Username**: `admin`
   - **Email**: `admin@university.com`
   - **Password**: `password123`
   - **Access Code**: `I_BECOME_THY_ADMIN_AND_I_FUCK_YOUR_MOTHER32131!@#@!#@!`
3. Click "Create Admin Account"

### Option B: Create a Regular User Account

1. Go to `http://localhost:3000/register`
2. Fill in the form and choose your role (Student/Teacher)
3. Click "Create Account"

## Step 5: Login and Explore

1. Go to `http://localhost:3000/login`
2. Enter your credentials
3. Explore the different dashboards based on your role

## Troubleshooting

### Backend Issues

1. **"Cargo not found" error:**
   ```bash
   export PATH="$HOME/.cargo/bin:$PATH"
   ```

2. **Build errors:**
   - Make sure you're in the correct directory
   - Check that all Rust files are present
   - Try `cargo clean` then `cargo build`

3. **Port 8080 already in use:**
   ```bash
   lsof -ti:8080 | xargs kill -9
   ```

### Frontend Issues

1. **"npm not found" error:**
   - Install Node.js from https://nodejs.org/

2. **Port 3000 already in use:**
   ```bash
   lsof -ti:3000 | xargs kill -9
   ```

3. **CORS errors:**
   - Make sure the backend is running on port 8080
   - Check that the backend has CORS enabled

### Database Issues

The database (`system.db`) is created automatically when the backend starts. If you encounter database errors:

1. Stop the backend
2. Delete the `system.db` file: `rm system.db`
3. Restart the backend

## API Endpoints

The backend provides these main endpoints:

- `POST /login` - User authentication
- `POST /register` - User registration
- `POST /admin/register` - Admin registration
- `GET /users` - Get all users (Admin)
- `GET /courses` - Get all courses
- `GET /departments` - Get all departments (Admin)
- `POST /courses` - Create course (Admin/Teacher)
- `POST /departments` - Create department (Admin)
- `POST /enroll` - Enroll in course (Student)
- `DELETE /unenroll` - Unenroll from course (Student)

## Development

### Backend Development
- Edit Rust files in the root directory
- Restart the server after changes: `cargo run`

### Frontend Development
- Edit files in the `frontend/src` directory
- Changes are automatically reloaded

## File Structure

```
University-Managment-System-main/
├── main.rs                 # Backend entry point
├── rest_api.rs            # API endpoints
├── table_models.rs        # Data models
├── sqlite_conn.rs         # Database connection
├── server_connection_impl.rs # Business logic
├── Cargo.toml             # Rust dependencies
├── start_backend.sh       # Backend startup script
├── frontend/              # React frontend
│   ├── src/
│   ├── package.json
│   └── README.md
└── SETUP.md               # This file
```

## Support

If you encounter any issues:

1. Check that both backend and frontend are running
2. Verify the ports (8080 for backend, 3000 for frontend)
3. Check the browser console for frontend errors
4. Check the terminal for backend errors
5. Ensure the database file exists and is writable 