import { NextRequest, NextResponse } from 'next/server'
import { getStudioLeads } from '@/lib/db-actions'
import { createClient } from '@/lib/supabase/server'

/**
 * Verify admin authentication
 */
async function verifyAdminAuth() {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { authorized: false, error: 'Unauthorized' }
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return { authorized: false, error: 'Forbidden - Admin access required' }
  }

  return { authorized: true, userId: user.id }
}

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const auth = await verifyAdminAuth()

    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')
    const status = searchParams.get('status') || undefined
    const priority = searchParams.get('priority') || undefined
    const search = searchParams.get('search') || undefined
    const sortBy = (searchParams.get('sortBy') || 'newest') as 'newest' | 'oldest'

    const leads = await getStudioLeads({
      limit,
      offset,
      status: status as any,
      priority: priority as any,
      search,
      sortBy,
    })

    return NextResponse.json({
      success: true,
      leads,
      pagination: { limit, offset },
    })
  } catch (error) {
    console.error('[v0] Error fetching admin leads:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leads' },
      { status: 500 }
    )
  }
}
