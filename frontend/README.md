# CivicFix frontend

CivicFix is a React/Vite frontend for a civic issue reporting platform. It does not replace the existing FastAPI/PostgreSQL backend.

## Run locally

```bash
npm install
npm run dev
```

The Vite server listens on `http://localhost:3000` and the default backend base URL is `http://localhost:8010`.

## Backend integration

The sandbox did not include the FastAPI source tree and `localhost:8010` was unreachable during implementation, so all endpoint paths and login body assumptions are intentionally isolated in `src/api/` and exposed through `.env.example`:

- `VITE_API_BASE_URL`
- `VITE_API_REGISTER_PATH`
- `VITE_API_LOGIN_PATH`
- `VITE_API_PROFILE_PATH`
- `VITE_API_CITIZEN_ISSUES_PATH`
- `VITE_API_ADMIN_ISSUES_PATH`
- `VITE_API_ISSUE_PATH`
- `VITE_API_LOGIN_MODE` (`json` or `form`)

Once the real FastAPI route definitions are available, update these values rather than changing page components. The API layer preserves the backend session payload, sends bearer tokens when present, supports cookie credentials, normalizes common response envelopes, and clears local session state on a 401 response in the consuming flow.

## Routes

Public routes are `/`, `/login`, and `/signup`. Citizen routes live under `/app`; admin routes live under `/admin`, including the data-integrity-safe `/admin/users` surface. The required manifest is available at `/manus-routes.json`.
