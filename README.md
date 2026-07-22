# Task Management System

Full-stack task management assessment project for Koncepthive.

## Project Overview

This is a monorepo task management system with:

- A React frontend
- A Node.js + Express backend
- A PostgreSQL database

It supports:

- Admin login and logout
- Protected dashboard access
- Task CRUD
- Search, filtering, and sorting
- Dashboard task summaries
- Light mode and dark mode
- Responsive layouts for desktop, tablet, and mobile

## Technology Stack

- Frontend: React, TypeScript, Vite
- Backend: Node.js, Express, TypeScript
- Database: PostgreSQL
- Authentication: JWT
- Validation: Zod
- Styling: Plain CSS with theme variables and motion effects
- Containerization: Docker, Docker Compose

## Interview File Guide

Use this section to explain the most important files during your interview:

- [frontend/src/App.tsx](frontend/src/App.tsx) - Root frontend controller for login, session handling, and theme switching.
- [frontend/src/components/DashboardScreen.tsx](frontend/src/components/DashboardScreen.tsx) - Protected dashboard page with task loading, filters, summary cards, and CRUD actions.
- [frontend/src/components/TaskForm.tsx](frontend/src/components/TaskForm.tsx) - Create/edit task form with validation display.
- [frontend/src/components/TaskList.tsx](frontend/src/components/TaskList.tsx) - Task table/list view with edit and delete actions.
- [frontend/src/lib/api.ts](frontend/src/lib/api.ts) - Frontend API client for auth, tasks, and dashboard calls.
- [frontend/src/styles.css](frontend/src/styles.css) - Theme system, layout, responsive design, and animations.
- [backend/src/app.ts](backend/src/app.ts) - Express app setup, middleware, and route registration.
- [backend/src/server.ts](backend/src/server.ts) - Backend entry point that starts the server and bootstraps the database.
- [backend/src/config/env.ts](backend/src/config/env.ts) - Environment variable validation and defaults.
- [backend/src/routes/auth.ts](backend/src/routes/auth.ts) - Login, logout, and current-user endpoints.
- [backend/src/routes/tasks.ts](backend/src/routes/tasks.ts) - Task CRUD endpoints with search, filters, and sorting.
- [backend/src/routes/dashboard.ts](backend/src/routes/dashboard.ts) - Dashboard summary endpoint.
- [backend/src/db/bootstrap.ts](backend/src/db/bootstrap.ts) - Creates tables and seeds the default admin user.
- [database/migrations/001_init.sql](database/migrations/001_init.sql) - SQL migration for the schema.

## Installation Instructions

1. Install dependencies:

   ```powershell
   npm install
   ```

2. Copy the example environment file:

   ```powershell
   Copy-Item .env.example .env
   ```

3. Confirm your `.env` values if needed:

   - `DATABASE_URL`
   - `JWT_SECRET`
   - `PORT`
   - `FRONTEND_URL`
   - `VITE_API_URL`

## Environment Variables

Root `.env.example` contains:

- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `PORT`
- `FRONTEND_URL`
- `VITE_API_URL`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

## Database Setup

The app uses PostgreSQL. You can run it either:

- locally with your own PostgreSQL instance, or
- through Docker Compose

The backend also bootstraps the schema on startup and seeds the default admin user.

Migration file:

- [database/migrations/001_init.sql](database/migrations/001_init.sql)

## Running the Backend

From the repo root:

```powershell
npm run dev:backend
```

Backend URL:

- `http://localhost:3001`

Health check:

- `http://localhost:3001/api/health`

## Running the Frontend

From the repo root:

```powershell
npm run dev:frontend
```

Frontend URL:

- `http://localhost:3000`

## API Documentation

### Auth

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Tasks

- `GET /api/tasks`
- `GET /api/tasks/:id`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

Query parameters for `GET /api/tasks`:

- `search`
- `status`
- `priority`
- `sort` with `newest`, `oldest`, or `due_date`

### Dashboard

- `GET /api/dashboard/summary`

### Health

- `GET /api/health`

## Assumptions Made

- The assessment uses a single default admin account, so registration is not included.
- JWT is used for authentication because it is the preferred option in the brief.
- The project is organized as a monorepo to keep frontend and backend together.
- Tasks belong to the authenticated user.
- The default admin account is seeded automatically on backend startup.

## Known Limitations

- No pagination yet.
- No refresh token flow.
- No automated test suite yet.
- Docker PostgreSQL is mapped to host port `5433` to avoid local port conflicts.

## Docker Commands

```powershell
npm run docker:up
npm run docker:down
```

Docker URLs:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001`
- PostgreSQL: `localhost:5433`




