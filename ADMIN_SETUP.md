# Admin Panel Setup Guide

This guide will help you set up the admin panel with Supabase for managing team members and portfolio items.

## 1. Supabase Project Setup

Your Supabase project is already configured at: `https://dcygsifckcwljbmptxxf.supabase.co`

## 2. Create Database Tables

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/dcygsifckcwljbmptxxf
2. Navigate to **SQL Editor** in the left sidebar
3. Copy and paste the contents of `supabase/schema.sql` and run it

This will create:
- `team_members` table for storing team member profiles
- `portfolio_items` table for storing portfolio projects
- Row Level Security (RLS) policies for public read access and authenticated write access

## 3. Create Admin User

1. Go to **Authentication** > **Users** in Supabase Dashboard
2. Click **Add User** > **Create new user**
3. Enter:
   - Email: `your-admin-email@example.com`
   - Password: `your-secure-password`
4. Click **Create User**

**Important:** This email/password combination will be used to log into the admin panel at `/admin`

## 4. Environment Variables

Your `.env` file already has the required variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://dcygsifckcwljbmptxxf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 5. Access the Admin Panel

1. Start your development server: `npm run dev`
2. Navigate to: `http://localhost:3000/admin`
3. Log in with the admin user credentials you created in step 3

## Admin Panel Features

### Dashboard (`/admin/dashboard`)
- Overview of team members and portfolio items count
- Quick actions to add team members

### Team Management (`/admin/dashboard/team`)
- View all team members in a table
- Search by name, role, or location
- Edit team member details
- Delete team members
- Access portfolio management for each member

### Add/Edit Team Member (`/admin/dashboard/team/new` or `/admin/dashboard/team/[id]`)
- Name, role, location
- Bio and portrait URL
- Languages (array)
- Specialties (array)
- Tools (array)
- Years of experience

### Portfolio Management (`/admin/dashboard/team/[id]/portfolio`)
- Add portfolio items for specific team members
- Edit/delete portfolio items
- Fields: title, category, image URL, description

### All Portfolio (`/admin/dashboard/portfolio`)
- View all portfolio items across all team members
- Quick access to edit each member's portfolio

## SQL Schema Reference

```sql
-- Team Members Table
CREATE TABLE team_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  bio TEXT NOT NULL,
  portrait TEXT,
  languages TEXT[] DEFAULT '{}',
  specialties TEXT[] DEFAULT '{}',
  tools TEXT[] DEFAULT '{}',
  years_experience INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Portfolio Items Table
CREATE TABLE portfolio_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  team_member_id UUID NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  category VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Troubleshooting

### "Invalid login credentials"
- Make sure you created a user in Supabase Authentication
- Check that you're using the correct email and password

### "Permission denied" errors
- Make sure you ran the SQL schema which includes RLS policies
- Verify you're logged in (for write operations)

### Team members not showing on frontend
- The frontend has fallback static data
- Once you add team members via admin panel, they will show instead
- Make sure RLS policy allows public SELECT on team_members

## Security Notes

- The admin panel is protected by Supabase Auth
- Only authenticated users can add/edit/delete data
- Public users can only read team member and portfolio data
- Consider adding additional email domain restrictions in Supabase if needed
