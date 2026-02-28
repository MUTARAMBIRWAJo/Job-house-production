-- Fix RLS policies for profiles table to resolve 500 error
-- Run this in Supabase SQL Editor
-- This fixes the "GET profiles 500 Internal Server Error"

-- ============================================
-- STEP 1: Drop all existing policies
-- ============================================
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin full access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public can view verified profiles" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view verified profiles" ON public.profiles;
DROP POLICY IF EXISTS "Service role can create profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile v2" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view verified profiles v2" ON public.profiles;
DROP POLICY IF EXISTS "Service role can manage profiles" ON public.profiles;

-- ============================================
-- STEP 2: Create simplified working policies
-- ============================================

-- Policy 1: Allow authenticated users to read any profile
-- This is needed for admin functions and profile lookups
CREATE POLICY "allow_authenticated_read_profiles" 
  ON public.profiles FOR SELECT 
  TO authenticated
  USING (true);

-- Policy 2: Allow users to update their own profile
CREATE POLICY "allow_users_update_own_profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy 3: Allow public read of verified profiles only
CREATE POLICY "allow_public_read_verified_profiles" 
  ON public.profiles FOR SELECT 
  USING (verified = true);

-- Policy 4: Allow INSERT for authenticated users (self-creation)
CREATE POLICY "allow_authenticated_insert_profiles" 
  ON public.profiles FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policy 5: Allow DELETE for users to delete their own profile
CREATE POLICY "allow_users_delete_own_profile" 
  ON public.profiles FOR DELETE 
  USING (auth.uid() = id);

-- ============================================
-- STEP 3: Verify policies were created
-- ============================================
SELECT 
  policyname, 
  cmd, 
  roles::text,
  qual::text,
  with_check::text
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY policyname;

-- ============================================
-- STEP 4: Test the fix
-- ============================================
-- After running this SQL, test by:
-- 1. Login to the app
-- 2. Check browser console for 500 errors on profiles API
-- 3. If still failing, check the Supabase logs for more details
