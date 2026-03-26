-- Depends on: init.sql (run that first)

-- 1. USERS
INSERT INTO users (id, username, password_hash) VALUES
  (
    '11111111-0000-0000-0000-000000000001',
    'carry_enjoyer',
    -- bcrypt hash of "password123" (cost 12) — replace with real hashes in prod
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGPQyVq.hQXIFQ6gPIXl8ZcZJCe'
  ),
  (
    '11111111-0000-0000-0000-000000000002',
    'support_main',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGPQyVq.hQXIFQ6gPIXl8ZcZJCe'
  );

-- 2. DRAFT PLANS

-- Plan A — carry_enjoyer: aggressive early-game stomp
INSERT INTO draft_plans (
  id, user_id, name, description, bans, picks, threats, timings
) VALUES (
  'aaaaaaaa-0000-0000-0000-000000000001',
  '11111111-0000-0000-0000-000000000001',
  'Patch 7.38 Rat Strat',
  'Hard push / split-push draft. Win via barracks before enemy scales.',

  -- bans: Timbersaw (59), Nature''s Prophet (76), Broodmother (54)
  '[
    {"id":"b001","heroId":59, "note":"Counters our melee cores all game"},
    {"id":"b002","heroId":76, "note":"Out-rats us and splits better"},
    {"id":"b003","heroId":54, "note":"Webs shut down our jungle rotations"}
  ]'::jsonb,

  -- picks: Lycan (77), Beastmaster (38), Chen (56), Shadow Shaman (26), Dark Seer (55)
  '[
    {"id":"p001","heroId":77, "role":"Carry",        "priority":"High",   "note":"Primary split-pusher, use wolves on buildings"},
    {"id":"p002","heroId":38, "role":"Offlane",      "priority":"High",   "note":"Hawks give global vision, boar locks down escapes"},
    {"id":"p003","heroId":56, "role":"Soft Support", "priority":"Medium", "note":"Creep convert for push power + healing"},
    {"id":"p004","heroId":26, "role":"Hard Support", "priority":"Medium", "note":"Shackles + Mass Serpent Ward wins every highground fight"},
    {"id":"p005","heroId":55, "role":"Mid",          "priority":"Low",    "note":"Flex pick — Vacuum + Wall into Shackles is a free rax"}
  ]'::jsonb,

  -- threats: Enigma (33) — BH into 5-man; Keeper of the Light (90)
  '[
    {"id":"t001","heroId":33, "note":"Black Hole counters our grouped push — must ban or have BKB timing ready"},
    {"id":"t002","heroId":90, "note":"Spirit Form Illuminate denies our deep ward vision and slows push windows"}
  ]'::jsonb,

  -- timings
  '[
    {"id":"tm01","item":"Lycan Helm of the Dominator ~12 min","explanation":"Dominate the Ancient Thunderhide immediately for rune/objective control"},
    {"id":"tm02","item":"BKB on cores ~17 min",               "explanation":"Need BKB before first highground attempt to avoid Black Hole"},
    {"id":"tm03","item":"Smoke + Rosh ~22 min",               "explanation":"Sneak Rosh after BKB timing; Aegis lets Lycan die into T3 safely"}
  ]'::jsonb
);


-- Plan B — support_main: teamfight wombo-combo draft
INSERT INTO draft_plans (
  id, user_id, name, description, bans, picks, threats, timings
) VALUES (
  'aaaaaaaa-0000-0000-0000-000000000002',
  '11111111-0000-0000-0000-000000000001',
  'Wombo Combo Teamfight',
  'Stack AoE ultimates. Draft for one decisive teamfight at 25 minutes.',

  -- bans: Anti-Mage (1), Storm Spirit (17), Puck (14), Silencer (105)
  '[
    {"id":"b010","heroId":1,   "note":"Blinks out of every combo, farms faster than we can fight"},
    {"id":"b011","heroId":17,  "note":"Ball Lightning makes him immune during our initiation window"},
    {"id":"b012","heroId":14,  "note":"Phase Shift negates all targeted ultimates in the combo"},
    {"id":"b013","heroId":105, "note":"Global Silence hard-counters our ult-dependent lineup"}
  ]'::jsonb,

  -- picks: Enigma (33), Magnus (97), Faceless Void (41), Witch Doctor (30), Rubick (86)
  '[
    {"id":"p010","heroId":33, "role":"Offlane",      "priority":"High",   "note":"Black Hole is the primary initiation — get Blink + BKB by 22 min"},
    {"id":"p011","heroId":97, "role":"Mid",          "priority":"High",   "note":"Reverse Polarity → Black Hole → Chronosphere chain. RP must land first"},
    {"id":"p012","heroId":41, "role":"Carry",        "priority":"High",   "note":"Chronosphere locks survivors after RP+BH. Get BKB to avoid being disabled before ult"},
    {"id":"p013","heroId":30, "role":"Hard Support", "priority":"Medium", "note":"Death Ward during Chronosphere = guaranteed kills. Mekansm for survivability"},
    {"id":"p014","heroId":86, "role":"Soft Support", "priority":"Low",    "note":"Steal RP or BH for a second combo. Aether Lens + Force Staff build"}
  ]'::jsonb,

  -- threats: Earthshaker (7) — echo slam counters our clump; Hoodwink (123)
  '[
    {"id":"t010","heroId":7,   "note":"Echo Slam punishes us grouping for the combo — spread positioning matters"},
    {"id":"t011","heroId":123, "note":"Acorn Shot breaks Chronosphere clock; pick or ban in lane stage"}
  ]'::jsonb,

  '[
    {"id":"tm10","item":"Magnus Blink ~15 min",     "explanation":"Blink is mandatory before any fight — without it RP range is too short"},
    {"id":"tm11","item":"Enigma BKB ~18 min",        "explanation":"BKB ensures Black Hole channels full duration through Disrupts and silences"},
    {"id":"tm12","item":"First combo attempt ~22 min","explanation":"Smoke into their jungle. RP → BH → Chrono order must be drilled pre-game"},
    {"id":"tm13","item":"Void BKB ~22 min",          "explanation":"Void needs BKB before Chrono or enemy can stun him out mid-ult"}
  ]'::jsonb
);


