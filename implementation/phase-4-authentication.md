# Phase 4 Implementation: Authentication

## Objective

Implement secure registration, login, access-token verification, refresh-token rotation, logout, and current-user lookup for TaskFlow.

Use the existing Prisma `User` and `RefreshToken` models. Do not store plaintext passwords or raw refresh tokens in PostgreSQL.

## Required endpoints

Mount all endpoints under `/api/auth`:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me`

## Security requirements

1. Hash passwords with bcrypt using a cost factor of at least 12.
2. Sign access tokens with `JWT_SECRET`.
3. Set access tokens to expire after 15 minutes.
4. Generate cryptographically random refresh tokens.
5. Store only SHA-256 refresh-token hashes in `RefreshToken.tokenHash`.
6. Set refresh tokens in an HTTP-only cookie named `taskflow_refresh_token`.
7. Set the refresh cookie path to `/api/auth`.
8. Rotate the refresh token on every successful refresh request.
9. Revoke the old refresh-token record during rotation.
10. Reject expired, revoked, unknown, and reused refresh tokens.
11. Return generic login failure messages so the endpoint does not reveal whether an email exists.
12. Validate request bodies with Zod before database access.
13. Require `Authorization: Bearer <access-token>` for `/api/auth/me`.
14. Reject missing or invalid `JWT_SECRET` values in token creation.

## Implementation structure

Create:

```text
backend/src/
├── middleware/require-auth.js
├── routes/auth.js
├── schemas/auth.js
├── utils/auth.js
└── config/database.js
```

Keep route handlers responsible for HTTP input/output and keep password/token primitives in `utils/auth.js`.

## Endpoint behavior

### Register

Input:

```json
{
  "name": "Devendra Shah",
  "email": "devendra@example.com",
  "password": "a-secure-password"
}
```

Behavior:

1. Validate the body.
2. Normalize the email to lowercase.
3. Reject an existing email with status `409`.
4. Hash the password.
5. Create the user.
6. Create a hashed refresh-token record.
7. Set the HTTP-only refresh cookie.
8. Return status `201` with the user profile and access token.

Never return `passwordHash`.

### Login

Behavior:

1. Validate the body.
2. Find the user by normalized email.
3. Compare the supplied password with the stored hash.
4. Return `401` with a generic message when credentials are invalid.
5. Create a refresh-token record and set the refresh cookie.
6. Return the user profile and access token.

### Refresh

Behavior:

1. Read the refresh token from the HTTP-only cookie.
2. Hash the raw token.
3. Find an unrevoked token record.
4. Reject missing, revoked, or expired tokens with status `401`.
5. Revoke the old token.
6. Create and store a new hashed refresh token.
7. Set the replacement cookie.
8. Return a new access token.

Perform revocation and replacement creation in one Prisma transaction.

### Logout

Behavior:

1. Read the refresh cookie.
2. Revoke the matching token when it exists.
3. Clear the refresh cookie regardless of whether a token was present.
4. Return status `204`.

### Current user

Behavior:

1. Require a valid access token.
2. Load the user by the token subject.
3. Return the public user profile.
4. Return `404` if the user no longer exists.

## Environment variables

Require these backend values:

```env
JWT_SECRET=use-a-long-random-secret
DATABASE_URL=postgresql://taskflow:taskflow@localhost:5432/taskflow
CORS_ORIGIN=http://localhost:3000
```

Never commit a real `.env` file or a real JWT secret.

## Validation

Run:

```bash
npm run db:generate --prefix backend
npm run build:backend
npm run lint
```

Start the API:

```bash
npm run dev:backend
```

Test the endpoint sequence with a cookie jar:

```bash
curl -i -c /tmp/taskflow-cookies.txt \
  -H 'Content-Type: application/json' \
  -d '{"name":"Devendra Shah","email":"devendra@example.com","password":"a-secure-password"}' \
  http://localhost:4000/api/auth/register
```

Extract the access token from the response and call:

```bash
curl -i \
  -H 'Authorization: Bearer <access-token>' \
  http://localhost:4000/api/auth/me
```

Refresh with the cookie jar:

```bash
curl -i -b /tmp/taskflow-cookies.txt -c /tmp/taskflow-cookies.txt \
  -X POST http://localhost:4000/api/auth/refresh
```

Logout:

```bash
curl -i -b /tmp/taskflow-cookies.txt \
  -X POST http://localhost:4000/api/auth/logout
```

Verify that the old refresh cookie no longer refreshes successfully.

## Acceptance criteria

- [ ] Registration validates input and creates a bcrypt password hash.
- [ ] Login returns an access token and sets an HTTP-only refresh cookie.
- [ ] Refresh rotates and revokes refresh tokens.
- [ ] Logout revokes the refresh token and clears the cookie.
- [ ] `/api/auth/me` requires a valid bearer token.
- [ ] Invalid credentials and expired tokens return `401`.
- [ ] Duplicate emails return `409`.
- [ ] Password hashes and raw refresh tokens never appear in API responses.
- [ ] Backend build and lint pass.
- [ ] Auth flow works against the migrated PostgreSQL database.

## Non-goals

Do not implement workspace permissions, invites, board CRUD, task CRUD, comments, or Redis caching in this phase.
