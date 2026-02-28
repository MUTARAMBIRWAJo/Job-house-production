import { NextRequest, NextResponse } from 'next/server'
import { getStudioLeadById, updateStudioLead } from '@/lib/server/db-actions'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const lead = await getStudioLeadById(id)

    if (!lead) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      lead,
    })
  } catch (error) {
    console.error('[v0] Error fetching lead:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch lead' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()

    const updated = await updateStudioLead(id, {
      status: data.status,
      assigned_to: data.assigned_to,
      notes: data.notes,
    })

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      lead: updated,
    })
  } catch (error) {
    console.error('[v0] Error updating lead:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update lead' },
      { status: 500 }
    )
  }
}
