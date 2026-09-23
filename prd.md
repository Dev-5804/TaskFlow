# PRD — TaskFlow

**Goal:** Build and deploy a production-style, real-time team collaboration platform similar to a simplified Trello, where multiple users can work on shared Kanban boards simultaneously.

**Primary objective:** The finished project should demonstrate frontend, backend, database design, real-time systems, authentication/security, caching, testing, Docker, CI/CD, and cloud deployment.

---

# 0. Final Product

The final application should allow users to:

```text
Register / Login
       ↓
Create or join a workspace
       ↓
Create Kanban boards
       ↓
Invite team members
       ↓
Create / edit / delete tasks
       ↓
Move tasks between columns
       ↓
Collaborate in real time
       ↓
See who is online
       ↓
Receive activity updates
```

Example:

```text
┌──────────────────────────────────────────────────────────────┐
│ TaskFlow                                  Dev ●  Rahul ●     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ TODO             IN PROGRESS          DONE                   │
│ ─────────────    ───────────────      ───────────────        │
│ Fix navbar       Build dashboard      Setup database         │
│ Add tests        API authentication   Login page             │
│ Mobile UI                                                     │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

If Dev moves **"Fix navbar"** to `IN PROGRESS`, Rahul's screen should update automatically.

---

# Technology Stack

We'll use:

```text
Frontend
├── Next.js
├── TypeScript
├── Tailwind CSS
└── React

Backend
├── Node.js
├── Express
├── Socket.IO
└── Zod

Database
├── PostgreSQL
├── Prisma ORM
└── Redis

Authentication
├── JWT
├── Access tokens
└── Refresh-token rotation

Testing
├── Jest
├── Playwright
└── k6

Infrastructure
├── Docker
├── GitHub Actions
├── Nginx
└── AWS / free-tier hosting
```

---

# Phase 1 — Project Foundation

### Step 1 — Define architecture

Decide the separation between:

```text
taskflow/
├── frontend/
├── backend/
├── shared/
├── docker/
└── docs/
```

Frontend:

```text
Next.js
```

Backend:

```text
Node.js + Express + Socket.IO
```

Database:

```text
PostgreSQL
```

Cache:

```text
Redis
```

### Final goal

You should be able to explain:

> "The frontend, API server, real-time server, database and cache are separate components."

---

# Phase 2 — Frontend Foundation

### Step 2 — Build application shell

Create:

* Login page
* Register page
* Dashboard
* Board page
* Navbar
* Sidebar
* Loading states
* Error states

At this stage, don't worry about real authentication or database functionality.

Use mock data.

Example:

```text
Dashboard
│
├── My Boards
│   ├── Website
│   ├── Mobile App
│   └── Backend
│
└── Create Board
```

### Final goal

You can navigate through the entire application using realistic mock data.

---

# Phase 3 — Database

### Step 3 — Design PostgreSQL schema

Start with:

```text
User
Workspace
WorkspaceMember
Board
Column
Task
Comment
Activity
RefreshToken
```

Relationships:

```text
User
 │
 ├── WorkspaceMember
 │       │
 │       └── Workspace
 │              │
 │              └── Board
 │                    │
 │                    ├── Column
 │                    │     └── Task
 │                    │            └── Comment
 │                    │
 │                    └── Activity
```

Use Prisma to manage the schema and migrations.

### Final goal

A fresh database can be created with migrations and contains the complete relational model.

---

# Phase 4 — Authentication

### Step 4 — Implement registration/login

Build:

```text
POST /auth/register
POST /auth/login
POST /auth/refresh
POST /auth/logout
GET  /auth/me
```

Passwords should be hashed.

Authentication flow:

```text
Login
  ↓
Validate credentials
  ↓
Access Token + Refresh Token
  ↓
Frontend
  ↓
API requests
```

Implement refresh-token rotation.

### Final goal

A user can:

```text
Register
   ↓
Login
   ↓
Stay authenticated
   ↓
Refresh expired access token
   ↓
Logout
```

---

# Phase 5 — Workspace & RBAC

### Step 5 — Build workspace system

Users should be able to:

* Create workspace
* View workspace
* Invite members
* Remove members
* Leave workspace

Introduce roles:

```text
OWNER
ADMIN
MEMBER
VIEWER
```

Example:

```text
OWNER
 ├── Manage workspace
 ├── Manage members
 └── Manage boards

ADMIN
 ├── Manage boards
 └── Manage tasks

MEMBER
 ├── Create tasks
 ├── Edit tasks
 └── Comment

VIEWER
 └── Read-only
```

### Final goal

Permissions are enforced by the **backend**, not merely hidden in the UI.

---

# Phase 6 — Kanban Board

### Step 6 — Build CRUD functionality

Implement:

```text
Create board
Edit board
Delete board

Create column
Edit column
Delete column

