import { NextRequest, NextResponse } from "next/server"
import { query, transaction } from "@/lib/database"

// Generate UPI payment URL
function generateUPIUrl(data: {
  upiId: string
  payeeName: string
  amount?: number
  currency?: string
  message?: string
}): string {
  const { upiId, payeeName, amount, currency = 'INR', message } = data
  
  let upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}`
  
  if (amount && amount > 0) {
    upiUrl += `&am=${amount}`
  }
  
  upiUrl += `&cu=${currency}`
  
  if (message) {
    upiUrl += `&tn=${encodeURIComponent(message)}`
  }
  
  return upiUrl
}

// GET /api/upi/redirect/[shortCode] - Get UPI payment link by short code
export async function GET(
  request: NextRequest,
  { params }: { params: { shortCode: string } }
) {
  try {
    const { shortCode } = params

    if (!shortCode) {
      return NextResponse.json(
        { success: false, error: 'Short code is required' },
        { status: 400 }
      )
    }

    const result = await transaction(async (client) => {
      // Get UPI payment link with related data
      const linkResult = await client.query(
        `SELECT 
          upl.*,
          u.name as creator_name,
          e.title as expense_title,
          g.name as group_name
         FROM upi_payment_links upl
         LEFT JOIN users u ON upl.created_by = u.id
         LEFT JOIN expenses e ON upl.expense_id = e.id
         LEFT JOIN groups g ON upl.group_id = g.id
         WHERE upl.short_code = $1`,
        [shortCode]
      )

      if (linkResult.rows.length === 0) {
        return null
      }

      const link = linkResult.rows[0]

      // Check if link is active and not expired
      const now = new Date()
      const isExpired = link.expires_at && new Date(link.expires_at) < now
      const isActive = link.is_active && !isExpired

      // Update click count and last accessed time
      await client.query(
        `UPDATE upi_payment_links 
         SET click_count = click_count + 1, 
             last_accessed_at = NOW()
         WHERE id = $1`,
        [link.id]
      )

      // Generate URLs
      const shortUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/${link.short_code}`
      const upiUrl = generateUPIUrl({
        upiId: link.upi_id,
        payeeName: link.payee_name,
        amount: link.amount,
        currency: link.currency,
        message: link.message
      })

      return {
        ...link,
        shortUrl,
        upiUrl,
        isActive
      }
    })

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'UPI payment link not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result
    })

  } catch (error) {
    console.error('Error fetching UPI payment link:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch UPI payment link' },
      { status: 500 }
    )
  }
} 