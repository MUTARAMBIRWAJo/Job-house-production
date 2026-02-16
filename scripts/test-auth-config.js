// Test Supabase Auth Configuration (Server-side)
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function testAuthConfig() {
  console.log('🔍 SUPABASE AUTH CONFIGURATION TEST')
  console.log('=====================================')
  
  // Test 1: Check if we can connect to Supabase
  try {
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('❌ SUPABASE CONNECTION ERROR:', error.message)
      return false
    }
    
    console.log('✅ Supabase connection successful')
    console.log('Environment:', process.env.NODE_ENV)
    console.log('Site URL:', process.env.NEXT_PUBLIC_SITE_URL)
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    
    // Test 2: Try to send OTP to check email provider
    console.log('\n📧 Testing email provider...')
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: 'test-auth@jobhouse.com',
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
      }
    })
    
    if (otpError) {
      console.error('❌ EMAIL PROVIDER ERROR:', {
        message: otpError.message,
        status: otpError.status,
        code: otpError.code || 'NO_CODE'
      })
      
      // Specific error analysis
      if (otpError.message.includes('disabled')) {
        console.log('🚫 DIAGNOSIS: Email provider is DISABLED in Supabase Dashboard')
        console.log('🔧 SOLUTION: Go to Supabase → Authentication → Email Settings → Enable email provider')
      }
      else if (otpError.message.includes('rate limit') || otpError.status === 429) {
        console.log('🚫 DIAGNOSIS: Rate limit exceeded')
        console.log('🔧 SOLUTION: Wait 10-30 minutes or upgrade Supabase plan')
      }
      else if (otpError.message.includes('confirmation')) {
        console.log('🚫 DIAGNOSIS: Email confirmation required')
        console.log('🔧 SOLUTION: Check if user email is confirmed in Supabase → Users')
      }
      else {
        console.log('🚫 DIAGNOSIS: General email provider failure')
        console.log('🔧 SOLUTION: Check Supabase Dashboard logs for detailed error')
      }
      
      return false
    } else {
      console.log('✅ EMAIL PROVIDER WORKING: OTP should be sent to test-auth@jobhouse.com')
      return true
    }
  } catch (error) {
    console.error('❌ UNEXPECTED ERROR:', error)
    return false
  }
}

// Main execution
async function main() {
  console.log('🚀 SUPABASE AUTH CONFIGURATION DIAGNOSTIC')
  console.log('=====================================')
  
  const isWorking = await testAuthConfig()
  
  console.log('\n🎯 DIAGNOSTIC RESULTS:')
  if (isWorking) {
    console.log('✅ Email provider is working correctly')
    console.log('📋 NEXT STEPS:')
    console.log('1. Test with real user email in your application')
    console.log('2. Check email inbox (including spam folder)')
    console.log('3. If still failing, use password-only login option')
  } else {
    console.log('❌ Email provider has issues')
    console.log('📋 IMMEDIATE FIXES:')
    console.log('1. Use password-only login option (already implemented)')
    console.log('2. Check Supabase Dashboard → Authentication → Email Settings')
    console.log('3. Verify email provider is enabled')
    console.log('4. Check rate limits in Supabase → Logs → Auth')
    console.log('5. Ensure redirect URLs are configured correctly')
  }
  
  console.log('\n🔧 QUICK FIXES TO TRY:')
  console.log('1. Restart dev server: npm run dev')
  console.log('2. Clear browser cache')
  console.log('3. Try different browser')
  console.log('4. Check network/firewall blocking Supabase')
}

if (require.main === module) {
  main().catch(console.error)
}
