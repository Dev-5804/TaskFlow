# Phase 2 Implementation: Frontend Foundation

## Objective

Build the complete TaskFlow frontend application shell using Next.js, TypeScript, React, and the existing frontend service. Replace the Phase 1 placeholder page with a navigable mock application that represents the main user journey without connecting to authentication, the API, PostgreSQL, Redis, or real-time events.

Phase 2 must deliver a usable frontend prototype backed entirely by local mock data.

## Required outcome

A user must be able to open the frontend and navigate through these views:

```text
Login
  -> Register
  -> Dashboard
  -> Workspace
  -> Board
```

The interface must include:

- a responsive application shell
- a top navigation bar
- a workspace/sidebar navigation area
- a dashboard with mock boards
- a board page with mock Kanban columns and tasks
- create-board UI with local mock behavior
- loading states
- empty states
- error states
- responsive behavior for desktop and mobile widths

Do not connect the UI to backend endpoints in this phase.

---

## Scope boundaries

Implement only the frontend foundation and mock interactions.

Do not implement:

- real registration or login
- JWT or cookies
- API requests
- database access
- Prisma
- Socket.IO subscriptions
- real workspace membership
- server-side task persistence
- drag-and-drop persistence
- real board creation
- real comments or activity data

Use deterministic mock data and local component state.

---

## Required route structure

Use the existing `frontend/app` App Router structure and implement these routes:

```text
frontend/app/
├── layout.tsx
├── page.tsx
├── globals.css
├── login/page.tsx
├── register/page.tsx
├── dashboard/page.tsx
├── workspace/page.tsx
└── boards/[id]/page.tsx
```

Implement `/` as the entry route. It must redirect or link the user to `/dashboard`.

Implement `/login` as a login shell with email and password fields and a submit button. The submit button must display a local loading state and then show a mock success message without making a network request.

Implement `/register` as a registration shell with name, email, password, and confirmation fields. The submit button must display a local loading state and then show a mock success message without making a network request.

Implement `/dashboard` as the primary authenticated-looking mock view. Display the workspace summary, board list, recent activity, and create-board control.

Implement `/workspace` as a workspace overview. Display the current workspace name, member summary, board summary, and navigation back to the dashboard.

Implement `/boards/[id]` as the mock Kanban board view. Read the dynamic route ID and display the matching board name from the mock board data.

---

## Required source structure

Create these frontend directories:

```text
frontend/
├── app/
├── components/
│   ├── layout/
│   ├── navigation/
│   ├── dashboard/
│   ├── board/
│   └── feedback/
├── data/
├── hooks/
├── lib/
├── types/
└── public/
```

Create these files:

- `frontend/types/mock-data.ts`
- `frontend/data/mock-data.ts`
- `frontend/lib/navigation.ts`
- `frontend/components/layout/AppShell.tsx`
- `frontend/components/navigation/TopNav.tsx`
- `frontend/components/navigation/Sidebar.tsx`
- `frontend/components/dashboard/BoardCard.tsx`
- `frontend/components/dashboard/BoardGrid.tsx`
- `frontend/components/dashboard/CreateBoardForm.tsx`
- `frontend/components/board/KanbanBoard.tsx`
- `frontend/components/board/KanbanColumn.tsx`
- `frontend/components/board/TaskCard.tsx`
- `frontend/components/feedback/LoadingState.tsx`
- `frontend/components/feedback/EmptyState.tsx`
- `frontend/components/feedback/ErrorState.tsx`

Use server components by default. Add `"use client"` only to components that need local state or browser event handlers.

---

## Mock data contract

Create TypeScript types for these objects:

```ts
 type MockUser = {
   id: string;
   name: string;
   initials: string;
   avatarColor: string;
 };

 type MockTask = {
   id: string;
   title: string;
   description: string;
   priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
   assigneeId?: string;
   dueDate?: string;
 };

 type MockColumn = {
   id: string;
   title: string;
   taskIds: string[];
 };

 type MockBoard = {
   id: string;
   name: string;
   description: string;
   color: string;
   updatedAt: string;
   columns: MockColumn[];
   tasks: Record<string, MockTask>;
 };

 type MockWorkspace = {
   id: string;
   name: string;
   description: string;
   members: MockUser[];
   boardIds: string[];
 };
```

Add at least these mock boards:

- Website Redesign
- Mobile App
- Backend Platform

Add at least three columns to each board:

- To Do
- In Progress
- Done

Add at least two tasks to each column across the mock boards.

Keep mock data in `frontend/data/mock-data.ts`. Do not duplicate board or task objects inside page components.

---

## Application shell requirements

Create `AppShell` to provide the common layout for dashboard, workspace, and board pages.

The shell must contain:

1. `TopNav` with:
   - TaskFlow brand
   - current workspace name
   - notification button
   - user menu button
2. `Sidebar` with:
   - dashboard link
   - workspace link
   - list of mock boards
   - create-board action
3. main content area

Use Next.js `Link` for internal navigation. Do not use plain anchor tags for internal routes.

The sidebar must collapse into a mobile navigation control on narrow screens. Keep navigation usable without hover-only behavior.

