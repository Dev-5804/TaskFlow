# Phase 5 Implementation: Workspace and RBAC

## Objective

Implement persistent workspaces, membership management, invitations for registered users, member removal, leaving a workspace, and backend-enforced roles.

All workspace permissions must be checked by the API. Do not rely on hiding buttons in the frontend.

## Roles

- `OWNER`: manage workspace, members, and boards
- `ADMIN`: manage boards and tasks; cannot manage workspace membership
- `MEMBER`: create and edit tasks and comments
- `VIEWER`: read-only access

Phase 5 implements the workspace and membership boundary. Board/task mutation permissions will be used by later CRUD routes.

## API endpoints

Mount under `/api/workspaces`:

- `POST /api/workspaces`
- `GET /api/workspaces`
- `GET /api/workspaces/:workspaceId`
- `POST /api/workspaces/:workspaceId/members`
- `PATCH /api/workspaces/:workspaceId/members/:memberUserId`
- `DELETE /api/workspaces/:workspaceId/members/:memberUserId`
- `DELETE /api/workspaces/:workspaceId/members/me`

Every endpoint requires a valid bearer access token.

## Rules

1. Creating a workspace automatically creates an `OWNER` membership for the creator.
2. Users can only list and view workspaces where they are members.
3. Only the workspace owner can invite, remove, or change member roles.
4. Invitations target registered users by email in Phase 5.
5. A user cannot be invited twice to the same workspace.
6. A workspace owner cannot leave or be removed until ownership transfer exists.
7. A member can leave a workspace through the dedicated `/members/me` endpoint.
8. The API returns `403` for insufficient role permissions.
9. The API returns `404` when a workspace or target user is not visible to the requester.
10. Never return password hashes or refresh-token data.

## Validation

Run:

```bash
npm run db:generate --prefix backend
npm run build
npm run lint
npm run typecheck
```

With the API and PostgreSQL running, validate:

- authenticated user creates a workspace
- the creator receives the `OWNER` role
- the creator lists and views the workspace
- an existing user can be invited as `MEMBER`, `ADMIN`, or `VIEWER`
- duplicate invitations return `409`
- non-owners receive `403` when managing members
- an owner can update a member role
- an owner can remove a member
- a non-owner can leave through `/members/me`
- the owner receives `409` when attempting to leave
- a non-member receives `403` or `404` when accessing the workspace

## Definition of done

Phase 5 is complete when workspace and membership operations persist in PostgreSQL, role restrictions are enforced by the backend, the workspace screen uses the API, and the validation flows pass.
