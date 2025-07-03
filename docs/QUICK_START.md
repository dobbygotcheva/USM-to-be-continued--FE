# Quick Start Guide - Fix Registration Issue

## The Problem
Port 8080 is being used by Apache Tomcat, but your Rust backend is configured to use port 8081.

## Solution

### Step 1: Start the Backend (Terminal 1)
```bash
# Navigate to your project directory
cd /home/admin123/Плот/University-Managment-System-main

# Add Rust to PATH
export PATH="$HOME/.cargo/bin:$PATH"

# Build and run the backend
cargo build
cargo run
```

You should see output like:
```
Running on http://127.0.0.1:8081
```

### Step 2: Start the Frontend (Terminal 2)
```bash
# Open a new terminal
cd /home/admin123/Плот/University-Managment-System-main/frontend

# Install dependencies (if not done already)
npm install

# Start the frontend
npm start
```

You should see output like:
```
Local: http://localhost:3000
```

### Step 3: Test the Backend
```bash
# In a new terminal, test if backend is working
curl http://localhost:8081/
```

You should see: `{"success":true}`

### Step 4: Create an Admin Account
1. Go to: `http://localhost:3000/admin-register`
2. Fill in:
   - Username: `admin`
   - Email: `admin@university.com`
   - Password: `password123`
   - Access Code: `I_BECOME_THY_ADMIN_AND_I_FUCK_YOUR_MOTHER32131!@#@!#@!`
3. Click "Create Admin Account"

### Step 5: Login
1. Go to: `http://localhost:3000/login`
2. Use the credentials you just created
3. You should now be logged in as an admin!

## Troubleshooting

### If cargo command not found:
```bash
export PATH="$HOME/.cargo/bin:$PATH"
```

### If port 8081 is in use:
```bash
lsof -ti:8081 | xargs kill -9
```

### If you get build errors:
```bash
cargo clean
cargo build
```

### If frontend can't connect:
- Make sure backend is running on port 8081
- Check that you see "Running on http://127.0.0.1:8081" in the backend terminal

## Port Configuration
- **Backend**: Port 8081 (changed from 8080 to avoid conflict with Tomcat)
- **Frontend**: Port 3000
- **Database**: Automatically created as `system.db` in the project directory

## Success Indicators
✅ Backend shows "Running on http://127.0.0.1:8081"  
✅ Frontend shows "Local: http://localhost:3000"  
✅ `curl http://localhost:8081/` returns `{"success":true}`  
✅ Registration form works without errors  
✅ Login works with created credentials  