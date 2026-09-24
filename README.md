# TaskFlow

TaskFlow is a real-time team collaboration platform built around shared Kanban boards.

## Phase 1 architecture

The repository separates the product into independent services:

```text
Client
	├── Next.js frontend :3000
	├── Express REST API :4000
	└── Socket.IO service :4001
					│
					├── PostgreSQL :5432
					└── Redis :6379
```

- `frontend/` contains the Next.js application shell.
- `backend/` contains the Express API and placeholder domain routes.
- `realtime/` contains the independent Socket.IO service.
- `shared/` contains shared TypeScript domain contracts.
- `docker/` contains the local infrastructure definition.
- `docs/` contains architecture and setup documentation.

PostgreSQL is the persistent source of truth. Redis is reserved for caching and real-time scaling in later phases.

## Setup

Install dependencies for every service:

```bash
npm install
npm run install:all
npm install --prefix realtime
```

Copy the environment examples before starting services:

```bash
cp .env.example .env
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
cp realtime/.env.example realtime/.env
```

Start each service in a separate terminal:

```bash
npm run dev:frontend
npm run dev:backend
npm run dev:realtime
```

Or start the local infrastructure with Docker Compose:

```bash
docker-compose -f docker/docker-compose.yml up --build
```

## Phase 1 checks

```bash
npm run build
npm run lint
docker-compose -f docker/docker-compose.yml config
```

Health endpoints:

- `http://localhost:4000/health`
- `http://localhost:4001/health`
