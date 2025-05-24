export interface WhatsAppReminderData {
  recipientPhone: string
  senderName: string
  senderUpiId: string
  amount: number
  currency: string
  expenseName?: string
  groupName?: string
}

export class WhatsAppService {
  /**
   * Generates a WhatsApp URL that opens the chat with a pre-filled reminder message
   */
  static generateReminderUrl(data: WhatsAppReminderData): string {
    const { recipientPhone, senderName, senderUpiId, amount, currency, expenseName, groupName } = data

    // Clean phone number (remove spaces, dashes, etc.)
    const cleanPhone = recipientPhone.replace(/[^\d+]/g, "")

    // Create the reminder message
    let message = `Hi! 👋\n\n`
    message += `This is a friendly reminder from ${senderName} about a pending payment.\n\n`

    if (expenseName) {
      message += `💰 *Expense:* ${expenseName}\n`
    }

    if (groupName) {
      message += `👥 *Group:* ${groupName}\n`
    }

    message += `💵 *Amount Due:* ${currency}${amount.toFixed(2)}\n\n`
    message += `You can pay me using UPI:\n`
    message += `🏦 *UPI ID:* ${senderUpiId}\n\n`
    message += `Or you can use any UPI app like:\n`
    message += `• Google Pay\n`
    message += `• PhonePe\n`
    message += `• Paytm\n`
    message += `• BHIM\n\n`
    message += `Thanks! 😊\n\n`
    message += `_Sent via SplitKar - Smart Expense Splitting_`

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message)

    // Generate WhatsApp URL
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`

    return whatsappUrl
  }

  /**
   * Generates a WhatsApp URL for group expense notifications
   */
  static generateGroupExpenseUrl(data: {
    recipientPhone: string
    senderName: string
    expenseName: string
    groupName: string
    amount: number
    currency: string
  }): string {
    const { recipientPhone, senderName, expenseName, groupName, amount, currency } = data

    const cleanPhone = recipientPhone.replace(/[^\d+]/g, "")

    let message = `Hi! 👋\n\n`
    message += `${senderName} added a new expense in *${groupName}*\n\n`
    message += `💰 *Expense:* ${expenseName}\n`
    message += `💵 *Your Share:* ${currency}${amount.toFixed(2)}\n\n`
    message += `Check the SplitKar app for more details!\n\n`
    message += `_Sent via SplitKar - Smart Expense Splitting_`

    const encodedMessage = encodeURIComponent(message)
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`
  }

  /**
   * Validates phone number format
   */
  static validatePhoneNumber(phone: string): boolean {
    // Basic validation for international phone numbers
    const phoneRegex = /^\+?[1-9]\d{1,14}$/
    const cleanPhone = phone.replace(/[^\d+]/g, "")
    return phoneRegex.test(cleanPhone)
  }

  /**
   * Formats phone number for WhatsApp (removes + and ensures proper format)
   */
  static formatPhoneForWhatsApp(phone: string): string {
    let cleanPhone = phone.replace(/[^\d+]/g, "")

    // Remove leading + if present
    if (cleanPhone.startsWith("+")) {
      cleanPhone = cleanPhone.substring(1)
    }

    // Add country code if not present (assuming India +91 for now)
    if (cleanPhone.length === 10 && !cleanPhone.startsWith("91")) {
      cleanPhone = "91" + cleanPhone
    }

    return cleanPhone
  }
}
