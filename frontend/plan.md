# CivicFix — Implementation & Design Plan

## Product approach

CivicFix will be a frontend-only React/Vite application that connects to the existing FastAPI service at `http://localhost:8010` through a centralized, easy-to-adjust API layer. The frontend will not create or replace backend services, database models, authentication storage, or issue data. API failures will surface as explicit loading/error/empty states instead of silently replacing the backend with mock data.

The app will use React Router for public, citizen, and admin routes; a small AuthContext backed by localStorage for the backend session payload; reusable layout, form, badge, table, timeline, toast, and state components; and responsive CSS with a mobile-first breakpoint strategy.

## Design system

- **Design movement:** Civic Modernism — the clarity and restraint of public-service wayfinding combined with the polish of a contemporary SaaS operations console.
- **Core principles:** (1) make civic action feel immediate and legible, (2) communicate trust through hierarchy and consistent status language, (3) keep dense operational data calm and scannable, and (4) make every failure recoverable.
- **Color philosophy:** Charcoal and warm cream create a grounded institutional base; Civic Orange signals public action and visible progress; Sand Gold is reserved for route-line ornament; Forest Green, Amber, and Brick Red communicate completion, attention, and risk rather than decoration.
- **Palette:** Civic Orange `#E07A2D`, Charcoal `#202124`, Warm Cream `#F7F3EC`, Sand Gold `#C9A66B`, Slate `#6B7280`, Soft Orange `#FCEBDD`, Soft Cream `#FFF9F2`, Forest Green `#3F7D58`, Amber `#C77B30`, Brick Red `#B84A39`, Border `#E5DED3`, White `#FFFFFF`.
- **Layout paradigm:** A left-anchored editorial layout: hero copy and civic proof points sit on an asymmetric text rail, while a floating “city pulse” dashboard card creates a visual counterweight. Authenticated pages use a stable app shell with a compact rail/sidebar on desktop that becomes a top bar and drawer on mobile. Tables and detail panels align to the same left reading edge instead of centering every card.
- **Signature elements:** a small Civic Orange “civic pulse” dot with a connecting route line; subtle Sand Gold map-grid linework behind selected hero panels; and a consistent ticket-chip treatment for IDs such as `CF-0003`.
- **Interaction philosophy:** Actions should feel like public-service handoffs: clear labels, visible busy states, safe confirmation for admin changes, and a success toast that tells the user what happened next. Hover and focus states use lift/border emphasis, never ornamental motion.
- **Animation:** Use 150–220ms opacity/transform transitions for cards, menus, and toasts; use a restrained shimmer only for loading skeletons; avoid parallax, auto-advancing carousels, and attention-stealing loops.
- **Typography system:** Use `Inter` for UI, tables, and body copy; use `DM Sans` for high-impact display headings and wordmark accents. H1 is 56/1.05 desktop and 40/1.08 mobile; page titles 32/1.15; section titles 22/1.25; body 15/1.55; metadata 12/1.4 with increased letter spacing.
- **Brand essence:** “A clearer path from neighborhood report to visible city response,” for residents and the teams who resolve issues. Personality: **grounded, responsive, civic-minded**.
- **Brand voice:** Direct, reassuring, action-oriented. Example lines: “Turn a street-level problem into a tracked response.” and “Your report is in the system — here’s what happens next.”
- **Wordmark & logo:** The CivicFix mark is a rounded square containing a simplified route-pin/repair spark: two connected Civic Orange nodes joined by a Charcoal path, paired with a two-weight “CivicFix” wordmark. In code, the mark will be built from simple inline SVG/CSS shapes so it stays crisp and requires no external asset.
- **Signature brand color:** Civic Orange `#E07A2D` — the ownable link between neighborhood action, movement, and visible public response.

## Routes and page responsibilities

- `/` — landing page with navigation, hero, how-it-works, categories, final CTA, and footer.
- `/login` — login form and role-based redirect.
- `/signup` — registration form and validation.
- `/app` — citizen dashboard.
- `/app/report` — issue form with image preview and browser geolocation.
- `/app/issues` — searchable/filterable citizen issue list.
- `/app/issues/:id` — citizen issue detail and status timeline.
- `/app/profile` — lightweight authenticated profile surface.
- `/admin` — admin dashboard with summary metrics and CSS/SVG chart visuals.
- `/admin/issues` — searchable/filterable admin table with inline controls.
- `/admin/users` — data-integrity-safe users surface that only renders live backend records when the real endpoint is configured.
- `/admin/issues/:id` — admin issue detail and save controls.

Protected route guards will check the persisted auth payload and expected role. Citizen routes will reject admins; admin routes will reject citizens. A 401 response will clear the session and route to `/login` with a recoverable message.

## Project structure

```text
civicfix/
├── public/
│   └── manus-routes.json
├── src/
│   ├── api/
│   │   ├── client.js          # base URL, auth headers, 401 normalization
│   │   ├── auth.js            # register, login, session helpers
│   │   └── issues.js          # citizen/admin issue methods and update methods
│   ├── components/
│   │   ├── AppShell.jsx       # desktop rail/mobile topbar
│   │   ├── BrandMark.jsx
│   │   ├── Button.jsx
│   │   ├── EmptyState.jsx
│   │   ├── IssueCard.jsx
│   │   ├── LoadingState.jsx
│   │   ├── Modal.jsx
│   │   ├── PriorityBadge.jsx
│   │   ├── StatusBadge.jsx
│   │   ├── Toast.jsx
│   │   └── charts/
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── ToastContext.jsx
│   ├── layout/
│   │   └── PublicNav.jsx
│   ├── pages/
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── citizen/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ReportIssue.jsx
│   │   │   ├── MyIssues.jsx
│   │   │   ├── IssueDetails.jsx
│   │   │   └── Profile.jsx
│   │   └── admin/
│   │       ├── Dashboard.jsx
│   │       ├── Issues.jsx
│   │       └── IssueDetails.jsx
│   ├── routes/
│   │   └── ProtectedRoute.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── app.config.ts
├── package.json
└── plan.md
```

## API integration and maintainability

`src/api/client.js` will read `VITE_API_BASE_URL` with a default of `http://localhost:8010`, attach the stored token when present, parse JSON consistently, and throw a normalized error with a user-safe message. Endpoint paths and request body mapping will be isolated in `auth.js` and `issues.js`, making adjustments straightforward if the existing FastAPI route names differ. The UI will use response normalization helpers for common field variants (`id`/`ticket_id`, `created_at`/`date_reported`, etc.) without fabricating records.

If the backend schema is not present in the project, the frontend will document the expected path constants in the API modules and keep all assumptions localized. File uploads will use `FormData`; the issue form will preserve fields and image preview independently of submission state.

## Build and delivery workflow

1. Add the Vite React JavaScript scaffold, dependencies, route manifest, and project metadata.
2. Implement the design tokens, public landing/auth surfaces, and responsive app shell.
3. Implement API services, auth persistence, protected routing, citizen pages, and admin pages.
4. Run host-managed diagnostics, build checks, and the development server on the configured port 3000.
5. Verify the route manifest is served as JSON, the preview is reachable, and key source paths are coherent.
6. Save the completed code to the canonical remote so the project is checkpointed and recoverable. Publication is separate and will only be reported if successful.
