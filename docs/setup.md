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
- PostgreSQL should use the configured connection string from `.env`.
- Redis should be reachable at the configured Redis URL.
