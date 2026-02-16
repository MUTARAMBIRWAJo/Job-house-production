// Test existing user login with fallback
const { createClient } = require('@supabase/supabase-js')
const { signInWithPasswordOnly } = require('../lib/auth/fallback-auth.ts')
require('dotenv').config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function testExistingUser() {
  try {
    console.log('Testing existing user login with fallback...')
    
    // Test with common email patterns
    const testEmails = [
      'test@jobhouse.com',
      'admin@jobhouse.com', 
      'user@example.com',
      'demo@jobhouse.com'
    ]
    
    for (const email of testEmails) {
      console.log(`\nTesting email: ${email}`)
      
      // Try direct password login first
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: 'test123456'
      })
      
      if (error) {
        console.log(`❌ Direct login failed: ${error.message}`)
      } else {
        console.log(`✅ Direct login successful! User ID: ${data.user?.id}`)
        
        // Test fallback method
        const fallbackResult = await signInWithPasswordOnly(email, 'test123456')
        if (fallbackResult.success) {
          console.log(`✅ Fallback login successful! Role: ${fallbackResult.role}`)
        } else {
          console.log(`❌ Fallback login failed: ${fallbackResult.error}`)
        }
      }
    }
    
  } catch (error) {
    console.error('Test error:', error)
  }
}

testExistingUser()
