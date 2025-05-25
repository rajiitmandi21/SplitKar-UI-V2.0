# UPI Payment Links with Custom Domain URL Shortening

## Overview

SplitKar now includes a powerful UPI payment link generator with custom domain URL shortening. This feature allows users to create secure, trackable payment links that can be easily shared via any messaging platform.

## Features

### 🔗 URL Shortening
- **Custom Domain**: Links use your domain (e.g., `yourdomain.com/abc123`)
- **Short Codes**: 8-character alphanumeric codes for easy sharing
- **Collision Prevention**: Automatic generation of unique codes
- **Expiry Support**: Optional expiration dates for enhanced security

### 💳 UPI Integration
- **Standard UPI Format**: Compatible with all UPI apps (GPay, PhonePe, Paytm, BHIM)
- **Template**: `upi://pay?pa=<UPI_ID>&pn=<PAYEE_NAME>&am=<AMOUNT>&cu=INR&tn=<MESSAGE>`
- **Flexible Amounts**: Support for fixed amounts or open-ended payments
- **Custom Amount Entry**: Allow payers to enter their own amount with optional min/max limits
- **Real-time Validation**: Amount validation on payment page with user-friendly error messages
- **Custom Messages**: Context-aware transaction notes

### 📊 Analytics & Tracking
- **Click Tracking**: Monitor link usage and engagement
- **Device Analytics**: Mobile, desktop, and tablet usage statistics
- **Browser Insights**: Track which browsers are used most
- **Referrer Tracking**: See where clicks are coming from
- **Geographic Data**: IP-based location tracking

### 🔒 Security Features
- **Expiration Dates**: Links can be set to expire automatically
- **Deactivation**: Manual link deactivation for security
- **Privacy Protection**: UPI IDs are masked in logs
- **Secure Storage**: Encrypted database storage

### 📧 Email Integration & Notifications
- **Payment Reminders**: Automated email reminders with embedded UPI payment links
- **Nudge System**: Gentle nudges for overdue payments with urgency indicators
- **Click Tracking**: Track when recipients click on payment links in emails
- **Beautiful Templates**: Professional HTML email templates with expense details
- **Personalization**: Customized messages based on expense and group context
- **Multiple Templates**: Different templates for reminders, nudges, and urgent notices
- **Bulk Notifications**: Send reminders to multiple participants at once

## API Endpoints

### Create UPI Payment Link
```http
POST /api/upi
Content-Type: application/json

{
  "upiId": "user@paytm",
  "payeeName": "John Doe",
  "amount": 500.00,
  "currency": "INR",
  "message": "Payment for dinner",
  "transactionNote": "Group expense settlement",
  "createdBy": "user-uuid",
  "expenseId": "expense-uuid",
  "groupId": "group-uuid",
  "expiresAt": "2024-12-31T23:59:59Z",
  "allowCustomAmount": false,
  "minAmount": 100.00,
  "maxAmount": 1000.00
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "link-uuid",
    "short_code": "abc123xy",
    "shortUrl": "https://yourdomain.com/abc123xy",
    "upiUrl": "upi://pay?pa=user%40paytm&pn=John%20Doe&am=500&cu=INR&tn=Payment%20for%20dinner",
    "created_at": "2024-01-15T10:30:00Z",
    "expires_at": "2024-12-31T23:59:59Z",
    "click_count": 0
  }
}
```

### Get UPI Payment Links
```http
GET /api/upi?userId=user-uuid&expenseId=expense-uuid&groupId=group-uuid
```

### Redirect Handler
```http
GET /api/upi/redirect/abc123xy
```

### Analytics
```http
GET /api/upi/analytics?userId=user-uuid&days=30
```

### Track Click
```http
POST /api/upi/analytics
Content-Type: application/json

{
  "upiLinkId": "link-uuid",
  "userAgent": "Mozilla/5.0...",
  "referer": "https://whatsapp.com"
}
```

