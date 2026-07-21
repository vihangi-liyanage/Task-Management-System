# Task Management System

Full-stack task management assessment project for Koncepthive.

## Overview

This repository contains a monorepo with:

- A React + TypeScript frontend
- A Node.js + Express + TypeScript backend
- A PostgreSQL database schema and migration file

The app supports:

- Admin login and logout
- Protected dashboard access
- Task CRUD
- Search, filtering, and sorting
- Dashboard task summaries
- Responsive layouts for desktop, tablet, and mobile

## Tech Stack

- Frontend: React, TypeScript, Vite
- Backend: Node.js, Express, TypeScript
- Database: PostgreSQL
- Auth: JWT
- Validation: Zod

## Project Structure

- `frontend/` - React app
- `backend/` - Express API
- `database/` - SQL migration files

## Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the example environment file and fill in values if needed:

   ```bash
   Copy-Item .env.example .env
   ```

3. Create the PostgreSQL database and run the migration in `database/migrations/001_init.sql`.

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

The backend bootstraps the schema on startup and seeds the default admin user if it does not exist.

The migration file is also included at:

- `database/migrations/001_init.sql`

## Running the Backend

```bash
npm run dev:backend
```

The API defaults to:

- `http://localhost:3001`

## Running the Frontend

```bash
npm run dev:frontend
```

To run both together:

```bash
npm run dev
```

## Docker

Build and run the full stack with Docker Compose:

```bash
npm run docker:up
```

To stop and remove the containers and volume:

```bash
npm run docker:down
```

Docker exposes PostgreSQL on host port `5433`, the backend on `3001`, and the frontend on `3000`.

## Theme Toggle

The UI includes a light mode and dark mode toggle in the login view and dashboard header. The selected theme is saved in local storage.

The frontend defaults to:

- `http://localhost:3000`

## Default Login

- Email: `admin@test.com`
- Password: `123456`

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

Query params supported on `GET /api/tasks`:

- `search`
- `status`
- `priority`
- `sort` with `newest`, `oldest`, or `due_date`

### Dashboard

- `GET /api/dashboard/summary`

### Health

- `GET /api/health`

## Assumptions

- The project is a single-admin assessment, so registration is intentionally omitted.
- The default admin account is automatically seeded.
- JWT is used for authentication instead of sessions.
- The repository is structured as a monorepo for simpler local development.

## Known Limitations

- No pagination yet.
- No Docker setup.
- No automated test suite included.
- Refresh tokens are not implemented.

## Commit History

The repository was developed in phases:

- Initial project setup
- Authentication flow
- Task management dashboard
