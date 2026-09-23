# TaskFlow Architecture

## Overview

TaskFlow is a collaboration platform for Kanban-style team planning. The system is deliberately split into separate layers so each concern can evolve independently.

## Service boundaries

### Frontend

The frontend is a Next.js application responsible for rendering screens, client-side navigation, and user experience. It does not own business data storage or persistence logic.

Responsibilities:

- dashboard pages
- login and registration screens
- board UI shell
- client-side state for mock and future real data
- API calls to backend services

### Backend API

The backend API is a Node.js + Express service responsible for application logic, validation, business rules, and data orchestration.

Responsibilities:

- authentication endpoints
- workspace and board routes
- task CRUD routes
- permission enforcement
- request validation
- database access through ORM/service layers

### Real-time service

The real-time service is separate from the REST API and is built around Socket.IO. It handles board events and presence tracking.

Responsibilities:

- board rooms
- collaborative updates
- task movement broadcasts
- presence/presence updates
- member join and activity notifications

### Database

PostgreSQL is the source of truth for system data.

Responsibilities:

- users
- workspaces
- boards
- columns
- tasks
- comments
- activity events
- refresh tokens

### Cache layer

Redis is used for caching and acceleration of repeated reads and session-like data.

Responsibilities:

- board cache
- workspace cache
- role/permission cache
- performance optimization for high-read endpoints

### Shared layer

The shared layer stores contracts used across the application.

Responsibilities:

- domain types
- enums
- role definitions
- status values
- shared validation stubs

## Architecture diagram

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

## Local development flow

1. The frontend runs independently on port 3000.
2. The API runs independently on port 4000.
3. PostgreSQL stores persistent application data.
4. Redis stores cache and performance-sensitive values.
5. The real-time service connects to the same logical board events but remains separate from the API server.

## Key principle

The frontend, API server, real-time server, database, and cache are separate components with independent responsibilities.
