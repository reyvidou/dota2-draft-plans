-- 1. Users Table (For Authentication Bonus)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Draft Plans Table (JSONB is a lifesaver for tight deadlines)
CREATE TABLE IF NOT EXISTS draft_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    bans JSONB DEFAULT '[]'::jsonb,
    picks JSONB DEFAULT '[]'::jsonb,
    threats JSONB DEFAULT '[]'::jsonb,
    timings JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. OpenDota API Cache (For Server-Side Caching Bonus)
CREATE TABLE IF NOT EXISTS api_cache (
    endpoint VARCHAR(255) PRIMARY KEY,
    response_data JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Background Jobs (For the PostgreSQL Long-Running Task Bonus)
CREATE TABLE IF NOT EXISTS background_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID REFERENCES draft_plans(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'processing', 'completed'
    result JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index to make the SKIP LOCKED polling ultra-fast
CREATE INDEX idx_jobs_status ON background_jobs(status);