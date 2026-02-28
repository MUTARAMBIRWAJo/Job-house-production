import { NextResponse } from 'next/server'
import { getStoreStats } from '@/lib/server/db-actions'

export async function GET() {
  try {
    const stats = await getStoreStats()

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('[v0] Error fetching stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
