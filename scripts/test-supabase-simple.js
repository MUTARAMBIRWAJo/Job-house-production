#!/usr/bin/env node

/**
 * Simple test script using the same Supabase connection as Next.js
 */

// Load environment variables
require('dotenv').config()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔍 Testing Supabase connection...')
console.log('URL:', SUPABASE_URL ? '✅ Set' : '❌ Missing')
console.log('ANON_KEY:', SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing')

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('\n❌ Missing environment variables')
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local')
  process.exit(1)
}

// Use standard Supabase client for testing
async function testConnection() {
  try {
    // Import standard Supabase client
    const { createClient } = require('@supabase/supabase-js')
    
    console.log('\n1. Creating Supabase client...')
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    console.log('✅ Client created successfully')
    
    console.log('\n2. Testing basic query...')
    const { count, error } = await supabase.from('songs').select('*', { count: 'exact' }).limit(1)
    
    if (error) {
      console.error('❌ Query failed:', error.message)
      console.error('Error details:', error)
      return
    }
    
    console.log('✅ Query successful')
    console.log('Songs count:', count || 0)
    
    console.log('\n3. Testing detailed songs query...')
    const { data: songs, error: songsError } = await supabase
      .from('songs')
      .select(`
        *,
        artists:artist_id (
          id,
          name,
          slug,
          avatar_url,
          verified_status
        )
      `)
      .order('created_at', { ascending: false })
      .limit(3)
    
    if (songsError) {
      console.error('❌ Songs query failed:', songsError.message)
      console.error('Error details:', songsError)
      return
    }
    
    console.log(`✅ Songs fetched: ${songs?.length || 0} records`)
    if (songs && songs.length > 0) {
      console.log('\n📊 Sample songs:')
      songs.forEach((song, index) => {
        console.log(`   ${index + 1}. ${song.title} by ${song.artist_name}`)
        if (song.artists) {
          console.log(`      Artist: ${song.artists.name} (Verified: ${song.artists.verified_status})`)
        }
      })
    }
    
    console.log('\n🎉 All tests passed! Database connection is working.')
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    console.error('Stack trace:', error.stack)
  }
}

testConnection()