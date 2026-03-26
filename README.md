# Dota 2 Draft Planner - Fullstack Submission

### Local Setup (5 Steps)

1. **Clone & Navigate**: `git clone <repo_url> && cd dota2_draft_plans`
2. **Infrastructure**: Run `docker-compose up -d` in the root to start PostgreSQL.
3. **Database Init**: Run `npm run db:init` in `/backend` to migrate and seed (Heroes + Sample Plans).
4. **Launch Backend**: Run `npm run dev` in `/backend`.
5. **Launch Frontend**:
   - **Web**: `npm run dev` in `/frontend-web`.