Use familiar icons from an installed icon library when one is already available. If no icon library exists, use accessible text labels for controls instead of adding a new icon dependency in this phase.

---

## Dashboard requirements

Build the dashboard as a scan-friendly workspace home.

Display:

- page heading: `My Boards`
- short workspace summary
- board count
- member count
- board cards in a responsive grid
- recent activity list using mock entries
- create-board form or modal

Each `BoardCard` must display:

- board name
- description
- color indicator
- task count
- last updated value
- link to `/boards/[id]`

The create-board control must:

1. open a form or inline form
2. require a board name
3. show validation when the name is empty
4. add a new board to local state
5. show the new board in the board grid
6. provide a cancel action

Do not send the new board to the backend.

---

## Kanban board requirements

Build the board view with a stable three-column layout.

Each column must display:

- column title
- task count
- task cards
- add-task control

Each task card must display:

- task title
- priority label
- assignee initials when assigned
- due date when present

Use mock data for all task content. Make the board readable on mobile by allowing horizontal scrolling or a deliberate stacked layout. Do not allow columns to overlap or cause the page to become unusable at narrow widths.

Do not implement drag-and-drop in Phase 2. The board must only display tasks and provide visual controls for future task actions.

---

## Loading, empty, and error states

Create reusable components for all three states.

### Loading state

Display a skeleton or progress placeholder while a page simulates loading mock data. Keep the delay short and deterministic. Do not create a slow or random loading experience.

### Empty state

Display a clear empty state when a board list or activity list has no items. Include the relevant action, such as `Create your first board`.

### Error state

Create a reusable error presentation with:

- clear error heading
- short explanation
- retry action

Use a local demonstration state in at least one mock page or component so the error component is reachable during development.

Do not expose stack traces or internal implementation details in the UI.

---

## Visual and accessibility requirements

Use the existing frontend styling entry point and define a consistent visual system in `frontend/app/globals.css`.

Implement:

- responsive layout for mobile, tablet, and desktop
- visible keyboard focus states
- semantic headings
- labels for every form field
- accessible button names
- sufficient color contrast
- no information conveyed by color alone
- clear hover and active navigation states
- stable dimensions for board columns and cards

Do not use placeholder lorem ipsum. Use TaskFlow-specific copy.

Do not add dark mode in Phase 2 unless it is already required by the existing application. Dark mode belongs to the later production polish phase.

---

## Implementation sequence

### Step 1: Define mock contracts and data

Create the types and mock data files before creating page-specific UI. Make all pages consume these shared mock structures.

### Step 2: Build reusable feedback components

Create loading, empty, and error components. Keep their props small and typed.

### Step 3: Build navigation and shell

Create `TopNav`, `Sidebar`, and `AppShell`. Verify internal links before adding board-specific content.

### Step 4: Build dashboard components

Create board cards, board grid, recent activity, and the local create-board form.

### Step 5: Build workspace view

Reuse `AppShell` and display mock workspace information.

### Step 6: Build board components

Create the Kanban board, columns, and task cards. Render the board selected by the dynamic route ID.

### Step 7: Implement login and registration shells

Add local form state and local loading/success/error behavior. Do not call the backend.

### Step 8: Add responsive and accessibility behavior

Test keyboard navigation, form labels, focus states, mobile layout, and horizontal board scrolling.

### Step 9: Validate the complete frontend

Run the required commands and manually visit every route listed in this document.

---

## Required validation

Run these commands from the repository root:

```bash
npm run build:frontend
npm --prefix frontend run lint
npm --prefix frontend run typecheck
```

Start the frontend:

```bash
npm run dev:frontend
```

Visit and verify:

```text
http://localhost:3000/
http://localhost:3000/login
http://localhost:3000/register
http://localhost:3000/dashboard
http://localhost:3000/workspace
http://localhost:3000/boards/website-redesign
```

Manually verify all of the following:

- every route renders without a runtime error
- every internal navigation link works
- dashboard board cards open the correct board route
- create-board validation rejects an empty name
- create-board local state displays a newly created board
- login and registration forms show local feedback
- loading, empty, and error components render correctly
- board columns remain usable on narrow screens
- keyboard focus is visible
- all form inputs have labels
- no frontend request is made to the backend

---

## Acceptance criteria

Phase 2 is complete only when all criteria pass:

- [ ] The frontend has a reusable application shell.
- [ ] The dashboard displays realistic mock boards.
- [ ] The workspace page displays realistic mock workspace data.
- [ ] The board page displays mock Kanban columns and tasks.
- [ ] Login and registration pages exist with local-only form behavior.
- [ ] Board creation works in local state.
- [ ] Loading, empty, and error states are implemented and reachable.
- [ ] The UI is responsive on desktop and mobile widths.
- [ ] Navigation works through Next.js routes.
- [ ] The frontend build passes.
- [ ] The frontend lint check passes.
- [ ] The frontend typecheck passes.
- [ ] No backend, database, authentication, or real-time feature is implemented as part of Phase 2.

## Definition of done

Phase 2 is done when a new developer can start the frontend, navigate through the full mock TaskFlow journey, inspect a realistic dashboard and Kanban board, exercise local form interactions, and confirm that the UI is ready to connect to the backend in Phase 3 and later phases.
