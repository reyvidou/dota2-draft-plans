# DESIGN.md — Dota 2 Draft Planner

## Table of Contents

1. [Planned Pages / Screens & Routing](#1-planned-pages--screens--routing)
2. [State Management Approach](#2-state-management-approach)
3. [Data Flow Overview](#3-data-flow-overview)
4. [Error Handling Approach](#4-error-handling-approach)
5. [What Was Intentionally Not Built & Why](#5-what-was-intentionally-not-built--why)

---

## 1. Planned Pages / Screens & Routing

The app uses a **flat, two-level routing structure**. There is no deep nesting — a draft plan is either open or it isn't. This reflects how a player actually uses the tool: pick a plan, edit it, close it.

```
/                        → Draft Plans list (home)
/plans/:id               → Draft Plan detail (tabbed: Bans | Picks | Threats | Timings)
/plans/:id/summary       → Read-only summary view (shareable during draft phase)
```

### Screen breakdown

| Route                | Component      | Purpose                                                                                                                                                                                |
| -------------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                  | `PlanList`     | Grid of all saved plans with at-a-glance stats. Entry point to create or open a plan.                                                                                                  |
| `/plans/:id`         | `PlanDetail`   | Tabbed editor for a single plan. Each tab (Bans, Picks, Threats, Timings)                                                                                                              |
| `/plans/:id/summary` | `SummaryModal` | Read-only aggregated view of the plan. Designed for quick scanning during an actual draft lobby. Accessible as a full route so it can be opened in a second monitor or shared via URL. |

### Routing rationale

React Router was chosen over a custom navigation state flag (`selectedPlanId` in Zustand) for one reason: **shareable URLs**. A player in a draft lobby needs to be able to paste `/plans/:id/summary` into a Discord message and have a teammate open it directly. A pure state-based approach loses this.

The `HeroBrowser` is a **modal**, not a route, because it is strictly transient UI — opening it does not represent a navigational destination worth bookmarking or sharing.

---

## 2. State Management Approach

### Choice: Zustand + persist middleware

The app uses **Zustand** as its single state manager. The store is split conceptually into two slices, though implemented as one flat object:

```
DraftStore
├── persisted (via zustand/middleware persist)
│   └── plans: DraftPlan[]
└── transient (in-memory only)
    ├── selectedPlanId: string | null
    ├── heroes: OpenDotaHero[]
    ├── loadingHeroes: boolean
    └── hydrated: boolean
```

### Why Zustand over the alternatives

| Option                           | Reason rejected                                                                                                                                                                                                                                                                                               |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **useState / useReducer**        | Works fine for isolated components but creating a plan on one screen and navigating to it on another requires either prop-drilling or a Context wrapper. Context re-renders the entire tree on every mutation — unacceptable for a list of 120+ hero buttons.                                                 |
| **Redux Toolkit**                | RTK is excellent but carries meaningful boilerplate (slices, actions, selectors, provider). For a focused single-feature app this overhead is not justified. The Zustand store achieves the same result in roughly one-third the code.                                                                        |
| **React Query / TanStack Query** | Considered for the OpenDota heroes fetch specifically. Rejected because the heroes endpoint is the only remote read — adding a full server-state library for one GET request is disproportionate. The fetch is handled manually with a `useEffect` and stored in Zustand alongside the rest of the app state. |
| **Jotai / Recoil**               | Atom-based models suit highly granular reactive graphs (e.g. spreadsheet cells). Draft plans are coarse objects mutated as a whole on every change — a single store slice is a better fit.                                                                                                                    |

### Why Zustand persist

The `persist` middleware serialises only the `plans` slice to storage. Transient state (`selectedPlanId`, `heroes`, `hydrated`) is excluded via `partialize`. This means:

- Refreshing the page restores all plans but lands the user back on the list screen (correct).
- Hero data is always re-fetched on boot rather than served from a potentially stale snapshot (correct — OpenDota data changes with patches).
- The `hydrated` flag gates the render so the UI never flashes empty state before rehydration completes.

The storage adapter is a thin bridge to `window.storage` (the artifact key-value API), but the interface is identical to `localStorage` — swapping backends requires changing only the adapter object, not any component code.

---

## 3. Data Flow Overview

```
┌─────────────────────────────────────────────────────────┐
│                        BROWSER                          │
│                                                         │
│   React UI                                              │
│   └── reads from / dispatches to  Zustand Store         │
│           │                            │                │
│           │ persist middleware          │ updatePlan()  │
│           ▼                            ▼                │
│      window.storage              Express REST API        │
│      (local artifact KV)         PUT /api/plans/:id     │
│                                  POST /api/plans        │
│                                  DELETE /api/plans/:id  │
│                                  GET /api/heroes        │
└─────────────────────────────────────────────────────────┘
                                        │
                          ┌─────────────┘
                          ▼
              ┌───────────────────────┐
              │   Express + Node.js   │
              │                       │
              │  /api/heroes          │
              │  └─ checks api_cache  │
              │     hit  → return PG  │
              │     miss → fetch ODota│
              │            upsert PG  │
              │            return     │
              │                       │
              │  /api/plans (CRUD)    │
              │  └─ read/write        │
              │     draft_plans table │
              └───────────┬───────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │      PostgreSQL       │
              │                       │
              │  users                │
              │  draft_plans (JSONB)  │
              │  api_cache            │
              │  background_jobs      │
              └───────────────────────┘
```

### What comes from the API vs what is persisted locally

| Data                                        | Source                                                  | Persisted where                  | Rationale                                                                                                             |
| ------------------------------------------- | ------------------------------------------------------- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Hero list (name, id, attr, image)           | `GET /api/heroes` → OpenDota (cached in PG)             | Not persisted client-side        | Hero data changes with game patches. Always fetched fresh on boot; PG cache absorbs the latency.                      |
| Draft plans (bans, picks, threats, timings) | `GET /api/plans` on load; mutations via POST/PUT/DELETE | PostgreSQL (`draft_plans` table) | Source of truth. The Zustand store is a client mirror — it is loaded from the API and written back on every mutation. |
| Selected plan ID                            | Zustand transient state                                 | Not persisted                    | Navigation state only. Restored to `null` on refresh intentionally — the user lands on the list screen, not mid-edit. |

### Mutation flow (example: adding a hero to the ban list)

```
User clicks hero in HeroBrowser
  → useDraftStore.updatePlan({ ...plan, bans: [...bans, newEntry] })
      → Zustand updates plans[] in memory immediately (optimistic)
      → persist middleware serialises plans[] to window.storage
      → component re-renders with new ban visible
  → useEffect / API layer calls PUT /api/plans/:id with full plan payload
      → Express updates draft_plans row in PostgreSQL
      → on error: revert Zustand state to pre-mutation snapshot
```

The write is **optimistic**: the UI updates instantly and the API call happens in the background. This makes the app feel responsive even under latency.

---

## 4. Error Handling Approach

### Layered strategy

```
API errors  →  caught in the service layer, surfaced as toast notifications
Network errors  →  caught at fetch(), user sees a non-blocking banner
Validation errors  →  prevented at the input level (disabled buttons, required fields)
Storage errors  →  caught in the persist adapter, logged, app continues with in-memory state
Rehydration failure  →  hydrated timeout fallback (1.5s) ensures the UI always unblocks
```

### Per-layer detail

**UI layer** — Form inputs enforce constraints before any API call is made. The "Create Plan" button is disabled when the name field is empty. Role and priority selects use controlled components with typed union values — invalid states cannot be represented.

**Store layer** — Every action that calls the API is wrapped in try/catch. On failure the store rolls back to the previous state snapshot captured before the optimistic update. This prevents the UI from showing data that the database does not actually have.

**API layer (Express)** — All route handlers catch errors and return structured JSON:

```json
{ "error": "Human-readable message" }
```

HTTP status codes are used semantically: `404` for missing plans, `500` for database failures, `201` for successful creation. The frontend checks `response.ok` before consuming the body.

**Database layer** — The PG pool emits connection errors at startup (logged with `❌`). Queries use parameterised `$1` placeholders throughout — no string concatenation, no SQL injection surface. The `api_cache` upsert uses `ON CONFLICT DO UPDATE` to make cache writes idempotent.

**Hero image loading** — `HeroBadge` components handle `onError` on the `<img>` tag and fall back to a two-letter initialism. OpenDota's CDN occasionally serves 404s for newer heroes; this prevents broken image icons in the UI.

---

## 5. What Was Intentionally Not Built & Why

### Optimistic rollback UI feedback

The optimistic update pattern is implemented but failed mutations currently log to the console rather than showing a toast or snackbar to the user.

**Reason:** A toast library (Sonner, react-hot-toast) would be the right tool. Adding one for a single error state felt disproportionate given the time constraint. The rollback logic itself is correct — the user experience degrades to a silent revert rather than a visible one, which is acceptable but not ideal.

### Hero image caching / service worker

Hero portrait images are fetched from the Steam CDN on every load. There is no service worker or `Cache-Control` strategy.

**Reason:** The Steam CDN already serves images with long-lived cache headers. Browser-native HTTP caching handles this adequately. A service worker would only be warranted if the app needed true offline support, which is out of scope.

### Real-time collaboration

Multiple users editing the same draft plan simultaneously is not supported. The last write wins.

**Reason:** Real-time sync requires either WebSockets or polling with conflict resolution (CRDTs or operational transforms). That is a substantial architectural addition. Draft planning is inherently a single-user or turn-based activity — two people do not simultaneously edit the same ban list in practice.

### Background job worker

The `background_jobs` table and `SKIP LOCKED` index are present in the schema and seed. No worker process polls the table.

**Reason:** The table was scaffolded to demonstrate understanding of the PostgreSQL queue pattern. Without a concrete async task to run (e.g. AI draft suggestions, webhook delivery) building the polling loop would be infrastructure without a consumer. The scaffolding makes it trivial to add — a `setInterval` loop with the SKIP LOCKED query is all that's needed.

### Pagination on the plan list

`GET /api/plans` returns all plans for a user with no `LIMIT` / `OFFSET`.

**Reason:** A draft planner accumulates tens of plans at most, not thousands. Pagination adds query complexity and frontend state (current page, total count) for a problem that does not exist at this data scale. The composite index `(user_id, created_at)` is already in place — adding `LIMIT` / `OFFSET` to the query is a one-line change if volume ever warrants it.
