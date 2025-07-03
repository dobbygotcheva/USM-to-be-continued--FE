# University Management System

A full-stack University Management System with a Rust backend and a React frontend.

## Project Structure

```
.
├── backend/         # Rust backend (Actix-web, SQLite)
├── frontend/        # React frontend (TypeScript, MUI)
├── docs/            # Documentation (setup, quick start, etc)
├── data/            # (Optional) Database files
```

- **backend/**: All backend code, scripts, and tests
- **frontend/**: All frontend code and assets
- **docs/**: Setup and usage documentation
- **data/**: (Optional) Place for SQLite DB if you want to keep it out of version control

## Quick Start

### Backend
```sh
cd backend
cargo run
```

### Frontend
```sh
cd frontend
npm install
npm start
```

See `docs/QUICK_START.md` and `docs/SETUP.md` for full instructions.

## Features
- User authentication and role management (admin, teacher, student)
- Course, department, and user CRUD
- Enrollment, statistics, dashboards
- Modern UI with Material-UI

## License
MIT (or specify your license) 