# Phase 1 Implementation: Project Foundation

## Objective

Build the project foundation for TaskFlow so the frontend, backend, database, real-time layer, and cache are separated into distinct components. This phase establishes the repository structure, architecture boundaries, environment configuration, and operational baseline before any UI, database, authentication, or real-time logic is implemented.

This phase is intentionally limited to architecture and project structure. Do not build screens, database models, auth flows, or WebSocket features in this phase.

---

## Required Outcome

The repository must clearly separate responsibilities as follows:

- Frontend: Next.js application for user interfaces and client-side interactions.
- Backend: Node.js + Express API server.
- Real-time service: Socket.IO server for board collaboration events.
- Database: PostgreSQL for persistent data.
- Cache: Redis for performance optimization and session/cache data.
- Shared layer: shared types, validation schemas, constants, and cross-cutting utilities that both frontend and backend use.
- Infrastructure: Docker and deployment configuration.
- Documentation: architecture and operational docs for contributors.

By the end of this phase, a developer should be able to state: "The frontend, API server, real-time server, database and cache are separate components."

---

## Required Repository Structure

Create the following top-level structure in the project root:

```text
project-root/
├── frontend/
├── backend/
├── shared/
├── docker/
├── docs/
├── .gitignore
├── README.md
├── package.json
├── .env.example
├── .eslintrc.js or eslint.config.mjs
├── tsconfig.base.json
├── .prettierrc
└── .github/
    └── workflows/
```

### Directory responsibilities

#### frontend/
Create a dedicated Next.js app folder for user-facing experience.

Required contents:

- `app/` or `src/app/` for Next.js pages and layout
- `components/` for shared UI components
- `hooks/` for client-side hooks
- `lib/` for frontend utilities
- `types/` for UI-specific types
- `public/` for static assets
- `package.json`
- `tsconfig.json`
- `next.config.ts` or equivalent
- `.env.example`

The frontend must include placeholder routes for:

- `/login`
- `/register`
- `/dashboard`
- `/boards/:id`
- `/workspace`

At this stage, these routes can exist as shell pages with placeholder content only. Do not implement business logic.

#### backend/
Create a dedicated Node.js + Express backend application.

Required contents:

- `src/`
- `src/server.ts` or `src/index.ts`
- `src/app.ts`
- `src/routes/`
- `src/controllers/` or `src/services/`
- `src/config/`
- `src/middleware/`
- `src/utils/`
- `src/types/`
- `package.json`
- `tsconfig.json`
- `.env.example`

The backend must expose a simple health endpoint such as:

- `GET /health`

The backend must also contain a placeholder route structure for future phases:

- `/auth`
- `/workspaces`
- `/boards`
- `/tasks`
- `/comments`

Do not implement logic for registration, login, RBAC, or real-time events yet.

#### shared/
Create a shared package or folder for cross-cutting code.

Required contents:

- `types/`
- `constants/`
- `schemas/`
- `utils/`
- `index.ts`

Examples of shared content:

- role enum definitions: `OWNER`, `ADMIN`, `MEMBER`, `VIEWER`
- task status names: `TODO`, `IN_PROGRESS`, `REVIEW`, `DONE`
- common error payload shapes
- validation schema stubs for future Zod integration
- common TypeScript interfaces such as `User`, `Workspace`, `Board`, `Task`

This folder exists so both the frontend and backend can rely on the same contract without duplication.

#### docker/
Create a dedicated Docker configuration area.

Required contents:

- `docker-compose.yml`
- `postgres/init.sql` or equivalent seed scripts
- `redis/` if needed
- `nginx/` if needed for deployment prep

The Docker setup at this phase must be structural only. It should define the infrastructure stack conceptually, including:

- Next.js frontend container
- Node.js API container
- PostgreSQL container
- Redis container

Do not configure production deployment yet; this is a local infrastructure scaffold only.

#### docs/
Create a documentation folder.

Required contents:

- `architecture.md`
- `setup.md`
- `environment.md`
- `api-contracts.md` or placeholder docs

This folder must explain the system architecture, service boundaries, and local development workflow.

---

## Mandatory Architecture Rules

Implement the following rules exactly:

1. Create separate frontend and backend projects instead of mixing the UI and API in one app.
2. Keep the real-time server separate from the REST API server.
3. Treat PostgreSQL as the canonical data store.
4. Treat Redis as a cache layer and not as the source of truth.
5. Treat the `shared` package as the contract layer for domain model and validation types.
6. Keep infrastructure configuration in the `docker/` directory.
7. Keep operational and architecture docs in `docs/`.

Do not use the database layer in the frontend.
Do not merge all code into a single `app/` folder with backend logic embedded inside it.
Do not add Redis or WebSocket logic before the architecture boundary is established.

---

## Implementation Steps

### Step 1: Create the repo structure

Create the directories listed above.

Create these files immediately:

