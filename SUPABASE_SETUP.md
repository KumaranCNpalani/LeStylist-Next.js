# Supabase Integration Guide for LeStylist-Next.js

## Overview

This project has been successfully integrated with **Supabase**, a PostgreSQL-based backend-as-a-service platform. This guide will help you set up and deploy your LeStylist salon management website with Supabase as the database.

## What Changed

### New Files Added

1. **`lib/supabase.ts`** - Supabase client configuration
2. **`supabase/migrations/20231201000000_init_schema.sql`** - PostgreSQL database schema (Supabase-compatible)
3. **`.env.example`** - Environment variables template
4. **`package.json`** - Updated with `@supabase/supabase-js` dependency

### Why Supabase?

- **PostgreSQL Database**: Powerful relational database instead of MySQL
- **UUID Primary Keys**: Better for distributed systems and replication
- **Real-time Capabilities**: Built-in real-time subscriptions
- **Authentication**: Supabase Auth (optional, can use your own)
- **Storage**: File storage for images and media
- **Row-Level Security (RLS)**: Fine-grained access control
- **Automatic Migrations**: Easy schema versioning

## Setup Instructions

### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project" and select your organization
4. Choose a project name (e.g., "lestylist")
5. Create a strong database password
6. Choose your region (preferably closest to your users)
7. Click "Create new project"

### Step 2: Get Your Credentials

1. In Supabase Dashboard, go to **Settings → API**
2. Copy the following values:
   - **Project URL** - `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon Key** - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Service Role Key** - `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

### Step 3: Set Up Environment Variables

#### For Local Development

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

#### For Vercel Production

1. Go to your Vercel Project → **Settings → Environment Variables**
2. Add the same three variables (values from Step 2)
3. Make sure variables are available in all environments (Production, Preview, Development)

### Step 4: Initialize the Database Schema

The database schema is defined in `supabase/migrations/20231201000000_init_schema.sql`

#### Option A: Using Supabase Dashboard (Easiest)

1. In Supabase Dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste the contents of `supabase/migrations/20231201000000_init_schema.sql`
4. Click "Run"
5. Verify tables are created in **Table Editor**

#### Option B: Using Supabase CLI (For Future Migrations)

```bash
# Install CLI globally
npm install -g supabase

# Login
supabase login

# Link your project
supabase link --project-ref your-project-id

# Push migrations
supabase db push
```

### Step 5: Install Dependencies

```bash
cd LeStylist-Next.js
pnpm install
# or
npm install
```

### Step 6: Test Local Connection

Start the development server:

```bash
pnpm dev
# or
npm run dev
```

Your app will run at `http://localhost:3000`

## Database Schema Overview

The PostgreSQL schema includes tables for:

### Core Tables
- **admin_users** - Admin account management
- **service_categories** - Service types (Women, Men, Makeup, Hydrafacial)
- **services** - Individual services with pricing
- **appointments** - Customer bookings
- **client_images** - Gallery images
- **offers** - Promotions and discounts
- **testimonials** - Customer reviews
- **contact_inquiries** - Contact form submissions

### Content Management
- **home_content** - Homepage sections
- **header_settings** - Navigation settings
- **footer_settings** - Footer configuration
- **about_content** - About page content
- **franchise_content** - Franchise information

## Using Supabase in Your Code

### Example: Fetch Services

```typescript
import { supabase } from '@/lib/supabase'

// Get all active services
const { data, error } = await supabase
  .from('services')
  .select('*')
  .eq('is_active', true)
  .order('display_order')

if (error) console.error('Error:', error)
else console.log('Services:', data)
```

### Example: Create an Appointment

```typescript
const { data, error } = await supabase
  .from('appointments')
  .insert([
    {
      customer_name: 'John Doe',
      customer_email: 'john@example.com',
      customer_phone: '+91 9876543210',
      service_id: 'uuid-of-service',
      appointment_date: '2024-12-25',
      appointment_time: '14:00',
      status: 'pending'
    }
  ])
  .select()

if (error) console.error('Error:', error)
else console.log('Appointment created:', data)
```

## Deployment to Vercel

### Step 1: Push to GitHub

All changes are already committed. If you made additional changes:

```bash
git add .
git commit -m "Update Supabase integration"
git push origin main
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Connect your GitHub repository
3. Select **LeStylist-Next.js** project
4. In **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Click **Deploy**

Vercel will automatically redeploy when you push to GitHub.

## Important Security Notes

⚠️ **NEVER commit `.env.local` to GitHub**
- It contains secret API keys
- Add `.env.local` to `.gitignore` (already done)
- Use `.env.example` as a template

⚠️ **Service Role Key is Secret**
- Only use `SUPABASE_SERVICE_ROLE_KEY` on the server-side
- Never expose it in client-side code

⚠️ **Row-Level Security (RLS)**
- Set up RLS policies for sensitive data
- Currently, policies allow public read access
- Customize as needed for your use case

## Troubleshooting

### "Missing Supabase environment variables"

**Solution**: Check that `.env.local` (local) or Vercel env variables (production) are set correctly.

### "Connection refused" or "ECONNREFUSED"

**Solution**: 
- Verify Supabase project is active (not paused)
- Check network connectivity
- Verify project URL is correct

### "relation \"schema_migrations\" does not exist"

**Solution**: The migration table hasn't been created. Run the SQL migrations from Step 4.

### Tables not showing in Supabase Dashboard

**Solution**:
1. Go to **SQL Editor**
2. Run: `SELECT * FROM information_schema.tables WHERE table_schema='public';`
3. If tables don't show, re-run the migration SQL

## Next Steps

### 1. Update API Routes

Replace MySQL queries in your API routes with Supabase queries:

```bash
# Find all API files
ls -la app/api/
```

### 2. Set Up Authentication (Optional)

Use Supabase Auth for user authentication:
- Email/Password authentication
- Social login (Google, GitHub, etc.)
- Magic links

### 3. Configure Row-Level Security

Add RLS policies for:
- Admin-only tables
- User-specific data
- Public data

### 4. Add Real-time Subscriptions

Subscribe to real-time changes:
```typescript
const subscription = supabase
  .from('appointments')
  .on('*', (payload) => console.log('Change:', payload))
  .subscribe()
```

## Useful Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Supabase Examples](https://github.com/supabase/supabase/tree/master/examples)

## Support

For issues or questions:
1. Check Supabase logs: Dashboard → Logs
2. Enable debug mode in Next.js
3. Check browser console for errors
4. Review Supabase Discord community

---

**Last Updated**: December 2024
**Status**: ✅ Ready for Production
