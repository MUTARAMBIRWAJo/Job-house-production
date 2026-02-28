import { NextRequest, NextResponse } from 'next/server'
import { createStudioLead } from '@/lib/server/db-actions'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const lead = await createStudioLead(data)
    return NextResponse.json({ success: true, lead })
  } catch (error) {
    console.error('[v0] Error creating studio lead:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create lead' },
      { status: 500 }
    )
  }
}
