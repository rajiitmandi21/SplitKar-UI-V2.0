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
          this.transporter = nodemailer.createTransporter({
            service: "gmail",
            auth: {
              type: "OAuth2",
              user: process.env.GMAIL_USER,
              clientId: process.env.GMAIL_CLIENT_ID,
              clientSecret: process.env.GMAIL_CLIENT_SECRET,
              refreshToken: process.env.GMAIL_REFRESH_TOKEN,
              accessToken: accessToken || "",
            },
          } as any)

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
