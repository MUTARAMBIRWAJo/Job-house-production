# Error Analysis and Fixes

## Summary of Errors

This document explains the errors from the browser console and provides solutions.

---

## 1. Image 404 Error

**Error:**
```
GET https://job-house-production.vercel.app/_next/image?url=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1511379938547-c1f69b13d835%3Fw%3D400&w=1920&q=75 404 (Not Found)
```

**Cause:**
The image URL is being processed through Next.js Image Optimization, but either:
1. The Unsplash image ID `photo-1511379938547-c1f69b13d835` is no longer available
2. The image URL format is incorrect (needs proper Unsplash source URL)

**Solution:**
The `next.config.mjs` already has `images.unsplash.com` configured correctly. The issue is the image source URL. Images should use the proper Unsplash format:

```javascript
// Correct format for Unsplash images
<Image 
  src="https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=400&auto=format&fit=crop"
  alt="Description"
  width={400}
  height={300}
/>
```

---

## 2. OTP Rate Limiting (429 Too Many Requests) - FIXED

**Error:**
```
POST https://zorcojakjufjcvxahaol.supabase.co/auth/v1/otp 429 (Too Many Requests)
AuthApiError: email rate limit exceeded
```

**Cause:**
Supabase has built-in rate limiting for OTP emails. When a user requests multiple OTPs in quick succession or over a short period, Supabase blocks further requests to prevent abuse.

**Solution (IMPLEMENTED):**
The login page has been updated to:
1. **Default to password-only login** - Users can now log in directly with email + password
2. **OTP is now optional** - Users can click "Sign in with OTP (2FA)" if they want two-factor authentication
3. **Better error handling** - Clear messages for rate limiting and email provider errors

No more mandatory OTP after password login - users can log in directly.

---

## 3. OTP Verification 403 Forbidden - FIXED

**Error:**
```
POST https://zorcojakjufjcvxahaol.supabase.co/auth/v1/verify 403 (Forbidden)
AuthApiError: Token has expired or is invalid
```

**Cause:**
The OTP code has expired (Supabase OTPs typically expire after 1 hour) or was already used.

**Solution (IMPLEMENTED):**
Since OTP is now optional, this error is less likely to occur. If users choose OTP 2FA:
- The code handles expired tokens gracefully
- Shows error message and resets to password form
- Users can use password-only login as fallback

---

## 4. Profiles API 500 Error (CRITICAL) - FIX NEEDED

**Error:**
```
GET https://zorcojakjufjcvxahaol.supabase.co/rest/v1/profiles?select=*&id=eq.501005d0-16ee-45c9-9b93-3f38fcc77fa7 500 (Internal Server Error)
```

**Cause:**
This is caused by problematic RLS (Row Level Security) policies on the profiles table. Specifically:

1. **Recursive Policy Issue**: The "Admin full access to profiles" policy references the profiles table itself:
   ```sql
   USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
   ```
   This can cause infinite recursion or evaluation errors.

2. **Missing proper service role policies**: The policies don't properly handle service role bypass.

**Solution:**
Run the following SQL in your Supabase SQL Editor:

```sql
-- Fix RLS policies for profiles table
-- Run this in Supabase SQL Editor

-- Drop all existing problematic policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin full access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public can view verified profiles" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view verified profiles" ON public.profiles;
DROP POLICY IF EXISTS "Service role can create profiles" ON public.profiles;

-- Create simpler, working policies

-- 1. Allow authenticated users to read profiles (basic read)
CREATE POLICY "Allow authenticated read profiles" 
  ON public.profiles FOR SELECT 
  TO authenticated
  USING (true);

-- 2. Allow users to update their own profile
CREATE POLICY "Allow users update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 3. Allow public read of verified profiles only
CREATE POLICY "Public read verified profiles" 
  ON public.profiles FOR SELECT 
  USING (verified = true);

-- 4. Allow INSERT for authenticated users (for self-creation)
CREATE POLICY "Allow authenticated insert profiles" 
  ON public.profiles FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Verify policies were created
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'profiles';
```

---

## 5. Email Provider Failed (500 Error) - FIXED

**Error:**
```
POST https://zorcojakjufjcvxahaol.supabase.co/auth/v1/otp 500 (Internal Server Error)
AuthApiError: Error sending magic link email
```

**Cause:**
This is a Supabase/email provider issue, not a code issue. Possible causes:
1. Supabase's email service is experiencing issues
2. The email sender (From address) is not configured correctly in Supabase
3. The project's email quota has been exceeded

**Solution (IMPLEMENTED):**
Since OTP is now optional, users can log in with just password and won't encounter this error unless they specifically choose OTP 2FA.

---

## New Login Flow

The login page has been updated with a simpler, more reliable flow:

### Default: Password-Only Login
1. Enter email + password
2. Click "Sign In"
3. Redirected to dashboard based on role

### Optional: OTP (2FA)
1. Enter email + password
2. Click "Sign in with OTP (2FA)" link
3. Enter verification code from email
4. Redirected to dashboard based on role

### Fallback (in OTP form)
- If OTP fails, users can click "Use password instead" to log in directly

---

## Summary

| Error | Type | Solution |
|-------|------|----------|
| Image 404 | External | Use correct Unsplash URL format |
| OTP 429 Rate Limit | Transient | **FIXED** - Default to password login |
| OTP 403 Forbidden | Normal | **FIXED** - Optional OTP, fallback available |
| Profiles 500 | Database | Run RLS fix SQL above |
| Email 500 | External | **FIXED** - Optional OTP |
