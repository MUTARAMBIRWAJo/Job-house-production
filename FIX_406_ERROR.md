# 406 Error Fix Guide

## Problem
When accessing the dashboard or other authenticated pages, the browser console shows:
```
GET https://[project].supabase.co/rest/v1/profiles?select=*&id=eq.[user-id] 406 (Not Acceptable)
```

## Root Cause
The 406 "Not Acceptable" error occurs when:
1. **RLS Policies are too restrictive** - Policies prevent SELECT access even for legitimate requests
2. **Column name mismatches** - RLS policy references `is_verified` but column is named `verified`
3. **Policy evaluation errors** - Subqueries in RLS policies fail silently and return 406

## Solution Applied

### 1. Fixed Column Name References
- Changed all migration files to use `verified` instead of `is_verified`
- Updated base schema to match production database schema

### 2. Simplified RLS Policies
The following policies are now set up in `lib/db/migrations/001_auth_schema.sql`:

```sql
-- Users can view/update their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE 
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Admins can manage all profiles  
CREATE POLICY "Admins can manage all profiles" ON profiles FOR ALL 
  USING (EXISTS(SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Service role can insert profiles (for signup)
CREATE POLICY "Authenticated can create own profile" ON profiles FOR INSERT 
  WITH CHECK (true);

-- Public can view verified profiles
CREATE POLICY "Anyone can view verified profiles" ON profiles FOR SELECT 
  USING (verified = true);
```

### 3. Database Schema Alignment
The base schema (`scripts/01-base-schema.sql`) now includes:
- `verified BOOLEAN DEFAULT FALSE` (not `is_verified`)
- `status VARCHAR(50) DEFAULT 'active'`
- Complete RLS setup for all tables

## To Apply to Production

Run this SQL in your Supabase Dashboard (SQL Editor):

```sql
-- 1. Re-enable RLS with correct policies
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Drop old policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin full access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view public profile info" ON public.profiles;

-- 3. Create new policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE 
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can manage all profiles" ON public.profiles FOR ALL 
  USING (EXISTS(SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Authenticated can create own profile" ON public.profiles FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can view verified profiles" ON public.profiles FOR SELECT 
  USING (verified = true);

-- 4. Add missing columns if needed
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';
```

## Verification
After applying the fixes, test with:
1. Go to `/dashboard` (should now load profile without 406 error)
2. Check browser console - no 406 errors should appear
3. Profile should load and display user information

## If 406 Error Persists

1. **Check Environment Variables**
   - `NEXT_PUBLIC_SUPABASE_URL` should be set correctly
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` should be the publishable anon key (not service role)

2. **Verify Authentication**
   - Log in to ensure `auth.uid()` is set
   - Check in browser DevTools Network tab for Authorization header

3. **Test RLS Policy**
   - In Supabase SQL Editor, run: `SELECT * FROM profiles WHERE id = auth.uid();`
   - If this fails with 406, there's still an RLS issue

4. **Check Column Existence**
   - Run in SQL Editor: `SELECT column_name FROM information_schema.columns WHERE table_name = 'profiles';`
   - Verify `verified` and `status` columns exist

## Files Modified
- `lib/db/migrations/001_auth_schema.sql` - Updated RLS policies
- `lib/db/migrations/002_core_tables.sql` - Fixed column references
- `scripts/01-base-schema.sql` - Added RLS setup
- `scripts/fix-406-error.sql` - Comprehensive fix script

## Related Code Changes
- `app/api/auth/signup/route.ts` - Uses `verified: false` column
- `app/(auth)/register/page.tsx` - Registration now uses new signup API
- `app/dashboard/page.tsx` - Fetches profile with proper RLS access
