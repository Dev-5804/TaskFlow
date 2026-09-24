# Phase 3 Implementation: Database

## Objective

Implement the PostgreSQL data model for TaskFlow with Prisma. The schema must represent users, workspaces, memberships, boards, columns, tasks, comments, activity history, and refresh tokens with explicit foreign keys, ownership relations, indexes, and deletion behavior.

This phase establishes the persistent data contract. Do not implement authentication endpoints, workspace APIs, board CRUD, task CRUD, or Redis caching in this phase.

## Required outcome

A fresh PostgreSQL database must be creatable from Prisma migrations and must contain these models:

- `User`
- `Workspace`
- `WorkspaceMember`
- `Board`
- `Column`
- `Task`
- `Comment`
- `Activity`
- `RefreshToken`

The schema must enforce relationships in the database. The frontend must not connect directly to PostgreSQL.

## Required structure

Create and maintain:

```text
backend/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   └── config/
│       └── database.js
├── package.json
└── .env.example
```

## Schema requirements

### User

Store:

- UUID primary key
- unique email
- display name
- password hash placeholder
- created and updated timestamps

Never store plaintext passwords.

### Workspace and membership

Store workspace name, description, creator, and timestamps.

Create `WorkspaceMember` as the join model between users and workspaces. Enforce one membership per user per workspace with a composite unique constraint.

Use these roles:

- `OWNER`
- `ADMIN`
- `MEMBER`
- `VIEWER`

### Board and columns

Each board belongs to one workspace and has a creator. Each column belongs to one board and stores a decimal position for stable ordering.

Delete child columns when their board is deleted.

### Tasks

Each task must store:

- title
- description
- status
- decimal position
- priority
- optional assignee
- optional due date
- creator
- timestamps

Use these statuses:

- `TODO`
- `IN_PROGRESS`
- `REVIEW`
- `DONE`

Use these priorities:

- `LOW`
- `MEDIUM`
- `HIGH`
- `URGENT`

Delete tasks when their column is deleted. Set an assignee to null when the assigned user is deleted.

### Comments and activity

Comments belong to a task and a user. Activity records belong to a board and the user who caused the activity. Store an activity type, human-readable message, optional JSON metadata, and creation time.

### Refresh tokens

Store only a token hash, never the raw refresh token. Store the owning user, expiry, revocation timestamp, and creation timestamp.

## Required indexes and constraints

Implement:

- unique user email
- unique refresh-token hash
- unique workspace/user membership pair
- unique board/column position pair
- workspace creator index
- board workspace index
- column board index
- task column and position index
- task assignee index
- comment task and creation-time index
- activity board and creation-time index
- refresh-token user and expiry index

## Implementation steps

### Step 1: Install Prisma

From the repository root, install the dependencies for the backend:

```bash
npm install --prefix backend @prisma/client@6.19.3
npm install --prefix backend --save-dev prisma@6.19.3
```

Keep the Prisma CLI and client on the same version.

### Step 2: Add database scripts

Add these backend package scripts:

- `db:generate`: generate the Prisma client
- `db:validate`: validate `prisma/schema.prisma`
- `db:format`: format the Prisma schema
- `db:migrate`: create and apply a development migration
- `db:deploy`: apply committed migrations in deployment environments
- `db:studio`: open Prisma Studio

### Step 3: Configure the database client

Create `backend/src/config/database.js` and export one shared `PrismaClient` instance. Do not instantiate a new client in every request module.

Use `DATABASE_URL` from the backend environment.

### Step 4: Create the schema

Implement the complete schema in `backend/prisma/schema.prisma`.

Use PostgreSQL as the datasource and Prisma Client as the generator. Use UUID identifiers and database-safe decimal position fields for ordered columns and tasks.

### Step 5: Create the migration

Start PostgreSQL with Docker:

```bash
docker-compose -f docker/docker-compose.yml up -d postgres
```

Create the migration from the backend directory:

```bash
npm run db:migrate --prefix backend -- --name init
```

The command must create `backend/prisma/migrations/` and apply the migration to the configured database.

### Step 6: Generate and validate the client

Run:

```bash
npm run db:format --prefix backend
npm run db:validate --prefix backend
npm run db:generate --prefix backend
```

### Step 7: Verify the database

Use Prisma Studio or PostgreSQL inspection to verify that all nine models exist and that foreign keys and indexes are present.

Do not add seed data unless it is explicitly required by a later test or development workflow.

## Required validation

Run:

```bash
npm run db:format --prefix backend
npm run db:validate --prefix backend
npm run db:generate --prefix backend
npm run build:backend
npm run lint
```

When PostgreSQL is available, also run:

```bash
npm run db:migrate --prefix backend -- --name init
npm run db:deploy --prefix backend
```

## Acceptance criteria

Phase 3 is complete only when:

- [ ] Prisma is installed in the backend.
- [ ] `schema.prisma` contains all nine required models.
- [ ] User, workspace, board, column, task, comment, activity, and token relationships are explicit.
- [ ] Roles, task statuses, and priorities are represented as enums.
- [ ] Required unique constraints and indexes exist.
- [ ] Delete behavior is explicitly configured for child records and user references.
- [ ] A Prisma migration exists under `backend/prisma/migrations/`.
- [ ] A fresh PostgreSQL database can apply the migration.
- [ ] Prisma Client generation succeeds.
- [ ] Schema validation succeeds.
- [ ] Backend build and lint checks pass.

## Non-goals

Do not implement:

- registration or login
- JWT creation
- refresh-token rotation logic
- workspace API endpoints
- board or task CRUD endpoints
- Redis integration
- frontend API requests
- production database deployment

## Definition of done

Phase 3 is done when the database structure is represented in Prisma, the migration is committed, a fresh PostgreSQL instance can apply it, and the generated client is ready for Phase 4 authentication and subsequent backend features.
