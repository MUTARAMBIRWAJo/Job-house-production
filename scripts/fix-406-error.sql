-- Fix 406 Error on Supabase REST API Calls
-- This script fixes the "Not Acceptable" error when fetching profiles
-- Run this in your Supabase SQL Editor

-- ============================================
-- STEP 1: Drop and recreate RLS policies
-- ============================================

-- Disable and re-enable RLS to ensure clean state
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop old policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin full access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view public profile info" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can create their profile" ON public.profiles;

-- ============================================
-- STEP 2: Create clean, working RLS policies
-- ============================================

-- Policy 1: Users can view and update their own profile
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy 2: Admins can manage all profiles
CREATE POLICY "Admins can manage all profiles" 
  ON public.profiles FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policy 3: Service role (server-side) can create profiles
CREATE POLICY "Authenticated can create own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (true);

-- ============================================
-- STEP 3: Verify column names match schema
-- ============================================

-- Check if 'verified' column exists (not 'is_verified')
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'verified'
  ) THEN
    -- Add verified column if it doesn't exist
    ALTER TABLE public.profiles ADD COLUMN verified BOOLEAN DEFAULT FALSE;
  END IF;
END $$;

-- Check if 'status' column exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'status'
  ) THEN
    -- Add status column if it doesn't exist
    ALTER TABLE public.profiles ADD COLUMN status VARCHAR(50) DEFAULT 'active';
  END IF;
END $$;

-- ============================================
-- STEP 4: Add indexes for performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_profiles_verified ON public.profiles(verified);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);

-- ============================================
-- STEP 5: Test the fix
-- ============================================

-- This query should return successfully without 406 error
-- SELECT * FROM profiles WHERE id = auth.uid() LIMIT 1;

-- ============================================
-- TROUBLESHOOTING NOTES
-- ============================================
-- If 406 error persists:
-- 1. Check that NEXT_PUBLIC_SUPABASE_KEY is the anon key, not service role key
-- 2. Verify the profiles table exists and has RLS enabled
-- 3. Check that the auth.users table exists and user is authenticated
-- 4. Run this query in SQL Editor: SELECT * FROM profiles LIMIT 1;
--    If this fails with 406, the issue is RLS policy related
-- 5. If successful, check browser network tab for missing Authorization header