Create task
Edit task
Delete task
```

Task fields:

```text
id
title
description
status
position
priority
assignee
dueDate
createdBy
createdAt
updatedAt
```

### Final goal

The application works as a normal single-user Kanban application.

At this point:

**No real-time functionality yet.**

That is intentional.

---

# Phase 7 — Drag & Drop

### Step 7 — Implement task movement

Users should be able to:

```text
TODO
 ↓
IN PROGRESS
 ↓
REVIEW
 ↓
DONE
```

Tasks need a `position` value so their order can be persisted.

Example:

```text
Task A → position 1000
Task B → position 2000
Task C → position 3000
```

Moving B above A could result in:

```text
Task B → 500
Task A → 1000
Task C → 3000
```

This avoids constantly renumbering every task.

### Final goal

Dragging a task changes its position and persists the change in PostgreSQL.

---

# Phase 8 — Real-Time Collaboration

This is the **core feature of TaskFlow**.

### Step 8 — Add Socket.IO

When a user opens a board:

```text
Client
  │
  │ connect
  ▼
Socket.IO server
  │
  │ join board room
  ▼
board:123
```

When a task changes:

```text
User A
  │
  │ Move task
  ▼
API
  │
  ├── PostgreSQL
  │
  └── Socket.IO
          │
          ▼
       board:123
       ┌──────┴──────┐
       ▼             ▼
    User B         User C
```

Events could include:

```text
task.created
task.updated
task.deleted
task.moved
column.created
comment.created
member.joined
```

### Final goal

Open the same board in two browsers.

When Browser A changes a task:

**Browser B updates without refreshing.**

This is the key milestone of the project.

---

# Phase 9 — Presence

### Step 9 — Show online users

When someone opens a board:

```text
Dev ●
Rahul ●
Amit ○
```

Use Socket.IO to track connected users.

You can also show:

```text
Dev is viewing this board
```

### Final goal

Users can see which teammates are currently connected to the board.

---

# Phase 10 — Comments & Activity

### Step 10 — Add collaboration history

Users can comment on tasks:

```text
Dev:
"API is ready for testing."

Rahul:
"I'll test it tonight."
```

Create an activity timeline:

```text
Dev moved "Login API"
TODO → IN PROGRESS

Rahul assigned "Dashboard UI"
to Dev

Amit commented on "Login API"
```

### Final goal

The board becomes a collaboration tool rather than just a task manager.

---

# Phase 11 — Redis

### Step 11 — Introduce caching

First measure your API.

For example:

```text
GET /boards/:id
```

Initially:

```text
Request
   ↓
PostgreSQL
```

Then:

```text
Request
   ↓
Redis
   │
   ├── HIT → return cached data
   │
   └── MISS
        ↓
    PostgreSQL
        ↓
      Redis
```

Cache things such as:

```text
Board data
Workspace data
User permissions
```

Use cache invalidation when relevant data changes.

### Final goal

Demonstrate a measurable performance improvement rather than simply saying "Redis is implemented."

For example:

```text
Before Redis:  ~400 ms p95
After Redis:   ~150 ms p95
```

The actual numbers should come from your measurements.

---

# Phase 12 — Security

### Step 12 — Harden the application

Implement:

* Input validation with Zod
* Password hashing
* JWT security
* Refresh-token rotation
* RBAC
* Rate limiting
* CORS configuration
* Secure HTTP headers
* SQL injection protection through ORM/parameterized queries
* XSS-safe rendering
* Request validation
* Error handling

Test cases such as:

```text
Can MEMBER delete a board?
Can VIEWER create a task?
Can User A access User B's workspace?
What happens with an expired token?
What happens after refresh-token reuse?
```

### Final goal

Unauthorized requests are rejected by the backend consistently.

---

# Phase 13 — Testing

### Step 13 — Unit & integration tests

Use Jest.

Test:

```text
Authentication
Authorization
Task creation
Task movement
Board permissions
Cache behavior
Token refresh
```

Target something like:

```text
80%+
```

but prioritize important code paths over the percentage itself.

### Final goal

Critical backend functionality has automated tests.

---

# Phase 14 — End-to-End Testing

### Step 14 — Playwright

Create realistic flows:

```text
Register
 ↓
Login
 ↓
Create workspace
 ↓
Create board
 ↓
Create task
 ↓
Move task
 ↓
Logout
```

Most importantly, test real-time behavior:

```text
Browser A
   ↓
Move task

Browser B
   ↓
Verify task moved
```

### Final goal

The major user journeys can run automatically from the browser.

---

# Phase 15 — Docker

### Step 15 — Containerize the application

Create:

```text
Dockerfile
docker-compose.yml
```

Development environment:

```text
┌───────────────────────┐
│ Next.js               │
├───────────────────────┤
│ Node.js + Socket.IO   │
├───────────────────────┤
│ PostgreSQL            │
├───────────────────────┤
│ Redis                 │
└───────────────────────┘
```

### Final goal

A new developer can clone the repository and start the core infrastructure with one command.

---

# Phase 16 — CI/CD

### Step 16 — GitHub Actions

Every pull request should run:

```text
Push code
   ↓