-- Plan C — support_main's own plan: laning-phase bully
INSERT INTO draft_plans (
  id, user_id, name, description, bans, picks, threats, timings
) VALUES (
  'aaaaaaaa-0000-0000-0000-000000000003',
  '11111111-0000-0000-0000-000000000002',
  'Lane Dominance Deathball',
  'Win every lane, group at 15, and end before 35 minutes.',

  '[
    {"id":"b020","heroId":8,  "note":"Bane locks down our pos 1 all laning phase"},
    {"id":"b021","heroId":53, "note":"Keeper Blinding Light counters our melee carry"},
    {"id":"b022","heroId":114,"note":"Mars Arena + BH is an instant-loss teamfight"}
  ]'::jsonb,

  '[
    {"id":"p020","heroId":2,  "role":"Carry",        "priority":"High",   "note":"Axe + Axe — battlehunger synergy, goes Phase Boots + Blink"},
    {"id":"p021","heroId":42, "role":"Mid",          "priority":"High",   "note":"Windranger — Shackleshot into BFury for fast clear and pick-offs"},
    {"id":"p022","heroId":81, "role":"Offlane",      "priority":"Medium", "note":"Chaos Knight illusions tank towers and create confusion"},
    {"id":"p023","heroId":5,  "role":"Soft Support", "priority":"Medium", "note":"Crystal Maiden — Frostbite chains in lane, Freezing Field if ahead"},
    {"id":"p024","heroId":32, "role":"Hard Support", "priority":"Low",    "note":"Lich Sacrifice denies own creeps, slows enemy regen, Chain Frost cleanup"}
  ]'::jsonb,

  '[
    {"id":"t020","heroId":74, "note":"Invoker outranges and kites our entire lineup in mid-game skirmishes"},
    {"id":"t021","heroId":11, "note":"Shadow Fiend Shadowraze + Presence of the Dark Lord denies Crystal Maiden mana badly"}
  ]'::jsonb,

  '[
    {"id":"tm20","item":"CM Glimmer Cape ~10 min",  "explanation":"Allows CM to survive the burst that comes from enemy roaming mid"},
    {"id":"tm21","item":"Group up ~15 min",          "explanation":"Our laning heroes have diminishing value past 20 — must group early"},
    {"id":"tm22","item":"CK Armlet ~16 min",         "explanation":"Armlet toggle + illusions = unkillable in deathball skirmishes"},
    {"id":"tm23","item":"High ground push ~28 min",  "explanation":"Must hit rax before Invoker gets Aghs + Refresher online"}
  ]'::jsonb
);

-- 3. API CACHE — Pre-warm with a small stub so the cache layer works on first
INSERT INTO api_cache (endpoint, response_data, updated_at)
VALUES (
  'opendota_heroes',
  '[]'::jsonb,   -- intentionally empty stub; TTL of 0 forces immediate refresh
  '2000-01-01 00:00:00+00'  -- ancient timestamp → always stale → triggers fetch
)
ON CONFLICT (endpoint) DO NOTHING;


INSERT INTO background_jobs (plan_id, status) VALUES
  ('aaaaaaaa-0000-0000-0000-000000000001', 'completed'),
  ('aaaaaaaa-0000-0000-0000-000000000002', 'pending'),
  ('aaaaaaaa-0000-0000-0000-000000000003', 'pending');