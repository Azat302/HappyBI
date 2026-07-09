# Quiz302

Modern multiplayer quiz application built with Next.js 15, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🎮 Multiplayer real-time quiz gameplay
- 📱 Mobile-first responsive design
- 🎨 Modern dark theme with smooth animations
- 👥 Player and admin roles
- 📺 Host screen for projecting
- ⚡ Supabase Realtime for instant updates

## Tech Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Supabase** - Backend and realtime database
- **Framer Motion** - Animations
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Setup

1. **Clone or create the project**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project
   - Go to SQL Editor and run the schema from `sql/schema.sql`
   - Get your project URL and anon key from Project Settings → API

4. **Configure environment variables**
   - Copy `.env.example` to `.env.local`
   - Fill in your Supabase credentials:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
     ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open the app**
   - Visit [http://localhost:3000](http://localhost:3000)

## Usage

### Joining as a Player
- Enter game code: `302`
- Enter your name
- Click "Войти"

### Admin Panel
- Enter game code: `302302`
- Access admin controls:
  - Start/stop game
  - Navigate questions
  - Manage players
  - Open host screen

### Host Screen
- Click "Экран ведущего" in admin panel
- Project this screen for all players to see

## Project Structure

```
quiz302/
├── app/                    # Next.js app router pages
│   ├── admin/             # Admin panel
│   ├── host/              # Host screen
│   ├── player/            # Player interface
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── hooks/                 # React hooks
│   └── useGame.ts         # Game state management
├── lib/                   # Utilities and types
│   ├── supabase.ts        # Supabase client
│   └── types.ts           # TypeScript types
├── sql/                   # Database schema
│   └── schema.sql         # Supabase SQL schema
├── package.json
└── ...config files
```

## Database Schema

The application uses the following tables:
- `games` - Game sessions
- `players` - Connected players
- `questions` - Quiz questions
- `media` - Question media (images/videos)
- `answers` - Player answers
- `leaderboard` - Game rankings
- `game_state` - Current game state

## Deployment

The app is ready to deploy on Vercel:
1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy!

## License

MIT
