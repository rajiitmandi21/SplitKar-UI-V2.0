import nodemailer from "nodemailer"
import { OAuth2Client } from "google-auth-library"
import { logger } from "../utils/logger"

class EmailService {
  private transporter: nodemailer.Transporter | null = null

  constructor() {
    this.initializeTransporter()
  }

  private async initializeTransporter(): Promise<void> {
    try {
      // Check if we have OAuth2 credentials
      if (
        process.env.GMAIL_CLIENT_ID &&
        process.env.GMAIL_CLIENT_SECRET &&
        process.env.GMAIL_REFRESH_TOKEN &&
        process.env.GMAIL_USER
      ) {
        // Create OAuth2 client
        const oauth2Client = new OAuth2Client(
          process.env.GMAIL_CLIENT_ID,
          process.env.GMAIL_CLIENT_SECRET,
          "https://developers.google.com/oauthplayground",
        )

        oauth2Client.setCredentials({
          refresh_token: process.env.GMAIL_REFRESH_TOKEN,
        })

        try {
          // Get access token
          const accessTokenResponse = await oauth2Client.getAccessToken()
          const accessToken = accessTokenResponse.token

          // Create transporter with OAuth2
          const transportOptions = {
            service: "gmail",
            auth: {
              type: "OAuth2",
              user: process.env.GMAIL_USER,
              clientId: process.env.GMAIL_CLIENT_ID,
              clientSecret: process.env.GMAIL_CLIENT_SECRET,
              refreshToken: process.env.GMAIL_REFRESH_TOKEN,
              accessToken: accessToken,
            },
          }

          this.transporter = nodemailer.createTransport(transportOptions)
          await this.transporter.verify()
          logger.info("✅ Email transporter initialized with OAuth2")
          return
        } catch (oauthError) {
          logger.warn("OAuth2 setup failed, falling back to development mode", { error: oauthError })
        }
      } else {
        logger.warn("OAuth2 credentials not found, using development mode")
      }

      // Development mode - just log emails instead of sending
      this.transporter = {
        sendMail: async (mailOptions: any) => {
          logger.info("📧 [DEV MODE] Email would be sent:", {
            to: mailOptions.to,
            subject: mailOptions.subject,
            text: mailOptions.text?.substring(0, 100) + "...",
            html: "HTML content omitted",
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
      from: `"SplitKar" <${process.env.GMAIL_USER || "noreply@splitkar.com"}>`,
      to: email,
      subject: "Verify your SplitKar account",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <h1>Welcome to SplitKar!</h1>
          <p>Hi ${name}! 👋</p>
          <p>Thank you for joining SplitKar! We're excited to help you manage your expenses with friends and family.</p>
          <p>To get started, please verify your email address by clicking the button below:</p>
          <a href="${verificationUrl}" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Verify Email Address
          </a>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p><a href="${verificationUrl}">${verificationUrl}</a></p>
          <p>This verification link will expire in 24 hours for security reasons.</p>
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
      throw new Error("Failed to send verification email")
    }
  }

  async sendPasswordResetEmail(email: string, name: string, resetToken: string): Promise<boolean> {
    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/auth/reset-password?token=${resetToken}`

    const mailOptions = {
      from: `"SplitKar" <${process.env.GMAIL_USER || "noreply@splitkar.com"}>`,
      to: email,
      subject: "Reset your SplitKar password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #ef4444 0%, #f97316 100%); padding: 30px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Password Reset Request</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">SplitKar Account Security</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px; background: #f9fafb;">
            <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Hi ${name}! 🔐</h2>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              We received a request to reset your SplitKar account password.
            </p>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
              Click the button below to create a new password:
            </p>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 40px 0;">
              <a href="${resetUrl}" 
                 style="background: linear-gradient(135deg, #ef4444 0%, #f97316 100%); 
                        color: white; 
                        padding: 16px 32px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-weight: bold;
                        font-size: 16px;
                        display: inline-block;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                Reset Password
              </a>
            </div>
            
            <!-- Alternative Link -->
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #ef4444;">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="margin: 0;">
                <a href="${resetUrl}" style="color: #ef4444; word-break: break-all;">${resetUrl}</a>
              </p>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; margin: 30px 0 0 0; text-align: center;">
              This reset link will expire in 1 hour for security reasons.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background: #e5e7eb; padding: 20px; text-align: center;">
            <p style="color: #6b7280; font-size: 12px; margin: 0;">
              If you didn't request this password reset, please ignore this email and your password will remain unchanged.
            </p>
            <p style="color: #6b7280; font-size: 12px; margin: 10px 0 0 0;">
              © 2024 SplitKar. All rights reserved.
            </p>
          </div>
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
      throw new Error("Failed to send password reset email")
    }
  }

  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    const mailOptions = {
      from: `"SplitKar" <${process.env.GMAIL_USER || "noreply@splitkar.com"}>`,
      to: email,
      subject: "Welcome to SplitKar! 🎉",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #14b8a6 0%, #3b82f6 100%); padding: 30px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Welcome to SplitKar! 🎉</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">You're all set to start splitting!</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px; background: #f9fafb;">
            <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Hi ${name}! 👋</h2>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
              Your email has been verified successfully! You're now ready to start splitting expenses with friends and family.
            </p>
            
            <!-- Features -->
            <div style="background: white; padding: 25px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h3 style="color: #1f2937; margin: 0 0 20px 0; font-size: 20px;">What you can do now:</h3>
              <ul style="color: #4b5563; line-height: 1.8; margin: 0; padding-left: 20px;">
                <li>Create groups for different occasions (trips, dinners, roommates)</li>
                <li>Add friends and family members to your groups</li>
                <li>Split expenses easily and fairly</li>
                <li>Track who owes what with real-time balances</li>
                <li>Send payment reminders via WhatsApp</li>
                <li>Settle up using UPI payments</li>
              </ul>
            </div>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 40px 0;">
              <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/dashboard" 
                 style="background: linear-gradient(135deg, #14b8a6 0%, #3b82f6 100%); 
                        color: white; 
                        padding: 16px 32px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-weight: bold;
                        font-size: 16px;
                        display: inline-block;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                Go to Dashboard
              </a>
            </div>
            
            <!-- Tips -->
            <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6;">
              <h4 style="color: #1e40af; margin: 0 0 10px 0; font-size: 16px;">💡 Pro Tip:</h4>
              <p style="color: #1e40af; margin: 0; font-size: 14px;">
                Start by creating your first group and adding your UPI ID in your profile for seamless payments!
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #e5e7eb; padding: 20px; text-align: center;">
            <p style="color: #6b7280; font-size: 12px; margin: 0 0 10px 0;">
              Need help? Contact us at support@splitkar.com
            </p>
            <p style="color: #6b7280; font-size: 12px; margin: 0;">
              © 2024 SplitKar. All rights reserved.
            </p>
          </div>
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
      // Don't throw error for welcome email as it's not critical
      return false
    }
  }

  // Health check method
  async testConnection(): Promise<boolean> {
    try {
      if (!this.transporter) {
        return false
      }

      await this.transporter.verify()
      logger.info("✅ Email service connection verified")
      return true
    } catch (error) {
      logger.error("❌ Email service connection failed", { error })
      return false
    }
  }
}

export const emailService = new EmailService()
