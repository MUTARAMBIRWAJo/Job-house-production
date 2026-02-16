import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params

    const { data, error } = await supabase
      .from('chord_sheets')
      .select(`
        *,
        songs: song_id (
          id, title, slug, artist_name, artist_id
        ),
        profiles: created_by (
          id, full_name, avatar_url
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('[API] Error fetching chord sheet:', error)
      return NextResponse.json(
        { success: false, error: 'Chord sheet not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: data
    })

  } catch (error) {
    console.error('[API] Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params
    const body = await request.json()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check if user is the creator or an admin
    const { data: chordSheet } = await supabase
      .from('chord_sheets')
      .select('created_by')
      .eq('id', id)
      .single()

    if (!chordSheet || (chordSheet.created_by !== user.id)) {
      // Check if user is admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!profile || profile.role !== 'admin') {
        return NextResponse.json(
          { success: false, error: 'Permission denied' },
          { status: 403 }
        )
      }
    }

    const { data, error } = await supabase
      .from('chord_sheets')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[API] Error updating chord sheet:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to update chord sheet' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: data
    })

  } catch (error) {
    console.error('[API] Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check if user is the creator or an admin
    const { data: chordSheet } = await supabase
      .from('chord_sheets')
      .select('created_by')
      .eq('id', id)
      .single()

    if (!chordSheet || (chordSheet.created_by !== user.id)) {
      // Check if user is admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!profile || profile.role !== 'admin') {
        return NextResponse.json(
          { success: false, error: 'Permission denied' },
          { status: 403 }
        )
      }
    }

    const { error } = await supabase
      .from('chord_sheets')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('[API] Error deleting chord sheet:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to delete chord sheet' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Chord sheet deleted successfully'
    })

  } catch (error) {
    console.error('[API] Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
