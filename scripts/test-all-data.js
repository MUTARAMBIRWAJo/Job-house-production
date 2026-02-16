/**
 * Comprehensive test to verify all data types are accessible
 */

// Load environment variables
require('dotenv').config()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing environment variables')
  process.exit(1)
}

async function testAllData() {
  try {
    const { createClient } = require('@supabase/supabase-js')
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

    console.log('🔍 Testing all data types...\n')

    // Test Songs
    console.log('1. Testing Songs...')
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
      .limit(6)

    if (songsError) {
      console.error('❌ Songs failed:', songsError.message)
    } else {
      console.log(`✅ Songs: ${songs?.length || 0} records`)
      if (songs && songs.length > 0) {
        console.log('   Sample:', songs[0].title, 'by', songs[0].artist_name)
      }
    }

    // Test Artists
    console.log('\n2. Testing Artists...')
    const { data: artists, error: artistsError } = await supabase
      .from('artists')
      .select('*')
      .eq('verified_status', true)
      .order('created_at', { ascending: false })
      .limit(6)

    if (artistsError) {
      console.error('❌ Artists failed:', artistsError.message)
    } else {
      console.log(`✅ Artists: ${artists?.length || 0} records`)
      if (artists && artists.length > 0) {
        console.log('   Sample:', artists[0].name, '(Verified:', artists[0].verified_status, ')')
      }
    }

    // Test Events
    console.log('\n3. Testing Events...')
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true })
      .limit(6)

    if (eventsError) {
      console.error('❌ Events failed:', eventsError.message)
    } else {
      console.log(`✅ Events: ${events?.length || 0} records`)
      if (events && events.length > 0) {
        console.log('   Sample:', events[0].title, 'Type:', events[0].event_type)
      }
    }

    // Test News
    console.log('\n4. Testing News...')
    const { data: news, error: newsError } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(6)

    if (newsError) {
      console.error('❌ News failed:', newsError.message)
    } else {
      console.log(`✅ News: ${news?.length || 0} records`)
      if (news && news.length > 0) {
        console.log('   Sample:', news[0].title, 'Category:', news[0].category)
      }
    }

    console.log('\n🎉 All data tests completed!')
    console.log('\n📋 Summary:')
    console.log(`   - Songs: ${songs?.length || 0} records`)
    console.log(`   - Artists: ${artists?.length || 0} records`)
    console.log(`   - Events: ${events?.length || 0} records`)
    console.log(`   - News: ${news?.length || 0} records`)

    const allDataAvailable = (songs?.length || 0) > 0 && 
                           (artists?.length || 0) > 0 && 
                           (events?.length || 0) > 0 && 
                           (news?.length || 0) > 0

    if (allDataAvailable) {
      console.log('\n✅ All data is accessible! Your website should now display content.')
    } else {
      console.log('\n⚠️  Some data may still be missing.')
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

testAllData()