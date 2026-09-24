# TaskFlow Setup Guide

## Requirements

- Node.js 20+
- npm
- Docker and Docker Compose
- PostgreSQL client tools (optional for local inspection)
- Redis client tools (optional for local inspection)

## Local installation

1. Install the project dependencies:

```bash
npm install
npm run install:all
```

2. Copy the environment examples:

```bash
cp .env.example .env
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
```

3. Start the frontend:

```bash
npm run dev:frontend
```

4. Start the backend:

```bash
npm run dev:backend
```

When the backend runs directly on your machine, use this database URL in `backend/.env`:

```text
DATABASE_URL=postgresql://taskflow:taskflow@localhost:5432/taskflow
```

When the backend runs inside Docker Compose, the Compose file replaces that value with:

```text
DATABASE_URL=postgresql://taskflow:taskflow@postgres:5432/taskflow
```

The hostname is different because `localhost` means the current process's machine or container. Inside Compose, `postgres` is the service name that resolves to the PostgreSQL container.

## Infrastructure via Docker

From the project root:

```bash
cd docker
docker compose up -d
```

The Compose file is intended to bootstrap the local PostgreSQL and Redis environments required by later phases.

## Important notes

- The frontend should run on port 3000.
- The backend should run on port 4000.
- Host-run backend: PostgreSQL is reachable at `localhost:5432` and Redis at `localhost:6379`.
- Docker-run backend: PostgreSQL is reachable at `postgres:5432` and Redis at `redis:6379`.
- Never use `localhost` for a database or cache service from inside another Docker container.
