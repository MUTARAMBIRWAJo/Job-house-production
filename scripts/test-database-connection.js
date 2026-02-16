#!/usr/bin/env node

/**
 * Test script to verify database connection and fetch real data
 * Run this script to check if the Supabase connection is working
 * and if data is being fetched correctly
 */

const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing environment variables')
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function testDatabaseConnection() {
  console.log('🚀 Testing database connection...\n')

  try {
    // Test 1: Check if we can connect to Supabase
    console.log('1. Testing Supabase connection...')
    const { data: test, error: testError } = await supabase.from('songs').select('count(*)').limit(1)
    
    if (testError) {
      console.error('❌ Supabase connection failed:', testError.message)
      return
    }
    console.log('✅ Supabase connection successful\n')

    // Test 2: Fetch songs
    console.log('2. Testing songs fetch...')
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
      console.error('❌ Songs fetch failed:', songsError.message)
    } else {
      console.log(`✅ Songs fetched: ${songs?.length || 0} records`)
      if (songs && songs.length > 0) {
        console.log('   Sample song:', {
          id: songs[0].id,
          title: songs[0].title,
          artist_name: songs[0].artist_name,
          artist: songs[0].artists?.name
        })
      }
    }
    console.log()

    // Test 3: Fetch artists
    console.log('3. Testing artists fetch...')
    const { data: artists, error: artistsError } = await supabase
      .from('artists')
      .select('*')
      .eq('verified_status', true)
      .order('created_at', { ascending: false })
      .limit(6)

    if (artistsError) {
      console.error('❌ Artists fetch failed:', artistsError.message)
    } else {
      console.log(`✅ Artists fetched: ${artists?.length || 0} records`)
      if (artists && artists.length > 0) {
        console.log('   Sample artist:', {
          id: artists[0].id,
          name: artists[0].name,
          verified: artists[0].verified_status
        })
      }
    }
    console.log()

    // Test 4: Fetch events
    console.log('4. Testing events fetch...')
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true })
      .limit(6)

    if (eventsError) {
      console.error('❌ Events fetch failed:', eventsError.message)
    } else {
      console.log(`✅ Events fetched: ${events?.length || 0} records`)
      if (events && events.length > 0) {
        console.log('   Sample event:', {
          id: events[0].id,
          title: events[0].title,
          event_type: events[0].event_type,
          event_date: events[0].event_date
        })
      }
    }
    console.log()

    // Test 5: Fetch news
    console.log('5. Testing news fetch...')
    const { data: news, error: newsError } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(6)

    if (newsError) {
      console.error('❌ News fetch failed:', newsError.message)
    } else {
      console.log(`✅ News fetched: ${news?.length || 0} records`)
      if (news && news.length > 0) {
        console.log('   Sample news:', {
          id: news[0].id,
          title: news[0].title,
          category: news[0].category
        })
      }
    }
    console.log()

    // Test 6: Check RLS policies
    console.log('6. Testing RLS policies...')
    const { data: rlsTest, error: rlsError } = await supabase
      .from('songs')
      .select('count(*)')

    if (rlsError) {
      console.error('❌ RLS policy check failed:', rlsError.message)
      console.log('   This might indicate RLS policies are blocking public access')
    } else {
      console.log('✅ RLS policies allow public access')
    }
    console.log()

    console.log('🎉 Database connection test completed!')
    console.log('\n📋 Summary:')
    console.log(`   - Songs: ${songs?.length || 0} records`)
    console.log(`   - Artists: ${artists?.length || 0} records`)
    console.log(`   - Events: ${events?.length || 0} records`)
    console.log(`   - News: ${news?.length || 0} records`)

    if ((songs?.length || 0) > 0 && (artists?.length || 0) > 0 && (events?.length || 0) > 0 && (news?.length || 0) > 0) {
      console.log('\n✅ All data is accessible! The website should now display content.')
    } else {
      console.log('\n⚠️  Some data is missing. Check if RLS policies are blocking access.')
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
  }
}

// Run the test
testDatabaseConnection()