GitHub Actions
   ↓
Install dependencies
   ↓
Lint
   ↓
Type check
   ↓
Unit tests
   ↓
Build
```

Later:

```text
main branch
    ↓
Build Docker image
    ↓
Deploy
```

### Final goal

Bad code doesn't reach production automatically, and production deployments don't require manual copying of files.

---

# Phase 17 — Free Deployment

### Step 17 — Deploy the application

Initially use free-tier services where available.

Architecture:

```text
                   Internet
                       │
                       ▼
                  Next.js host
                       │
                       ▼
                  Node.js API
                  + Socket.IO
                    /     \
                   /       \
                  ▼         ▼
             PostgreSQL    Redis
```

Deploy:

```text
Frontend
Backend
Database
Redis
```

Configure:

```text
Environment variables
HTTPS
CORS
JWT secrets
Database connection
Redis connection
```

### Final goal

Anyone with the production URL can register and use TaskFlow.

---

# Phase 18 — Load Testing

### Step 18 — k6

Simulate:

```text
10 users
50 users
100 users
250 users
500 users
```

Measure:

```text
Requests/sec
p50 latency
p95 latency
p99 latency
Error rate
WebSocket connections
```

Find bottlenecks.

For example:

```text
500 concurrent users
        ↓
API okay
        ↓
PostgreSQL overloaded
        ↓
Optimize query/index/cache
```

### Final goal

You have actual performance measurements and can explain what bottlenecks you found and how you addressed them.

---

# Phase 19 — Production Polish

### Step 19 — Improve the actual product

Add:

* Responsive design
* Empty states
* Loading skeletons
* Error handling
* Toast notifications
* Search tasks
* Filter by assignee/status/priority
* Dark mode
* Board activity
* User profile
* Basic accessibility
* 404/500 pages

Don't keep adding features indefinitely.

### Final goal

The application feels like a complete product rather than a technical demo.

---

# Phase 20 — Documentation

### Step 20 — Create the GitHub README

Your README should contain:

```text
TaskFlow
Real-Time Team Collaboration Platform

Features
Architecture
Tech Stack
Database Schema
API Documentation
WebSocket Events
Security
Performance
Testing
Deployment
Screenshots
Demo
```

Include architecture diagrams such as:

```text
Client
  │
  ├── REST API ────────┐
  │                    │
  └── WebSocket ───────┤
                       ▼
                    Backend
                    /      \
                   ▼        ▼
              PostgreSQL   Redis
```

Also document actual performance results:

```text
API p95
Before caching: X ms
After caching:  Y ms

Load test:
Concurrent users: X
Requests/sec: Y
Error rate: Z%
```

### Final goal

A recruiter/interviewer can understand the project without opening the source code.

---

# Recommended Build Order

Don't try to build everything simultaneously.

Follow this exact progression:

```text
1. Project setup
       ↓
2. Frontend UI
       ↓
3. Database
       ↓
4. Authentication
       ↓
5. Workspace + RBAC
       ↓
6. Kanban CRUD
       ↓
7. Drag & Drop
       ↓
8. WebSockets          ← Core milestone
       ↓
9. Presence
       ↓
10. Comments/activity
       ↓
11. Redis              ← Performance milestone
       ↓
12. Security hardening
       ↓
13. Jest tests
       ↓
14. Playwright
       ↓
15. Docker
       ↓
16. CI/CD
       ↓
17. Deployment
       ↓
18. k6 load testing
       ↓
19. Polish
       ↓
20. Documentation
```

## Milestones

You can divide the project into these larger checkpoints:

| Milestone | Final state                           |
| --------- | ------------------------------------- |
| **M1**    | UI works with mock data               |
| **M2**    | Database + API work                   |
| **M3**    | Authentication + RBAC work            |
| **M4**    | Normal Kanban application works       |
| **M5**    | **Real-time collaboration works**     |
| **M6**    | Redis/performance optimization works  |
| **M7**    | Security + automated testing complete |
| **M8**    | Docker + CI/CD complete               |
| **M9**    | Application deployed                  |
| **M10**   | Load-tested + documented              |

### The most important rule

Don't start with Redis, Docker, AWS, WebSockets, authentication, and everything else at once.

Build the simplest version first:

```text
User → Board → Task → PostgreSQL
```

Then progressively introduce the engineering complexity:

```text
                    ┌── Authentication
                    ├── RBAC
                    ├── WebSockets
                    ├── Redis
                    ├── Testing
                    ├── Docker
                    └── Deployment
```

That way, every new technology solves a specific problem in an already-working application.
