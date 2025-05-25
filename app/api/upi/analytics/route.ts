import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

// Helper function to parse user agent
function parseUserAgent(userAgent: string) {
  const isMobile = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
  const isTablet = /iPad|Android(?!.*Mobile)/i.test(userAgent)
  
  let deviceType = 'desktop'
  if (isTablet) deviceType = 'tablet'
  else if (isMobile) deviceType = 'mobile'

  let browser = 'unknown'
  if (userAgent.includes('Chrome')) browser = 'chrome'
  else if (userAgent.includes('Firefox')) browser = 'firefox'
  else if (userAgent.includes('Safari')) browser = 'safari'
  else if (userAgent.includes('Edge')) browser = 'edge'
  else if (userAgent.includes('Opera')) browser = 'opera'

  return { deviceType, browser }
}

// POST /api/upi/analytics - Track UPI payment link access
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { upiLinkId, userAgent, referer } = body

    if (!upiLinkId) {
      return NextResponse.json(
        { success: false, error: 'UPI link ID is required' },
        { status: 400 }
      )
    }

    // Get client IP
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || '127.0.0.1'

    // Parse user agent
    const { deviceType, browser } = parseUserAgent(userAgent || '')

    // Insert analytics record
    await query(
      `INSERT INTO upi_link_analytics (
        upi_link_id, ip_address, user_agent, referer, 
        device_type, browser, accessed_at
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
      [upiLinkId, ip, userAgent, referer, deviceType, browser]
    )

    return NextResponse.json({
      success: true,
      message: 'Analytics recorded successfully'
    })

  } catch (error) {
    console.error('Error recording UPI link analytics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to record analytics' },
      { status: 500 }
    )
  }
}

// GET /api/upi/analytics - Get analytics for UPI payment links
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const upiLinkId = searchParams.get('upiLinkId')
    const userId = searchParams.get('userId')
    const days = parseInt(searchParams.get('days') || '30')

    let whereClause = 'WHERE ula.accessed_at >= NOW() - INTERVAL $1 DAY'
    const params: any[] = [days]

    if (upiLinkId) {
      whereClause += ' AND ula.upi_link_id = $' + (params.length + 1)
      params.push(upiLinkId)
    }

    if (userId) {
      whereClause += ' AND upl.created_by = $' + (params.length + 1)
      params.push(userId)
    }

    // Get analytics summary
    const summaryResult = await query(
      `SELECT 
        COUNT(*) as total_clicks,
        COUNT(DISTINCT ula.ip_address) as unique_visitors,
        COUNT(DISTINCT DATE(ula.accessed_at)) as active_days,
        COUNT(CASE WHEN ula.device_type = 'mobile' THEN 1 END) as mobile_clicks,
        COUNT(CASE WHEN ula.device_type = 'desktop' THEN 1 END) as desktop_clicks,
        COUNT(CASE WHEN ula.device_type = 'tablet' THEN 1 END) as tablet_clicks
       FROM upi_link_analytics ula
       JOIN upi_payment_links upl ON ula.upi_link_id = upl.id
       ${whereClause}`,
      params
    )

    // Get top browsers
    const browserResult = await query(
      `SELECT 
        ula.browser,
        COUNT(*) as clicks
       FROM upi_link_analytics ula
       JOIN upi_payment_links upl ON ula.upi_link_id = upl.id
       ${whereClause}
       GROUP BY ula.browser
       ORDER BY clicks DESC
       LIMIT 5`,
      params
    )

    // Get daily clicks for the period
    const dailyResult = await query(
      `SELECT 
        DATE(ula.accessed_at) as date,
        COUNT(*) as clicks,
        COUNT(DISTINCT ula.ip_address) as unique_visitors
       FROM upi_link_analytics ula
       JOIN upi_payment_links upl ON ula.upi_link_id = upl.id
       ${whereClause}
       GROUP BY DATE(ula.accessed_at)
       ORDER BY date DESC`,
      params
    )

    // Get top referrers
    const referrerResult = await query(
      `SELECT 
        COALESCE(ula.referer, 'Direct') as referrer,
        COUNT(*) as clicks
       FROM upi_link_analytics ula
       JOIN upi_payment_links upl ON ula.upi_link_id = upl.id
       ${whereClause}
       GROUP BY ula.referer
       ORDER BY clicks DESC
       LIMIT 10`,
      params
    )

    return NextResponse.json({
      success: true,
      data: {
        summary: summaryResult.rows[0],
        browsers: browserResult.rows,
        dailyStats: dailyResult.rows,
        referrers: referrerResult.rows
      }
    })

  } catch (error) {
    console.error('Error fetching UPI link analytics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
} 