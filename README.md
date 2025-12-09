# Star Habit Hero - MVP

A children's habit tracking app that transforms daily routines into hero missions. Kids complete missions, level up their hero, and parents can track progress and set up reward contracts.

## Features

- **Kid View**: Interactive mission interface where children mark habits as complete
- **Hero Progression**: Level up system based on successful days
- **Parent Dashboard**: Monitor children's progress and view history
- **Onboarding Flow**: Easy setup for child profiles, routines, and family contracts
- **Celebration Animations**: Fun confetti animations when missions are complete

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Auth, Postgres, Storage)
- **Routing**: React Router v6
- **State Management**: React Context API
- **PWA**: Vite PWA Plugin

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API to get your project URL and anon key
3. Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run Database Migrations

In your Supabase project dashboard:

1. Go to SQL Editor
2. Run the contents of `supabase/migrations/001_initial_schema.sql`
3. Run the contents of `supabase/migrations/002_rls_policies.sql`

Alternatively, if you have Supabase CLI installed:

```bash
supabase db push
```

### 4. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Usage

### For Parents

1. **Sign Up**: Create a parent account at the login screen
2. **Onboarding**: Follow the multi-step onboarding to:
   - Create a child profile with name, age group, and avatar
   - Set up morning routine habits
   - Define a family contract (reward agreement)
3. **Dashboard**: View all your children's progress
4. **Child Details**: Click on a child to see their 14-day history
5. **Kid View**: Hand off the device to your child using the "Open Kid View" button

### For Kids

1. Parent navigates to Kid View (`/kid/:childId`)
2. Child sees their hero avatar and level
3. Child marks each mission as "Done" when completed
4. When all missions are done, celebration animation plays!
5. Hero levels up every 5 successful days

## Project Structure

```
src/
├── components/
│   ├── ui/          # Reusable UI components
│   ├── kid/         # Kid-specific components
│   └── parent/      # Parent-specific components
├── pages/           # Main page components
├── contexts/        # React Context providers
├── services/        # API service layer
├── lib/             # Utilities and types
└── App.tsx          # Main app with routing
```

## Environment Variables

Required environment variables:

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Database Schema

- **children**: Child profiles with avatar, age group, and reward contract
- **habits**: Daily habits/missions for each child
- **habit_logs**: Daily completion records
- **hero_progress**: Hero level and successful days count

## MVP Scope

**Included:**
- Morning routine tracking
- Hero level progression (5 levels)
- Parent dashboard with 14-day history
- Family contract display
- Celebration animations

**Not Included (Future):**
- Photo proof feature
- AI-powered weekly reports
- Multiple routine types
- Native mobile apps
- Automatic screen time control

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Browser Support

Modern browsers with ES6+ support. Mobile-first responsive design.

## License

Private project for family use.