- `/README.md`
- `/package.json`
- `/.env.example`
- `/tsconfig.base.json`
- `/frontend/package.json`
- `/backend/package.json`
- `/shared/package.json` or equivalent module structure
- `/docs/architecture.md`
- `/docs/setup.md`
- `/docker/docker-compose.yml`

### Step 2: Define the root package configuration

Set the root `package.json` to include scripts for:

- `install:all`
- `dev:frontend`
- `dev:backend`
- `lint`
- `typecheck`
- `format`

Use root-level scripts only as orchestrators. Do not put real application logic in the root package.

### Step 3: Configure the frontend workspace

Create the frontend package with a Next.js app shell.

Add the following base scripts:

- `dev`
- `build`
- `start`
- `lint`

Add a minimal `app/page.tsx` placeholder that renders a simple project welcome page.

Add a minimal `layout.tsx` with the app shell.

Add a `globals.css` file with base styling only.

The frontend must compile without errors, even if it only displays placeholder text.

### Step 4: Configure the backend workspace

Create the backend package with Node.js + Express.

Add the following base scripts:

- `dev`
- `build`
- `start`
- `lint`

Create a base server entry point.

Add a `GET /health` route that returns:

```json
{
  "status": "ok",
  "service": "taskflow-api"
}
```

This endpoint proves the server is running and separated from the frontend.

### Step 5: Configure the shared contract layer

Create the `shared` folder with exported types and constants.

Add at least the following domain contracts:

- `User`
- `Workspace`
- `WorkspaceMember`
- `Board`
- `Column`
- `Task`
- `Comment`
- `Activity`
- `RefreshToken`

Add at least the following enums/constants:

- `WorkspaceRole` with `OWNER`, `ADMIN`, `MEMBER`, `VIEWER`
- `TaskStatus` with `TODO`, `IN_PROGRESS`, `REVIEW`, `DONE`
- `Priority` with values to be defined later

Do not add business logic. Only model definitions and reusable constants.

### Step 6: Define infrastructure placeholders

Create a Docker Compose file that describes the local stack:

- PostgreSQL service
- Redis service
- Backend API service
- Frontend service

Use placeholder environment variables such as:

- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `REDIS_URL`
- `NEXT_PUBLIC_API_URL`
- `API_PORT`

This is not a production deployment file. It is a local developer bootstrap file.

### Step 7: Write the architecture documentation

Update `docs/architecture.md` with the following sections:

- System overview
- Service boundaries
- Frontend responsibilities
- Backend responsibilities
- Real-time responsibilities
- Database responsibilities
- Cache responsibilities
- Shared contract responsibilities
- Local development flow

Document the exact architecture in plain language. Include a diagram like this:

```text
Client
  │
  ├── Next.js Frontend
  │
  ├── REST API
  │
  └── WebSocket
          │
          ▼
     Backend Services
        /      \
       /        \
      ▼          ▼
 PostgreSQL    Redis
```

### Step 8: Define environment variables

Create `.env.example` at the root and in the frontend and backend packages.

Required root environment variables:

- `NODE_ENV`
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `DATABASE_URL`
- `REDIS_URL`

Required frontend environment variables:

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_WS_URL`

Required backend environment variables:

- `PORT`
- `JWT_SECRET`
- `DATABASE_URL`
- `REDIS_URL`
- `CORS_ORIGIN`

These variables are placeholders for future phases. They must be documented and usable by the local environment.

### Step 9: Establish baseline validation

Run the project checks to confirm the empty foundation is stable.

Required validation before moving to Phase 2:

- Frontend app boots with placeholder page
- Backend server responds on `/health`
- TypeScript and lint checks run without errors for the base files
- Docker compose file parses without invalid syntax
- Documentation clearly describes the architecture

Do not proceed to Phase 2 until the foundation is passing.

---

## Explicit Non-Goals for This Phase

This phase must not include:

- user registration or login
- database schema creation
- Prisma setup
- JWT implementation
- workspace invites
- real-time collaboration
- board drag-and-drop
- Redis caching logic
- unit/integration tests for domain features
- AWS or cloud deployment

This phase is only for architecture, separation of concerns, and environment setup.

---

## Acceptance Criteria

The phase is complete only when all of the following are true:

- [ ] The repository has a clear `frontend` and `backend` separation.
- [ ] The `shared` layer exists and contains common domain contracts.
- [ ] The `docker` folder contains local infrastructure definitions.
- [ ] The `docs` folder contains architecture and setup guides.
- [ ] The frontend boots as a standalone Next.js app shell.
- [ ] The backend boots and returns a valid `/health` response.
- [ ] The architecture document states that the frontend, API server, real-time server, database, and cache are separate components.
- [ ] The environment variables are documented in `.env.example` files.
- [ ] No feature implementation beyond infrastructure and architecture foundation is included.

---

## Definition of Done

Phase 1 is done when the codebase is a clean architectural foundation for TaskFlow and the rest of the PRD can be implemented in a structured order without mixing concerns.

The implementation must be ready for Phase 2: Frontend foundation and mock UI work.
