#!/usr/bin/env node

// Script to test Supabase email configuration and diagnose issues
const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase configuration in .env file')
  console.log('Required:')
  console.log('- NEXT_PUBLIC_SUPABASE_URL')
  console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testEmailConfiguration() {
  console.log('🔍 Testing Supabase Email Configuration...\n')
  
  // Test 1: Basic connection
  console.log('1. Testing Supabase connection...')
  try {
    const { data, error } = await supabase.auth.getSession()
    if (error) {
      console.error('❌ Supabase connection failed:', error.message)
      return
    }
    console.log('✅ Supabase connection successful')
  } catch (err) {
    console.error('❌ Supabase connection error:', err.message)
    return
  }
  
  // Test 2: Email OTP with test email
  console.log('\n2. Testing OTP email delivery...')
  const testEmail = 'test@example.com' // This will fail but show the error
  
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: testEmail,
      options: {
        emailRedirectTo: 'http://localhost:3000/auth/callback'
      }
    })
    
    if (error) {
      console.error('❌ Email OTP failed:', error.message)
      console.error('Error details:', error)
      
      // Analyze common error types
      if (error.message.includes('rate limit')) {
        console.log('\n🔧 SOLUTION: Email rate limit exceeded')
        console.log('- Wait a few minutes before trying again')
        console.log('- Supabase free tier: 3 emails/second')
        console.log('- Consider upgrading to Pro plan or custom SMTP')
      } else if (error.message.includes('email') && error.message.includes('disabled')) {
        console.log('\n🔧 SOLUTION: Email provider disabled')
        console.log('1. Go to Supabase Dashboard → Authentication → Email')
        console.log('2. Enable email provider')
        console.log('3. Configure email settings')
      } else if (error.message.includes('template')) {
        console.log('\n🔧 SOLUTION: Email template issue')
        console.log('1. Check email templates in Supabase Dashboard')
        console.log('2. Verify confirm signup template exists')
      } else {
        console.log('\n🔧 SOLUTION: Check Supabase Dashboard settings')
        console.log('1. Authentication → URL Configuration')
        console.log('2. Authentication → Email')
        console.log('3. Settings → API')
      }
    } else {
      console.log('✅ OTP email sent successfully (check your email)')
      console.log('Note: Using test@example.com - this may not deliver but tests the API')
    }
  } catch (err) {
    console.error('❌ Unexpected error:', err.message)
  }
  
  // Test 3: Check project settings
  console.log('\n3. Checking project configuration...')
  console.log(`✅ Supabase URL: ${supabaseUrl}`)
  console.log(`✅ Anon Key: ${supabaseAnonKey.substring(0, 10)}...`)
  
  console.log('\n📋 Required Supabase Dashboard Settings:')
  console.log('1. Authentication → URL Configuration')
  console.log('   - Site URL: http://localhost:3000 (dev) or https://job-house-production.vercel.app (prod)')
  console.log('   - Redirect URLs: http://localhost:3000/**, https://job-house-production.vercel.app/**')
  console.log('2. Authentication → Email')
  console.log('   - Enable email provider')
  console.log('   - Check rate limits and quotas')
  console.log('3. Settings → API')
  console.log('   - Ensure CORS allows your domain')
  
  console.log('\n🚀 Next Steps:')
  console.log('1. Check Supabase Dashboard settings above')
  console.log('2. Try the test again after fixing')
  console.log('3. If still failing, consider custom SMTP (Resend, SendGrid)')
}

testEmailConfiguration().catch(console.error)
