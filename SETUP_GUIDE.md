# Star Habit Hero - Setup Guide

This guide will walk you through setting up the complete Star Habit Hero application.

## Prerequisites

- Node.js 16+ installed
- A Supabase account (free tier is fine)

## Step 1: Clone and Install

```bash
cd "C:\CURSOR\Star hero"
npm install
```

## Step 2: Set Up Supabase Project

### 2.1 Create a New Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose an organization (or create one)
4. Fill in:
   - **Project Name**: `star-habit-hero` (or any name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
5. Click "Create new project" and wait for setup to complete (~2 minutes)

### 2.2 Get Your API Keys

1. In your Supabase project, go to **Settings** (gear icon) > **API**
2. Copy the following:
   - **Project URL** (starts with `https://`)
   - **anon public** key (long string)

### 2.3 Create Environment File

Create a file named `.env` in the project root:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace with your actual values (no quotes needed).

## Step 3: Run Database Migrations

### Option A: Using Supabase Dashboard (Recommended for MVP)

1. In Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click "New query"
3. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
4. Paste into the SQL editor and click "Run"
5. You should see "Success. No rows returned"
6. Create another new query
7. Copy the entire contents of `supabase/migrations/002_rls_policies.sql`
8. Paste and click "Run"
9. You should see "Success. No rows returned"

### Option B: Using Supabase CLI (Advanced)

If you have Supabase CLI installed:

```bash
supabase db push
```

## Step 4: Verify Database Setup

1. In Supabase dashboard, go to **Database** > **Tables**
2. You should see these tables:
   - `children`
   - `habits`
   - `habit_logs`
   - `hero_progress`

3. Go to **Authentication** > **Policies**
4. Verify that RLS policies are enabled

## Step 5: Start the Application

```bash
npm run dev
```

The app will start at `http://localhost:5173`

## Step 6: Test the Application

### Test Parent Flow:

1. Open `http://localhost:5173`
2. Click "Don't have an account? Sign Up"
3. Create a parent account:
   - Email: `parent@test.com` (or any email)
   - Password: At least 6 characters
4. You'll be redirected to onboarding
5. Complete the onboarding:
   - **Profile**: Enter child name, select age, pick avatar
   - **Routine**: Review/edit morning habits
   - **Contract**: Select reward type and write contract
6. Click "Create Profile"
7. You'll see the handoff screen

### Test Kid View:

1. Click "Start Mission!" button
2. You should see:
   - Hero avatar with level badge
   - "Today's Missions" section
   - List of habit cards
3. Click "Mark Done" on each habit
4. When all done, you'll see celebration animation! 🎉

### Test Dashboard:

1. Go back to parent dashboard (use browser back or navigate to `/parent/dashboard`)
2. You should see your child's card with progress
3. Click on the child card to see detailed history

## Troubleshooting

### "Missing Supabase environment variables"

- Make sure `.env` file exists in project root
- Check that variable names match exactly: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart the dev server after creating `.env`

### "Failed to fetch" or Authentication Errors

- Verify your Supabase project is active (not paused)
- Check that API keys are correct
- Make sure RLS policies were applied (run migration 002 again)

### Database Errors

- Check that both migration files ran successfully
- Verify tables exist in Supabase dashboard > Database > Tables
- Check the SQL Editor for any error messages

### No celebrations showing

- Make sure all habits are marked complete
- Check browser console for errors
- Verify `hero_progress` table has a row for the child

## Production Deployment

For deploying to production (Vercel, Netlify, etc.):

1. Build the app: `npm run build`
2. Set environment variables in your hosting platform
3. Deploy the `dist` folder
4. Update Supabase > Authentication > URL Configuration with your production URL

## Next Steps

Once you've verified everything works:

1. **Customize habits** for your child's routine
2. **Test daily usage** with your family
3. **Gather feedback** from your child
4. **Iterate** on the design and features

## Support

For issues with:
- **Supabase**: Check [Supabase docs](https://supabase.com/docs)
- **React/Vite**: Check [Vite docs](https://vitejs.dev) and [React docs](https://react.dev)
- **Tailwind**: Check [Tailwind docs](https://tailwindcss.com/docs)

Happy habit tracking! ⭐🦸‍♂️

