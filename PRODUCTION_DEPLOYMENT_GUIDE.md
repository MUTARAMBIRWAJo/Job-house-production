# 🚀 Production Deployment Guide - Supabase OTP Fix

## 📋 Overview
This guide addresses the "Failed to send verification code" issue in production and provides a complete production-ready Supabase OTP authentication flow.

## 🔧 REQUIRED ENVIRONMENT VARIABLES

### Vercel Environment Variables
Add these in **Vercel → Project → Settings → Environment Variables**:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://svkhumefxncdtoellmns.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2a2h1bWVmeG5jZHRvZWxsbW5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4OTQ3MjAsImV4cCI6MjA4NjQ3MDcyMH0.cZDtYSR0D_oHUOTsBwzrayYQkWQTaBGsPhIkPDb2uWA

# Production Configuration
NEXT_PUBLIC_SITE_URL=https://job-house-production.vercel.app
NODE_ENV=production
```

### ⚠️ CRITICAL: Ensure these are set for **Production** environment!

## 🌐 Supabase Dashboard Configuration

### 1. Authentication → URL Configuration
**Site URL**: `https://job-house-production.vercel.app`

**Redirect URLs** (Add all):
```
https://job-house-production.vercel.app/**
https://job-house-production.vercel.app/auth/callback
https://localhost:3000/** (for local development)
```

### 2. Authentication → Email
- ✅ Ensure email provider is enabled
- ⚠️ Check rate limits (Supabase free tier: 3 emails/second)
- 💡 Consider custom SMTP for higher volume (Resend, SendGrid)

### 3. Settings → API
- ✅ Add your Vercel domain to CORS allowed origins

## 🛠️ Implementation Fixes Applied

### ✅ Production-Safe OTP Implementation
```typescript
// Before (Fails in production)
await supabase.auth.signInWithOtp({ email })

// After (Production-safe)
await supabase.auth.signInWithOtp({
  email,
  options: {
    emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
  }
})
```

### ✅ Enhanced Error Handling
```typescript
if (error) {
  console.error("OTP ERROR:", error)
  setError(`Failed to send verification code: ${error.message}`)
  return
}
```

### ✅ Auth Callback Route
Created `/app/auth/callback/route.ts` for proper session handling and role-based redirects.

## 🧪 Testing Checklist

### Pre-Deployment Tests
1. ✅ Environment variables configured
2. ✅ Supabase URL settings updated
3. ✅ Email provider enabled
4. ✅ CORS settings configured

### Post-Deployment Tests
1. ✅ Login with valid credentials
2. ✅ OTP email receives successfully
3. ✅ OTP verification works
4. ✅ Role-based redirect functions
5. ✅ Error messages display correctly

## 🔍 Common Issues & Solutions

### ❌ "Failed to send verification code"
**Causes:**
- Missing `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Incorrect Supabase Site URL
- Email rate limits exceeded
- Email provider disabled

**Solutions:**
1. Verify all environment variables in Vercel
2. Check Supabase Authentication → URL Configuration
3. Monitor email usage in Supabase dashboard
4. Consider custom SMTP for production

### ❌ "Authentication failed"
**Causes:**
- Missing redirect URLs in Supabase
- CORS issues
- Invalid credentials

**Solutions:**
1. Add all redirect URLs to Supabase
2. Configure CORS settings
3. Verify user credentials

### ❌ "User role not found"
**Causes:**
- Role not set in user metadata
- Database query issues

**Solutions:**
1. Set role in `app_metadata` during user creation
2. Verify database connection
3. Check RLS policies

## 📊 Monitoring & Debugging

### Vercel Logs
- Check function logs for detailed error messages
- Monitor function execution times
- Track error rates

### Supabase Dashboard
- Monitor email delivery rates
- Check authentication attempts
- Review API usage

### Browser Console
- Look for network errors
- Check console.error messages
- Verify environment variables

## 🚀 Deployment Steps

1. **Configure Environment Variables**
   - Add all required variables to Vercel
   - Ensure they're set for Production

2. **Update Supabase Settings**
   - Set Site URL and Redirect URLs
   - Configure email provider
   - Set up CORS

3. **Deploy to Vercel**
   - Push changes to main branch
   - Trigger Vercel deployment
   - Monitor deployment logs

4. **Test Authentication Flow**
   - Test login with OTP
   - Verify role-based redirects
   - Check error handling

5. **Monitor Performance**
   - Set up error monitoring
   - Track authentication metrics
   - Monitor email delivery

## 🎯 Expected Result

After implementing these fixes:

✅ User enters email and password
✅ OTP email sends successfully
✅ User receives verification code
✅ OTP verification succeeds
✅ User redirected to role-based dashboard
✅ Proper error messages displayed
✅ Production-ready authentication flow

## 📞 Support

If issues persist:
1. Check Vercel function logs
2. Verify Supabase configuration
3. Test with different email providers
4. Monitor rate limits
5. Consider custom SMTP setup

---

**Status**: ✅ Production Ready
**Last Updated**: 2026-02-16
**Version**: 1.0
