// Test user creation script with fallback
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function createTestUser() {
  try {
    console.log('Creating test user with fallback...')
    
    // Step 1: Create user without email confirmation
    const { data, error } = await supabase.auth.signUp({
      email: 'test@jobhouse.com',
      password: 'test123456',
      options: {
        data: {
          full_name: 'Test User',
          role: 'customer'
        }
      }
    })

    if (error) {
      console.log('Email signup failed (expected):', error.message)
      
      // Try direct user creation using admin API if available
      // For now, let's check if user already exists
      console.log('Checking if user already exists...')
    } else {
      console.log('User created successfully:', data.user?.id)
    }

    // Step 2: Try to create profile directly (bypass email)
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'test@jobhouse.com',
      password: 'test123456'
    })

    if (signInError) {
      console.log('User does not exist yet, need to create manually')
      console.log('Please register through the website UI to create test user')
      return
    }

    if (signInData.user) {
      console.log('User exists and can sign in:', signInData.user.id)
      
      // Check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', signInData.user.id)
        .single()

      if (profileError || !profile) {
        console.log('Creating profile for existing user...')
        const { error: createProfileError } = await supabase
          .from('profiles')
          .insert({
            id: signInData.user.id,
            email: 'test@jobhouse.com',
            full_name: 'Test User',
            role: 'customer',
            is_verified: true
          })

        if (createProfileError) {
          console.error('Error creating profile:', createProfileError)
        } else {
          console.log('Profile created successfully')
        }
      } else {
        console.log('Profile already exists:', profile)
      }
    }

  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

createTestUser()
