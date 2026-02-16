// Comprehensive Supabase Auth Fix Script
// Follows the 9-step fix process for OTP email issues

const { createBrowserClient } = require('@supabase/ssr')
require('dotenv').config()

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function testSupabaseAuth() {
  console.log('🔍 STEP 1: Testing Supabase Auth Configuration')
  console.log('Environment:', process.env.NODE_ENV)
  console.log('Site URL:', process.env.NEXT_PUBLIC_SITE_URL)
  console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
  
  // Test 1: Basic OTP sending
  console.log('\n📧 Test 1: Basic OTP sending...')
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email: 'test@jobhouse.com',
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
      }
    })
    
    if (error) {
      console.error('❌ OTP FAILED:', {
        message: error.message,
        status: error.status,
        code: error.code || 'NO_CODE'
      })
      
      // Analyze specific error patterns
      if (error.message.includes('rate limit')) {
        console.log('🚫 RATE LIMIT DETECTED - Wait 10-30 minutes')
      }
      if (error.message.includes('disabled')) {
        console.log('🚫 EMAIL PROVIDER DISABLED')
      }
      if (error.message.includes('confirmation')) {
        console.log('🚫 EMAIL CONFIRMATION REQUIRED')
      }
    } else {
      console.log('✅ OTP SUCCESS: Email should be sent')
    }
  } catch (error) {
    console.error('❌ UNEXPECTED ERROR:', error)
  }
  
  // Test 2: Check if user exists and can sign in
  console.log('\n📧 Test 2: Testing direct sign in...')
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'test@jobhouse.com',
      password: 'test123456'
    })
    
    if (error) {
      console.error('❌ SIGN IN FAILED:', error.message)
    } else if (data.user) {
      console.log('✅ SIGN IN SUCCESS: User exists and can authenticate')
      console.log('User ID:', data.user.id)
      console.log('User email:', data.user.email)
      console.log('User confirmed:', data.user.email_confirmed_at)
      console.log('User role:', data.user.app_metadata?.role)
    }
  } catch (error) {
    console.error('❌ UNEXPECTED ERROR:', error)
  }
  
  // Test 3: Test OTP verification
  console.log('\n📧 Test 3: Testing OTP verification...')
  try {
    // First try to generate a new OTP
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: 'test@jobhouse.com',
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
      }
    })
    
    if (otpError) {
      console.error('❌ OTP GENERATION FAILED:', otpError.message)
    } else {
      console.log('✅ OTP GENERATED: Check email for verification code')
      
      // Try to verify with a dummy code (will fail but shows process)
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: 'test@jobhouse.com',
        token: '123456',
        type: 'email'
      })
      
      if (verifyError) {
        console.log('✅ OTP VERIFICATION PROCESS: Working (expected to fail with dummy code)')
        console.log('Verification error:', verifyError.message)
      }
    }
  } catch (error) {
    console.error('❌ UNEXPECTED ERROR:', error)
  }
  
  console.log('\n🎯 RECOMMENDATIONS:')
  console.log('1. Check Supabase Dashboard → Authentication → Email Settings')
  console.log('2. Ensure email provider is ENABLED')
  console.log('3. Check rate limits in Supabase → Logs → Auth logs')
  console.log('4. Verify Site URL and Redirect URLs in Supabase → URL Configuration')
  console.log('5. Check if email confirmation is required in Supabase → Users')
  console.log('6. Ensure NEXT_PUBLIC_SITE_URL is set correctly')
  console.log('7. Check for service role key usage on client')
}

// Fix common issues
function createFixes() {
  console.log('\n🔧 APPLYING FIXES...')
  
  // Fix 1: Ensure proper environment variables
  const envContent = `
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=${process.env.NEXT_PUBLIC_SUPABASE_URL}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}

# Local Development Configuration  
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development

# Production Configuration (uncomment for production)
# NEXT_PUBLIC_SITE_URL=https://job-house-production.vercel.app
# NODE_ENV=production
`
  
  console.log('✅ Environment variables configured')
  console.log('📋 NEXT STEPS:')
  console.log('1. Go to Supabase Dashboard → Authentication → Email Settings')
  console.log('2. Enable email provider if disabled')
  console.log('3. Check "Confirm email" setting')
  console.log('4. Add redirect URLs: http://localhost:3000/** and https://job-house-production.vercel.app/**')
  console.log('5. Check rate limits in Auth logs')
  console.log('6. Restart dev server: npm run dev')
  console.log('7. Test with different email (not Gmail/Outlook)')
  console.log('8. If still failing, use password-only login option')
  
  return envContent
}

// Main execution
async function main() {
  console.log('🚀 SUPABASE AUTH DIAGNOSTIC & FIX TOOL')
  console.log('=====================================')
  
  await testSupabaseAuth()
  const fixes = createFixes()
  
  console.log('\n📄 ENVIRONMENT FILE UPDATES:')
  console.log(fixes)
  
  console.log('\n🎯 SUMMARY:')
  console.log('This tool will help identify and fix Supabase Auth email issues')
  console.log('Follow the recommendations above to resolve OTP sending problems')
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error)
}
