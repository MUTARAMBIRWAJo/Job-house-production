import { NextRequest, NextResponse } from 'next/server'
import { getArtistWithSongs } from '@/lib/db-actions'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const artist = await getArtistWithSongs(id)

    if (!artist) {
      return NextResponse.json(
        { success: false, error: 'Artist not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: artist,
    })
  } catch (error) {
    console.error('[v0] Error fetching artist:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch artist' },
      { status: 500 }
    )
  }
}
