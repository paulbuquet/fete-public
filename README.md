# Fête Médiévale — Interactive Celebration App

A medieval-themed interactive web app for a celebration. Features games, a leaderboard, photo gallery, and a treasure hunt — all wrapped in a festive medieval aesthetic.

## 🎮 Features

| Feature | Description |
|---------|-------------|
| **🏰 Password-Protected Entry** | Secure access via server-side password verification (HTTP-only cookie) |
| **⚔️ Three Mini-Games** | Crossword, "Whose Song?" (audio swipe), Guess the Country (photo map quiz) |
| **🏆 Real-Time Leaderboard** | Supabase-backed scoring with per-game breakdown & multipliers |
| **📷 Photo Gallery** | Camera capture + upload to Supabase Storage, compressed to WebP |
| **🗺️ Treasure Hunt** | Riddle-based puzzle with external clue redirect |

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 + custom design system
- **Database/Storage/Auth**: Supabase (PostgreSQL + Storage)
- **Deployment**: Vercel (recommended)

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone <your-repo>
cd pacs-fete
npm install
```

### 2. Supabase Setup

Create a new Supabase project, then run these SQL statements in the SQL Editor:

```sql
-- Photos table
create table photos (
  id uuid primary key default gen_random_uuid(),
  image_path text not null,
  created_at timestamptz default now()
);

-- Scores table (unique constraint enforces one attempt per game per player)
create table scores (
  player_name text not null,
  game_id text not null,
  score numeric not null,
  max_score numeric not null,
  created_at timestamptz default now(),
  primary key (player_name, game_id)
);

-- Games config table
create table games (
  name text primary key,
  enabled boolean default false
);

-- Insert default games (adjust as needed)
insert into games (name, enabled) values
  ('crossword', true),
  ('whose-song', true),
  ('guess-country', true);

-- Storage bucket for photos
insert into storage.buckets (id, name, public) values ('photos', 'photos', true);

-- Allow public read access to photos bucket
create policy "Public read access" on storage.objects
  for select using (bucket_id = 'photos');

-- Allow authenticated upload (or adjust for your auth setup)
create policy "Allow uploads" on storage.objects
  for insert with check (bucket_id = 'photos');
```

### 3. Environment Variables

Copy the example and fill in your values:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SITE_PASSWORD=your-secure-password
```

### 4. Add Game Assets

The games require specific assets in `public/`:

```
public/
├── whose-song/
│   ├── photos/
│   │   ├── player1.jpg      # Player 1 photo (400x400 recommended)
│   │   └── player2.jpg      # Player 2 photo (400x400 recommended)
│   └── audio/
│       ├── track1.mp3    # Song 1 (owner defined in src/components/games/whose-song/data.ts)
│       ├── track2.mp3
│       └── ...track14.mp3
└── guess-country/
    └── photos/
        ├── round1.jpg    # Photo for round 1 (country defined in src/components/games/guess-country/data.ts)
        ├── round2.jpg
        └── ...round12.jpg
```

**Placeholder SVGs** are provided for the player photos. Replace them with your own images.

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) and enter the password from `SITE_PASSWORD`.

## 📁 Project Structure

```
src/
├── app/
│   ├── (main)/              # Authenticated routes (middleware-protected)
│   │   ├── page.tsx         # Home / Welcome
│   │   ├── chasse-au-tresor/# Treasure Hunt
│   │   ├── joutes/          # Games Hub
│   │   ├── classement/      # Leaderboard
│   │   └── photos-souvenirs/# Photo Gallery
│   └── layout.tsx           # Root layout, fonts, metadata
├── components/
│   ├── games/               # Game components + registry
│   ├── layout/              # Header, BottomNav, NameEntry
│   ├── leaderboard/         # Leaderboard UI
│   ├── photos/              # PhotoGrid, CameraCapture
│   ├── treasure-hunt/       # Riddle UI + logic
│   └── ui/                  # Reusable UI primitives (Button, Card, etc.)
├── lib/
│   ├── supabase.ts          # Supabase client
│   ├── scores.ts            # Score submission + leaderboard fetch
│   ├── games.ts             # Game config fetch
│   ├── photos.ts            # Photo upload + fetch (with compression)
│   ├── game-meta.ts         # Game metadata (icons, titles, multipliers)
│   ├── useScoreSubmission.ts# Hook for one-attempt score submission
│   ├── useCountdown.ts      # Timer hook
│   ├── usePlayerName.ts     # Player name persistence (localStorage)
│   └── useIsMobile.ts       # Mobile detection hook
├── types/
│   └── game.ts              # GameDefinition type
└── middleware.ts            # Password protection middleware
```

## 🎨 Design System

Custom medieval-themed design tokens in `globals.css`:
- **Colors**: `night`, `parchment`, `gold`, `gold-dim`, `danger`, `success`
- **Fonts**: Cinzel (display) + Crimson Text (body) via `next/font/google`
- **Utilities**: `clsx` + `tailwind-merge` for class composition

## 🔐 Security Notes

- **Middleware** protects all routes except `/enter`, `/api`, static assets
- **Password verification** happens server-side (`actions.ts`), sets HTTP-only secure cookie
- **Supabase RLS** should be enabled for production (policies above are permissive for demo)
- **Score submission** uses DB unique constraint to enforce single attempt per game

## 📦 Deployment (Vercel)

1. Push to GitHub
2. Import in Vercel
3. Add environment variables in Vercel project settings
4. Deploy

**Note**: The app uses Next.js 16 + React 19 which requires Vercel's Node.js 20+ runtime (default).

## 🧪 Development Commands

```bash
npm run dev      # Start dev server (Turbopack)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint (flat config)
```

## 📄 License

MIT — Feel free to adapt for your own celebrations!

---