### Send Email Notification
```http
POST /api/notifications/email
Content-Type: application/json

{
  "type": "reminder",
  "recipientEmail": "user@example.com",
  "recipientName": "John Doe",
  "senderName": "Jane Smith",
  "amount": 500.00,
  "currency": "INR",
  "expenseTitle": "Team Dinner",
  "groupName": "Office Team",
  "paymentLink": "https://yourdomain.com/abc123xy",
  "dueDate": "2024-02-01",
  "daysSinceReminder": 3
}
```

**Response:**
```json
{
  "success": true,
  "message": "reminder email sent successfully",
  "data": {
    "recipientEmail": "user@example.com",
    "subject": "💰 Payment Reminder: ₹500 for Team Dinner",
    "paymentLink": "https://yourdomain.com/abc123xy"
  }
}
```

## Database Schema

### UPI Payment Links Table
```sql
CREATE TABLE upi_payment_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    short_code VARCHAR(20) UNIQUE NOT NULL,
    upi_id VARCHAR(100) NOT NULL,
    payee_name VARCHAR(255) NOT NULL,
    amount DECIMAL(12, 2),
    currency VARCHAR(3) DEFAULT 'INR',
    message TEXT,
    transaction_note TEXT,
    created_by UUID REFERENCES users(id),
    expense_id UUID REFERENCES expenses(id),
    group_id UUID REFERENCES groups(id),
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE,
    click_count INTEGER DEFAULT 0,
    last_accessed_at TIMESTAMP WITH TIME ZONE,
    allow_custom_amount BOOLEAN DEFAULT false,
    min_amount DECIMAL(12, 2),
    max_amount DECIMAL(12, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Analytics Table
```sql
CREATE TABLE upi_link_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    upi_link_id UUID NOT NULL REFERENCES upi_payment_links(id),
    ip_address INET,
    user_agent TEXT,
    referer TEXT,
    country VARCHAR(2),
    city VARCHAR(100),
    device_type VARCHAR(50),
    browser VARCHAR(50),
    accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Frontend Components

### UPIPaymentGenerator Component
```tsx
import UPIPaymentGenerator from "@/components/upi-payment-generator"

<UPIPaymentGenerator
  defaultData={{
    upiId: "user@paytm",
    payeeName: "John Doe",
    amount: 500,
    message: "Payment for dinner",
    expenseId: "expense-uuid",
    groupId: "group-uuid",
    createdBy: "user-uuid"
  }}
  onLinkCreated={(link) => {
    console.log("Payment link created:", link)
  }}
/>
```

### Short URL Redirect Page
The dynamic route `app/[shortCode]/page.tsx` handles all short URL redirects and displays a beautiful payment interface.

## Usage Examples

### 1. Basic Payment Link
```javascript
// Create a simple payment link
const response = await fetch('/api/upi', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    upiId: 'merchant@paytm',
    payeeName: 'Coffee Shop',
    amount: 150.00,
    message: 'Coffee and snacks'
  })
})

const { data } = await response.json()
console.log('Share this link:', data.shortUrl)
// Output: https://yourdomain.com/k8j2n9x1
```

### 2. Expense Settlement Link
```javascript
// Create a link for expense settlement
const settlementLink = await fetch('/api/upi', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    upiId: 'friend@gpay',
    payeeName: 'Friend Name',
    amount: 750.00,
    message: 'Your share for dinner at restaurant',
    expenseId: 'expense-123',
    groupId: 'group-456',
    createdBy: 'user-789',
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  })
})
```

