import { NextRequest, NextResponse } from 'next/server'
import { createStudioLead, getStudioServices } from '@/lib/db-actions'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const { artist_name, email, phone, service_type, genre, budget, description, timeline } = data

    // Validation
    if (!artist_name || !email || !service_type) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const lead = await createStudioLead({
      artist_name,
      email,
      phone,
      service_type,
      genre,
      budget: budget ? parseFloat(budget) : undefined,
      description,
      timeline,
    })

    return NextResponse.json({
      success: true,
      data: lead,
      message: 'Studio request submitted successfully',
    })
  } catch (error) {
    console.error('[v0] Error submitting studio request:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit studio request' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    const services = await getStudioServices({ limit, offset })

    return NextResponse.json({
      success: true,
      data: services,
      pagination: { limit, offset },
    })
  } catch (error) {
    console.error('[v0] Error fetching studio services:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch studio services' },
      { status: 500 }
    )
  }
}
