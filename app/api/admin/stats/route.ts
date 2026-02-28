import { NextRequest, NextResponse } from 'next/server'
import { getCRMStats, getStudioLeads } from '@/lib/server/db-actions'
import { createClient } from '@/lib/supabase/server'

/**
 * Verify admin or editor authentication
 */
async function verifyAdminOrEditorAuth() {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { authorized: false, error: 'Unauthorized' }
  }

  // Check if user is admin or editor
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin' && profile?.role !== 'editor') {
    return { authorized: false, error: 'Forbidden - Admin or Editor access required' }
  }

  return { authorized: true, userId: user.id, role: profile.role }
}

export async function GET(request: NextRequest) {
  try {
    // Verify admin or editor authentication
    const auth = await verifyAdminOrEditorAuth()

    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: 401 }
      )
    }

    const stats = await getCRMStats()
    const leads = await getStudioLeads({ limit: 5, sortBy: 'newest' })

    return NextResponse.json({
      success: true,
      stats,
      recent_leads: leads,
    })
  } catch (error) {
    console.error('[v0] Error fetching admin stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