### 3. WhatsApp Integration
```javascript
// Generate WhatsApp message with payment link
const whatsappMessage = `Hi! Please pay your share for dinner: ${data.shortUrl}`
const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(whatsappMessage)}`
window.open(whatsappUrl)
```

## Message Templates

### Context-Based Messages
The system automatically generates appropriate messages based on the transaction context:

- **Expense Settlement**: `"Settlement for [Expense Name] via SplitKar"`
- **Group Payment**: `"Payment for [Group Name] expense"`
- **General Payment**: `"Payment via SplitKar"`
- **Custom Message**: User-defined message

### UPI Transaction Notes
Transaction notes are generated to include:
- Expense title (if linked to an expense)
- Group name (if part of a group expense)
- Settlement context
- SplitKar branding for tracking

## Security Considerations

### 1. Link Expiration
```javascript
// Set expiration for sensitive payments
expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
```

### 2. UPI ID Privacy
- UPI IDs are masked in analytics logs
- Only the creator can see full UPI details
- Links can be deactivated immediately if compromised

### 3. Rate Limiting
- API endpoints are rate-limited to prevent abuse
- Maximum 100 links per user per day
- Click tracking is throttled to prevent spam

## Analytics Dashboard

### Key Metrics
- **Total Clicks**: Overall link engagement
- **Unique Visitors**: Distinct users who clicked
- **Conversion Rate**: Clicks that led to UPI app opens
- **Device Breakdown**: Mobile vs Desktop usage
- **Geographic Distribution**: Click locations
- **Time-based Analysis**: Peak usage hours

### Export Features
- CSV export of analytics data
- Date range filtering
- Link-specific reports
- Aggregated user statistics

## Integration with Existing Features

### 1. Settlement Page
- New "UPI Links" tab in `/settle` page
- Quick templates for frequent payees
- Integration with existing balance calculations

### 2. Expense Management
- Auto-generate payment links when creating expenses
- Include links in expense notifications
- Track payment completion through link analytics

### 3. Group Features
- Bulk link generation for group expenses
- Group-specific payment templates
- Shared analytics for group administrators

## Mobile Optimization

### Progressive Web App (PWA)
- Offline link generation (cached templates)
- Native sharing API integration
- Push notifications for link clicks

### UPI App Integration
- Deep linking to preferred UPI apps
- Fallback to UPI app selection
- QR code generation for offline payments

## Deployment Configuration

### Environment Variables
```bash
# Required
DATABASE_URL=postgresql://user:pass@host:port/db
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Optional
UPI_LINK_EXPIRY_DAYS=30
MAX_LINKS_PER_USER=100
ANALYTICS_RETENTION_DAYS=365
```

### Domain Setup
1. Configure your domain to point to the Next.js application
2. Set up SSL certificates for secure HTTPS
3. Configure CDN for global link performance
4. Set up monitoring for link availability

## Testing

### Unit Tests
```bash
npm run test:upi-links
```

### Integration Tests
```bash
npm run test:api
```

### End-to-End Tests
```bash
npm run test:e2e
```

## Troubleshooting

### Common Issues

1. **Links not redirecting**
   - Check if short code exists in database
   - Verify link is active and not expired
   - Check server logs for errors

2. **UPI apps not opening**
   - Verify UPI URL format
   - Check device UPI app compatibility
   - Test with different UPI apps

3. **Analytics not tracking**
   - Verify analytics endpoint is working
   - Check browser console for errors
   - Ensure proper user agent parsing

### Debug Mode
```javascript
// Enable debug logging
localStorage.setItem('upi-debug', 'true')
```

## Future Enhancements

### Planned Features
- QR code generation for offline sharing
- Bulk link creation for multiple payees
- Payment confirmation webhooks
- Advanced analytics with charts
- Custom domain branding
- API rate limiting dashboard
- Link performance optimization

### Integration Roadmap
- WhatsApp Business API integration
- SMS gateway for link sharing
- Email template integration
- Social media sharing optimization
- Payment gateway fallbacks

## Support

For technical support or feature requests:
- Create an issue in the GitHub repository
- Contact the development team
- Check the FAQ section in the main documentation

---

**Note**: This feature requires a PostgreSQL database and proper environment configuration. Ensure all dependencies are installed and configured before deployment. 