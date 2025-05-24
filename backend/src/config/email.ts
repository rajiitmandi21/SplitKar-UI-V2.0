import nodemailer from "nodemailer"
import { google } from "googleapis"

class EmailService {
  private transporter: nodemailer.Transporter | null = null
  private gmail: any

  constructor() {
    this.initializeGoogleAuth()
    this.initializeTransporter()
  }

  private initializeGoogleAuth() {
    try {
      // Create JWT client using service account credentials
      const jwtClient = new google.auth.JWT(
        process.env.CLIENT_EMAIL,
        undefined,
        process.env.PRIVATE_KEY?.replace(/\\n/g, "\n"), // Handle escaped newlines
        ["https://www.googleapis.com/auth/gmail.send"],
        undefined,
      )

      // Initialize Gmail API
      this.gmail = google.gmail({ version: "v1", auth: jwtClient })

      console.log("✅ Google Service Account initialized successfully")
    } catch (error) {
      console.error("❌ Failed to initialize Google Service Account:", error)
    }
  }

  private async initializeTransporter() {
    try {
      // Create OAuth2 client for nodemailer
      const oauth2Client = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        undefined, // No client secret needed for service account
        undefined, // No redirect URI needed
      )

      // Set service account credentials
      oauth2Client.setCredentials({
        type: "service_account",
        project_id: process.env.PROJECT_ID,
        private_key_id: process.env.PRIVATE_KEY_ID,
        private_key: process.env.PRIVATE_KEY?.replace(/\\n/g, "\n"),
        client_email: process.env.CLIENT_EMAIL,
        client_id: process.env.CLIENT_ID,
        auth_uri: process.env.AUTH_URI,
        token_uri: process.env.TOKEN_URI,
        auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
        universe_domain: process.env.UNIVERSE_DOMAIN || "googleapis.com",
      })

      // Get access token
      const accessToken = await oauth2Client.getAccessToken()

      this.transporter = nodemailer.createTransporter({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: process.env.CLIENT_EMAIL, // Use service account email
          clientId: process.env.CLIENT_ID,
          clientSecret: undefined, // Not needed for service account
          refreshToken: undefined, // Not needed for service account
          accessToken: accessToken.token,
        },
      })

      console.log("✅ Email transporter initialized successfully")
    } catch (error) {
      console.error("❌ Failed to initialize email transporter:", error)

      // Fallback to simple SMTP if OAuth fails
      this.initializeFallbackTransporter()
    }
  }

  private initializeFallbackTransporter() {
    try {
      // Simple SMTP configuration as fallback
      this.transporter = nodemailer.createTransporter({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.CLIENT_EMAIL,
          pass: process.env.GMAIL_APP_PASSWORD, // App-specific password if available
        },
      })

      console.log("⚠️ Using fallback SMTP transporter")
    } catch (error) {
      console.error("❌ Failed to initialize fallback transporter:", error)
    }
  }

  async sendVerificationEmail(email: string, name: string, verificationToken: string) {
    const verificationUrl = `${process.env.FRONTEND_URL}/auth/verify?token=${verificationToken}`

    const mailOptions = {
      from: `"SplitKar" <${process.env.CLIENT_EMAIL}>`,
      to: email,
      subject: "Verify your SplitKar account",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #14b8a6 0%, #3b82f6 100%); padding: 30px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Welcome to SplitKar!</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Smart Expense Splitting Made Easy</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px; background: #f9fafb;">
            <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Hi ${name}! 👋</h2>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              Thank you for joining SplitKar! We're excited to help you manage your expenses with friends and family.
            </p>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
              To get started, please verify your email address by clicking the button below:
            </p>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 40px 0;">
              <a href="${verificationUrl}" 
                 style="background: linear-gradient(135deg, #14b8a6 0%, #3b82f6 100%); 
                        color: white; 
                        padding: 16px 32px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-weight: bold;
                        font-size: 16px;
                        display: inline-block;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                Verify Email Address
              </a>
            </div>
            
            <!-- Alternative Link -->
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6;">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="margin: 0;">
                <a href="${verificationUrl}" style="color: #3b82f6; word-break: break-all;">${verificationUrl}</a>
              </p>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; margin: 30px 0 0 0; text-align: center;">
              This verification link will expire in 24 hours for security reasons.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background: #e5e7eb; padding: 20px; text-align: center;">
            <p style="color: #6b7280; font-size: 12px; margin: 0;">
              If you didn't create this account, please ignore this email.
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
      console.log(`✅ Verification email sent to ${email}`)
      return true
    } catch (error) {
      console.error("❌ Failed to send verification email:", error)
      throw new Error("Failed to send verification email")
    }
  }

  async sendPasswordResetEmail(email: string, name: string, resetToken: string) {
    const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`

    const mailOptions = {
      from: `"SplitKar" <${process.env.CLIENT_EMAIL}>`,
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
      console.log(`✅ Password reset email sent to ${email}`)
      return true
    } catch (error) {
      console.error("❌ Failed to send password reset email:", error)
      throw new Error("Failed to send password reset email")
    }
  }

  async sendWelcomeEmail(email: string, name: string) {
    const mailOptions = {
      from: `"SplitKar" <${process.env.CLIENT_EMAIL}>`,
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
              <a href="${process.env.FRONTEND_URL}/dashboard" 
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
      console.log(`✅ Welcome email sent to ${email}`)
      return true
    } catch (error) {
      console.error("❌ Failed to send welcome email:", error)
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
      console.log("✅ Email service connection verified")
      return true
    } catch (error) {
      console.error("❌ Email service connection failed:", error)
      return false
    }
  }
}

export const emailService = new EmailService()
