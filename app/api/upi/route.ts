import { NextRequest, NextResponse } from "next/server"
import { query, transaction } from "@/lib/database"

// Generate a random short code
function generateShortCode(length: number = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

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

// GET /api/upi - Get UPI payment links for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const expenseId = searchParams.get('expenseId')
    const groupId = searchParams.get('groupId')

    let whereClause = 'WHERE is_active = true'
    const params: any[] = []

    if (userId) {
      whereClause += ' AND created_by = $' + (params.length + 1)
      params.push(userId)
    }

    if (expenseId) {
      whereClause += ' AND expense_id = $' + (params.length + 1)
      params.push(expenseId)
    }

    if (groupId) {
      whereClause += ' AND group_id = $' + (params.length + 1)
      params.push(groupId)
    }

    const result = await query(
      `SELECT 
        upl.*,
        u.name as creator_name,
        e.title as expense_title,
        g.name as group_name
       FROM upi_payment_links upl
       LEFT JOIN users u ON upl.created_by = u.id
       LEFT JOIN expenses e ON upl.expense_id = e.id
       LEFT JOIN groups g ON upl.group_id = g.id
       ${whereClause}
       ORDER BY upl.created_at DESC`,
      params
    )

    const links = result.rows.map((link: any) => ({
      ...link,
      shortUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/${link.short_code}`,
      upiUrl: generateUPIUrl({
        upiId: link.upi_id,
        payeeName: link.payee_name,
        amount: link.amount,
        currency: link.currency,
        message: link.message
      })
    }))

    return NextResponse.json({ success: true, data: links })
  } catch (error) {
    console.error('Error fetching UPI links:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch UPI payment links' },
      { status: 500 }
    )
  }
}

// POST /api/upi - Create a new UPI payment link
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      upiId,
      payeeName,
      amount,
      currency = 'INR',
      message,
      transactionNote,
      createdBy,
      expenseId,
      groupId,
      expiresAt,
      allowCustomAmount = false,
      minAmount,
      maxAmount
    } = body

    // Validation
    if (!upiId || !payeeName) {
      return NextResponse.json(
        { success: false, error: 'UPI ID and payee name are required' },
        { status: 400 }
      )
    }

    // Validate UPI ID format (basic validation)
    const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/
    if (!upiRegex.test(upiId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid UPI ID format' },
        { status: 400 }
      )
    }

    const result = await transaction(async (client) => {
      // Generate unique short code
      let shortCode: string
      let isUnique = false
      let attempts = 0
      const maxAttempts = 10

      do {
        shortCode = generateShortCode(8)
        const existingResult = await client.query(
          'SELECT id FROM upi_payment_links WHERE short_code = $1 UNION SELECT id FROM short_urls WHERE short_code = $1',
          [shortCode]
        )
        isUnique = existingResult.rows.length === 0
        attempts++
      } while (!isUnique && attempts < maxAttempts)

      if (!isUnique) {
        throw new Error('Failed to generate unique short code')
      }

      // Create UPI payment link
      const linkResult = await client.query(
        `INSERT INTO upi_payment_links (
          short_code, upi_id, payee_name, amount, currency, message, 
          transaction_note, created_by, expense_id, group_id, expires_at,
          allow_custom_amount, min_amount, max_amount
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
        RETURNING *`,
        [
          shortCode, upiId, payeeName, amount, currency, message,
          transactionNote, createdBy, expenseId, groupId, expiresAt,
          allowCustomAmount, minAmount, maxAmount
        ]
      )

      const link = linkResult.rows[0]

      // Log activity
      if (createdBy) {
        await client.query(
          `INSERT INTO activity_log (user_id, expense_id, group_id, action, description, metadata)
           VALUES ($1, $2, $3, 'upi_link_created', $4, $5)`,
          [
            createdBy,
            expenseId,
            groupId,
            `Created UPI payment link for ${payeeName}`,
            JSON.stringify({
              shortCode,
              amount,
              currency,
              upiId: upiId.replace(/^(.{3}).*(@.*)$/, '$1***$2') // Mask UPI ID for privacy
            })
          ]
        )
      }

      return link
    })

    // Generate URLs
    const shortUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/${result.short_code}`
    const upiUrl = generateUPIUrl({
      upiId: result.upi_id,
      payeeName: result.payee_name,
      amount: result.amount,
      currency: result.currency,
      message: result.message
    })

    return NextResponse.json({
      success: true,
      data: {
        ...result,
        shortUrl,
        upiUrl
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating UPI payment link:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create UPI payment link' },
      { status: 500 }
    )
  }
}

// PUT /api/upi - Update UPI payment link
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, isActive, expiresAt } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Link ID is required' },
        { status: 400 }
      )
    }

    const result = await query(
      `UPDATE upi_payment_links 
       SET is_active = COALESCE($2, is_active),
           expires_at = COALESCE($3, expires_at),
           updated_at = NOW()
       WHERE id = $1 
       RETURNING *`,
      [id, isActive, expiresAt]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'UPI payment link not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    })

  } catch (error) {
    console.error('Error updating UPI payment link:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update UPI payment link' },
      { status: 500 }
    )
  }
}

// DELETE /api/upi - Deactivate UPI payment link
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Link ID is required' },
        { status: 400 }
      )
    }

    const result = await query(
      `UPDATE upi_payment_links 
       SET is_active = false, updated_at = NOW()
       WHERE id = $1 
       RETURNING *`,
      [id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'UPI payment link not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'UPI payment link deactivated successfully'
    })

  } catch (error) {
    console.error('Error deactivating UPI payment link:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to deactivate UPI payment link' },
      { status: 500 }
    )
  }
} 