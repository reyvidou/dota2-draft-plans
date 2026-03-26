Tool: Gemini 3 Pro (Paid Tier), Claude 4.6 Sonnet (Free Tier)

Usage Summary:

- Gemini: Used for scaffolding the initial Docker/Node setup and translating React logic into Flutter Bloc.
- Claude: Used for scaffolding the initial web setup (React + Vite + Tailwind).

Prompt Record 1: "Build a Dota 2 draft planner backend with express, postgresql, and docker. The initial database schema should include tables for heroes, counters, synergies, and draft plans.

Table plans {
id uuid [pk]
name varchar
description text
created_at timestamp
}

Table bans {
id uuid [pk]
plan_id uuid [ref: > plans.id]
hero_id integer
note text
}

Table picks {
id uuid [pk]
plan_id uuid [ref: > plans.id]
hero_id integer
role varchar
priority varchar
note text
}

Table threats {
id uuid [pk]
plan_id uuid [ref: > plans.id]
hero_id integer
note text
}

Table timings {
id uuid [pk]
plan_id uuid [ref: > plans.id]
item varchar
explanation text
}

Table heroes_cache {
id integer [pk]
name varchar
localized_name varchar
primary_attr varchar
last_updated timestamp
}
"

Iterations: ~15-20 iterations per major component (Refactoring, Styling, Mobile port).

Final Result: A synchronized Fullstack solution with Web and Mobile clients.
