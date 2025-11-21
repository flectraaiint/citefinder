-- Questions table
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_text TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Reddit opportunities table
CREATE TABLE IF NOT EXISTS reddit_opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID REFERENCES questions(id),
  thread_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  permalink TEXT NOT NULL,
  upvotes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  subreddit TEXT NOT NULL,
  created TIMESTAMP NOT NULL,
  author TEXT,
  citation_score INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Engagement table
CREATE TABLE IF NOT EXISTS engagement (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  opportunity_id UUID REFERENCES reddit_opportunities(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  comment_draft TEXT,
  status TEXT DEFAULT 'draft', -- 'draft', 'posted', 'pending'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tracking table
CREATE TABLE IF NOT EXISTS tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  engagement_id UUID REFERENCES engagement(id),
  citation_status BOOLEAN DEFAULT FALSE,
  platform TEXT NOT NULL, -- 'chatgpt', 'claude', 'perplexity', 'gemini'
  checked_at TIMESTAMP DEFAULT NOW()
);

-- Cache table for Reddit API results
CREATE TABLE IF NOT EXISTS reddit_cache (
  question_hash TEXT PRIMARY KEY,
  results JSONB NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_questions_user_id ON questions(user_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_question_id ON reddit_opportunities(question_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_citation_score ON reddit_opportunities(citation_score DESC);
CREATE INDEX IF NOT EXISTS idx_engagement_user_id ON engagement(user_id);
CREATE INDEX IF NOT EXISTS idx_engagement_opportunity_id ON engagement(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_tracking_engagement_id ON tracking(engagement_id);
CREATE INDEX IF NOT EXISTS idx_cache_expires_at ON reddit_cache(expires_at);

