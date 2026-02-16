// Create test user directly in Supabase
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function createTestUser() {
  try {
    console.log('Creating test user directly...')
    
    const email = 'demo@jobhouse.com'
    const password = 'demo123456'
    const fullName = 'Demo User'
    const role = 'customer'
    
    // Step 1: Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: fullName,
          role: role
        }
      }
    })
    
    if (authError) {
      console.error('Auth signup failed:', authError.message)
      return
    }
    
    console.log('✅ Auth user created:', authData.user?.id)
    
    // Step 2: Try to create profile (this might fail due to RLS)
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: email,
        full_name: fullName,
        role: role,
        is_verified: true
      })
      .select()
    
    if (profileError) {
      console.error('Profile creation failed:', profileError.message)
      console.log('⚠️  This is expected due to RLS policies')
      console.log('📝  User can still log in with password-only method')
    } else {
      console.log('✅ Profile created successfully')
    }
    
    // Step 3: Test login with both methods
    console.log('\n🧪 Testing login methods...')
    
    // Test direct login
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    })
    
    if (loginError) {
      console.log('❌ Direct login failed:', loginError.message)
    } else {
      console.log('✅ Direct login successful!')
    }
    
    console.log('\n📋 Test Results:')
    console.log(`Email: ${email}`)
    console.log(`Password: ${password}`)
    console.log(`Role: ${role}`)
    console.log('\n💡 Use these credentials to test login on the website')
    console.log('💡 If email OTP fails, use "Sign In (Password Only)" button')
    
  } catch (error) {
    console.error('Create user error:', error)
  }
}

createTestUser()
