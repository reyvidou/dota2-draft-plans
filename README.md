# Dota 2 Draft Planner

Plan your draft. Track bans, picks, threats, and item timings — all in one place.

---

## Local Setup

**Prerequisites:** Docker Desktop running.

**1. Clone the repo**

```bash
git clone https://github.com/reyvidou/dota2-draft-plans.git
cd dota2-draft-plans
```

**2. Copy the environment file**

```bash
cp .env.example .env
```

**3. Start all services**

```bash
docker compose up --build
```

This starts PostgreSQL, runs `init.sql` and `seed.sql` automatically, then starts the backend and frontend.

**4. Open the app**

| Service  | URL                              |
| -------- | -------------------------------- |
| Frontend | http://localhost:5173            |
| Backend  | http://localhost:3000            |
| Health   | http://localhost:3000/api/health |

---

> **Resetting the database** — if you change `init.sql` or `seed.sql`, wipe the volume first:
>
> ```bash
> docker compose down -v && docker compose up --build
> ```
