-- Fix RLS policies for profiles table
-- Run this in Supabase SQL Editor

-- Drop problematic policies
DROP POLICY IF EXISTS "Admin full access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public can view verified profiles" ON public.profiles;

-- Create simpler, more permissive policies that won't cause 500 errors

-- Allow authenticated users to view all profiles (for admin purposes)
CREATE POLICY "Authenticated users can view all profiles" 
  ON public.profiles FOR SELECT 
  TO authenticated
  USING (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile v2" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow anyone to view verified profiles (public read)
CREATE POLICY "Anyone can view verified profiles v2" 
  ON public.profiles FOR SELECT 
  USING (verified = true);

-- Allow service role to insert (handled server-side)
-- This policy is permissive but only works with service role key
CREATE POLICY "Service role can manage profiles" 
  ON public.profiles FOR ALL 
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Allow authenticated users to insert their own profile
CREATE POLICY "Users can insert own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id OR auth.role() = 'service_role');

-- Verify the policies
SELECT policyname, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'profiles';
