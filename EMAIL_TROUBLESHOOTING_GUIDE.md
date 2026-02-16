# 📧 Email Authentication Troubleshooting Guide

## ❌ Current Issue
```
AuthApiError: Error sending magic link email
Status: 500
Code: unexpected_failure
```

## 🔍 Root Cause Analysis

The error indicates Supabase's email provider is not properly configured or has reached its limits.

## 🛠️ IMMEDIATE SOLUTIONS

### ✅ Solution 1: Use Fallback Authentication (Already Implemented)

Your login page now has two options:
1. **"Sign In with 2FA"** - Uses email OTP (may fail)
2. **"Sign In (Password Only)"** - Direct authentication (works immediately)

Users can now log in successfully using the password-only option while email issues are resolved.

### ✅ Solution 2: Fix Supabase Email Configuration

#### Step 1: Check Supabase Dashboard
Go to: `https://supabase.com/dashboard/project/svkhumefxncdtoellmns`

#### Step 2: Authentication → Email Settings
1. **Enable Email Provider**
   - Toggle "Enable email provider" to ON
   - Choose "Default Supabase email" or custom SMTP

2. **Configure Email Templates**
   - Verify "Confirm signup" template exists
   - Check template variables: `{{ .ConfirmationURL }}`

3. **Check Rate Limits**
   - Free tier: 3 emails/second
   - Check current usage in dashboard

#### Step 3: URL Configuration
Go to: `Authentication → URL Configuration`

**Site URL**: 
```
https://job-house-production.vercel.app
```

**Redirect URLs** (Add all):
```
https://job-house-production.vercel.app/**
https://job-house-production.vercel.app/auth/callback
http://localhost:3000/** (for development)
```

#### Step 4: API Settings
Go to: `Settings → API`
- Add `https://job-house-production.vercel.app` to CORS allowed origins

### ✅ Solution 3: Custom SMTP Setup (Recommended for Production)

If Supabase email continues to fail:

#### Option A: Resend (Recommended)
1. Sign up at [resend.com](https://resend.com)
2. Get API key
3. In Supabase Dashboard → Authentication → Email:
   - Select "Custom SMTP"
   - SMTP Host: `smtp.resend.com`
   - SMTP Port: `587`
   - SMTP User: `resend`
   - SMTP Password: `your_resend_api_key`
   - SMTP Sender: `noreply@yourdomain.com`

#### Option B: SendGrid
1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Create API key
3. Configure SMTP settings in Supabase

## 🧪 Testing Email Configuration

Run the test script to diagnose issues:
```bash
node scripts/test-supabase-email.js
```

## 📊 Common Error Messages & Solutions

### "Error sending confirmation email"
**Cause**: Email provider disabled or misconfigured
**Solution**: Enable email provider in Supabase Dashboard

### "Rate limit exceeded"
**Cause**: Too many emails sent (free tier: 3/second)
**Solution**: Wait or upgrade to Pro plan/custom SMTP

### "Invalid template"
**Cause**: Missing or broken email templates
**Solution**: Recreate email templates in Supabase Dashboard

### "CORS error"
**Cause**: Domain not allowed in API settings
**Solution**: Add your domain to CORS allowed origins

## 🚀 Production Deployment Checklist

### Before Deployment:
- [ ] Email provider enabled in Supabase
- [ ] Site URL configured
- [ ] Redirect URLs added
- [ ] CORS settings updated
- [ ] Email templates verified
- [ ] Test with `node scripts/test-supabase-email.js`

### After Deployment:
- [ ] Test both login methods
- [ ] Monitor email delivery rates
- [ ] Check error logs in Vercel
- [ ] Verify user can authenticate

## 🔄 Current Status

### ✅ Working:
- Password-only authentication (fallback)
- User login and role-based redirects
- Error handling and user feedback
- Production-ready deployment

### ⚠️ Needs Attention:
- Supabase email provider configuration
- Email template setup
- Rate limit monitoring

### 🎯 Next Steps:
1. **Immediate**: Users can log in with "Sign In (Password Only)"
2. **Short-term**: Fix Supabase email configuration
3. **Long-term**: Set up custom SMTP for reliability

## 📞 Support Resources

- **Supabase Dashboard**: https://supabase.com/dashboard
- **Email Docs**: https://supabase.com/docs/guides/auth/auth-email
- **Rate Limits**: https://supabase.com/docs/guides/auth/auth-rate-limits
- **Custom SMTP**: https://supabase.com/docs/guides/auth/auth-smtp

---

**Status**: ✅ Authentication working with fallback method
**Priority**: 🔧 Configure email provider for full 2FA functionality
**Updated**: 2026-02-16
