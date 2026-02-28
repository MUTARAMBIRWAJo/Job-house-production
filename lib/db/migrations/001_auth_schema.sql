-- JOB HOUSE PRODUCTION - Authentication & User Management Database Schema
-- Run this SQL in your Supabase SQL Editor

-- ============================================
-- PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'customer' 
    CHECK (role IN ('admin', 'artist', 'customer', 'editor')),
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

-- ============================================
-- OTP VERIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.otp_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  purpose TEXT NOT NULL CHECK (purpose IN ('login', 'registration', 'password_reset')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  attempts INTEGER DEFAULT 0,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- USER SESSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES FOR PROFILES
-- ============================================
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admin full access to profiles" ON public.profiles;
CREATE POLICY "Admin full access to profiles" 
  ON public.profiles FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Allow public read for display purposes (no sensitive data)
DROP POLICY IF EXISTS "Anyone can view public profile info" ON public.profiles;
CREATE POLICY "Anyone can view verified profiles" 
  ON public.profiles FOR SELECT 
  USING (verified = true);

-- Allow authenticated users to insert their own profile (for signup)
DROP POLICY IF EXISTS "Authenticated users can create their profile" ON public.profiles;
CREATE POLICY "Authenticated users can create their profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id OR true);

-- ============================================
-- RLS POLICIES FOR OTP VERIFICATIONS
-- ============================================
DROP POLICY IF EXISTS "Users can view own OTP verifications" ON public.otp_verifications;
CREATE POLICY "Users can view own OTP verifications" 
  ON public.otp_verifications FOR SELECT 
  USING (auth.uid() = user_id OR auth.uid() IS NULL);

DROP POLICY IF EXISTS "System can insert OTP" ON public.otp_verifications;
CREATE POLICY "System can insert OTP" 
  ON public.otp_verifications FOR INSERT 
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can delete own OTP" ON public.otp_verifications;
CREATE POLICY "Users can delete own OTP" 
  ON public.otp_verifications FOR DELETE 
  USING (auth.uid() = user_id);

-- ============================================
-- RLS POLICIES FOR USER SESSIONS
-- ============================================
DROP POLICY IF EXISTS "Users can manage own sessions" ON public.user_sessions;
CREATE POLICY "Users can manage own sessions" 
  ON public.user_sessions FOR ALL 
  USING (auth.uid() = user_id);

-- ============================================
-- HANDLER FUNCTION FOR NEW USER CREATION
-- ============================================
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

-- ============================================
-- TRIGGER FOR NEW USER SIGNUP
-- ============================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_otp_verifications_email ON public.otp_verifications(email);
CREATE INDEX IF NOT EXISTS idx_otp_verifications_user_id ON public.otp_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON public.user_sessions(session_token);

-- ============================================
-- SEED ADMIN USER (Optional - for testing)
-- ============================================
-- Note: This requires a user to already exist in auth.users
-- Uncomment and modify after creating first admin user manually

-- INSERT INTO public.profiles (id, email, full_name, role, verified)
-- SELECT id, email, 'Admin User', 'admin', true
-- FROM auth.users
-- WHERE email = 'admin@jobhouseproduction.com'
-- ON CONFLICT (id) DO NOTHING;

-- ============================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================
COMMENT ON TABLE public.profiles IS 'User profiles with role-based access control';
COMMENT ON TABLE public.otp_verifications IS 'OTP verification codes for 2FA and email verification';
COMMENT ON TABLE public.user_sessions IS 'User session tracking for security';

-- ============================================
-- VERIFICATION
-- ============================================
SELECT 
  'profiles' as table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'profiles') as columns
UNION ALL
SELECT 
  'otp_verifications',
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'otp_verifications')
UNION ALL
SELECT 
  'user_sessions',
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'user_sessions');
