import type nodemailer from "nodemailer"
import { logger } from "../utils/logger"

class EmailService {
  private transporter: nodemailer.Transporter | null = null

  constructor() {
    this.initializeTransporter()
  }

  private async initializeTransporter(): Promise<void> {
    try {
      // For now, use development mode (just log emails)
      this.transporter = {
        sendMail: async (mailOptions: any) => {
          logger.info("📧 [DEV MODE] Email would be sent:", {
            to: mailOptions.to,
            subject: mailOptions.subject,
            preview: mailOptions.text?.substring(0, 100) + "..." || "HTML email",
          })
          return { messageId: `dev-${Date.now()}` }
        },
        verify: async () => true,
      } as any

      logger.info("✅ Email transporter initialized in development mode")
    } catch (error) {
      logger.error("❌ Failed to initialize email transporter", { error })
    }
  }

  async sendVerificationEmail(email: string, name: string, verificationToken: string): Promise<boolean> {
    const verificationUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/auth/verify?token=${verificationToken}`

    const mailOptions = {
      from: `"SplitKar" <noreply@splitkar.com>`,
      to: email,
      subject: "Verify your SplitKar account",
      text: `Hi ${name}! Welcome to SplitKar. Please verify your email: ${verificationUrl}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Welcome to SplitKar!</h1>
          <p>Hi ${name}! 👋</p>
          <p>Thank you for joining SplitKar!</p>
          <p>Please verify your email address by clicking the link below:</p>
          <a href="${verificationUrl}" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Verify Email Address
          </a>
          <p>Or copy this link: ${verificationUrl}</p>
        </div>
      `,
    }

    try {
      if (!this.transporter) {
        throw new Error("Email transporter not initialized")
      }

      await this.transporter.sendMail(mailOptions)
      logger.info(`✅ Verification email sent to ${email}`)
      return true
    } catch (error) {
      logger.error("❌ Failed to send verification email", { error })
      return false
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    const mailOptions = {
      from: `"SplitKar" <noreply@splitkar.com>`,
      to: email,
      subject: "Welcome to SplitKar! 🎉",
      text: `Hi ${name}! Welcome to SplitKar. Your account is now verified and ready to use.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Welcome to SplitKar! 🎉</h1>
          <p>Hi ${name}!</p>
          <p>Your account is now verified and ready to use.</p>
          <p>Start splitting expenses with friends and family!</p>
        </div>
      `,
    }

    try {
      if (!this.transporter) {
        throw new Error("Email transporter not initialized")
      }

      await this.transporter.sendMail(mailOptions)
      logger.info(`✅ Welcome email sent to ${email}`)
      return true
    } catch (error) {
      logger.error("❌ Failed to send welcome email", { error })
      return false
    }
  }

  async sendPasswordResetEmail(email: string, name: string, resetToken: string): Promise<boolean> {
    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/auth/reset-password?token=${resetToken}`

    const mailOptions = {
      from: `"SplitKar" <noreply@splitkar.com>`,
      to: email,
      subject: "Reset your SplitKar password",
      text: `Hi ${name}! Reset your password: ${resetUrl}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Password Reset Request</h1>
          <p>Hi ${name}!</p>
          <p>Click the link below to reset your password:</p>
          <a href="${resetUrl}" style="background: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Reset Password
          </a>
          <p>Or copy this link: ${resetUrl}</p>
        </div>
      `,
    }

    try {
      if (!this.transporter) {
        throw new Error("Email transporter not initialized")
      }

      await this.transporter.sendMail(mailOptions)
      logger.info(`✅ Password reset email sent to ${email}`)
      return true
    } catch (error) {
      logger.error("❌ Failed to send password reset email", { error })
      return false
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      if (!this.transporter) {
        return false
      }
      return true
    } catch (error) {
      logger.error("❌ Email service connection failed", { error })
      return false
    }
  }
}

export const emailService = new EmailService()
