import { NextRequest, NextResponse } from 'next/server'
import { getSongById } from '@/lib/server/db-actions'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const song = await getSongById(id)

    if (!song) {
      return NextResponse.json(
        { success: false, error: 'Song not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: song,
    })
  } catch (error) {
    console.error('[API] Error fetching song:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch song' },
      { status: 500 }
    )
  }
}
