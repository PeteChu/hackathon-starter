# API Contract

> **Status:** Draft · **Owner:** backend-node · **Audience:** Team (backend + frontend) · **Updated:** Scaffold

Base URL: `http://localhost:8080` (the web app reads it from env). Start the API with `make dev-node`.

## Error shape (target for new routes)

The starter returns plain strings on errors. New routes should return this JSON shape so the UI can render reliable errors:

```json
{
  "error": { "code": "validation_error", "message": "username must be 8-20 chars" }
}
```

Status map: `400` validation, `401`/`403` auth, `404` missing, `500` unexpected.

## GET /healthz

Response:

```json
{ "ok": true, "service": "api-node" }
```

## POST /login

Request (Zod: `username` and `password`, each 8–20 chars):

```json
{ "username": "admin", "password": "********" }
```

Responses: `200 "Logged-In"` · `400 "bad request"` (validation) · `401 "unauthorized"`.

> Note: this starter route returns plain strings and carries hardcoded test credentials in `server.ts`. Treat it as scaffolding — real routes use the JSON error shape above and read credentials from `process.env` (mirrored in `.env.example`).

## Endpoints for the demo slice

Add one row per endpoint the next slice needs — no more.

> **When filling for your challenge:** Add one row per endpoint the demo slice needs. Keep it minimal — every field must be rendered by the UI. Example: `POST /orders` → `{ "item": "...", "qty": 1 }` → `{ "id": "...", "status": "created" }` → 201. Include only endpoints needed for the live demo; remove starter-only routes like `/login` when replacing the demo.

| Method | Path | Purpose | Request | Response | Status |
| --- | --- | --- | --- | --- | --- |
| | | | | | |

## Frontend fetch notes

- Base URL via env (default `http://localhost:8080`); consider a `/api` proxy for production-shaped calls.
- Surface validation errors from the `error.message` field in the UI's error state.
