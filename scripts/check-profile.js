// Check if user profile exists
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function checkProfile() {
  try {
    console.log('Checking user profiles...')
    
    // Get all profiles to see what exists
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
    
    if (error) {
      console.error('Error fetching profiles:', error)
      return
    }
    
    console.log(`Found ${profiles?.length || 0} profiles:`)
    profiles?.forEach((profile, index) => {
      console.log(`${index + 1}. Email: ${profile.email}, Role: ${profile.role}, Verified: ${profile.is_verified}`)
    })
    
    // Test specific email patterns
    const testEmails = ['test@jobhouse.com', 'admin@jobhouse.com', 'user@example.com']
    
    for (const email of testEmails) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single()
      
      if (profile) {
        console.log(`\n✅ Found profile for ${email}:`)
        console.log(`   Role: ${profile.role}`)
        console.log(`   Name: ${profile.full_name}`)
        console.log(`   Verified: ${profile.is_verified}`)
        console.log(`   Created: ${profile.created_at}`)
      } else {
        console.log(`\n❌ No profile found for ${email}`)
      }
    }
    
  } catch (error) {
    console.error('Check error:', error)
  }
}

checkProfile()
