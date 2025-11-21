# CiteFinder - Citation Opportunity Finder

Find where to get cited in AI answers (ChatGPT, Claude, Perplexity, Gemini).

## What It Does

CiteFinder helps companies find relevant Reddit threads where they can authentically engage to get cited in AI answers. It searches Reddit, prioritizes opportunities, and provides actionable recommendations.

## Features

- 🔍 **Reddit Opportunity Finder** - Search Reddit for relevant threads
- 📊 **Prioritization Engine** - Score threads by engagement and citation potential
- 🤖 **AI Comment Generation** - Generate authentic comment drafts
- 📈 **Tracking** - Monitor engagement and citation status
- 💾 **Caching** - Efficient API usage with smart caching

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env.local` and fill in:
- Reddit API credentials (get from https://www.reddit.com/prefs/apps)
- Supabase credentials (get from your Supabase project)
- OpenAI API key (get from https://platform.openai.com/api-keys)

### 3. Database Setup
1. Create a Supabase project at https://supabase.com
2. Run the SQL schema in `database/schema.sql` in your Supabase SQL editor

### 4. Run Development Server
```bash
npm run dev
```

Visit http://localhost:3000

## Project Structure

```
CiteFinder/
├── app/
│   ├── api/              # API routes
│   ├── page.tsx          # Home page
│   └── layout.tsx        # Root layout
├── lib/                  # Utility functions
│   ├── reddit.ts        # Reddit API integration
│   ├── ai.ts            # AI comment generation
│   ├── prioritization.ts # Scoring algorithm
│   ├── cache.ts         # Caching system
│   └── supabase.ts      # Supabase client
├── types/               # TypeScript types
├── components/          # React components
└── database/            # SQL schema
```

## Features (MVP)

- ✅ Reddit opportunity finder
- ✅ Prioritization engine
- ✅ AI comment generation
- ✅ Basic tracking
- ⏳ Impact projections (v2)
- ⏳ ROI calculator (v2)
- ⏳ Action plans (v2)

## Next Steps

See `PROJECT_CONTEXT.md` for full project details.

