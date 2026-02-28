-- ============================================
-- COMPLETE DATABASE FIX FOR JOB HOUSE PRODUCTION
-- Run this in Supabase SQL Editor
-- ============================================

-- ============================================
-- STEP 1: Check if profiles table exists
-- ============================================

-- Try to check if table exists, if not create it
DO $$
BEGIN
  -- Check if table exists
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    -- Create profiles table
    CREATE TABLE public.profiles (
      id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
      email TEXT NOT NULL,
      full_name TEXT,
      role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'artist', 'customer', 'editor')),
      avatar_url TEXT,
      phone TEXT,
      bio TEXT,
      verified BOOLEAN DEFAULT FALSE,
      two_factor_enabled BOOLEAN DEFAULT FALSE,
      two_factor_secret TEXT,
      status VARCHAR(50) DEFAULT 'active',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    RAISE NOTICE 'Created profiles table';
  ELSE
    RAISE NOTICE 'Profiles table already exists';
  END IF;
END
$$;

-- ============================================
-- STEP 2: Enable RLS on profiles
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 3: Drop existing RLS policies
-- ============================================

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin full access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public can view verified profiles" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view verified profiles" ON public.profiles;
DROP POLICY IF EXISTS "Service role can create profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- ============================================
-- STEP 4: Create proper RLS policies
-- ============================================

-- Policy 1: Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Policy 2: Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Policy 3: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy 4: Public can view verified profiles
CREATE POLICY "Public can view verified profiles"
  ON public.profiles
  FOR SELECT
  USING (verified = true);

-- ============================================
-- STEP 5: Create trigger for auto-profile creation
-- ============================================

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create function to auto-create profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(LOWER(NEW.raw_user_meta_data->>'role'), 'customer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- STEP 6: Verify setup
-- ============================================

-- Check RLS policies
SELECT 
  policyname, 
  cmd, 
  qual::text,
  with_check::text
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY policyname;

-- Check table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'profiles'
ORDER BY ordinal_position;

-- ============================================
-- COMPLETE!
-- ============================================

SELECT 'Database fix complete!' as status;
