# Setting Up Gmail OAuth2 for SplitKar

This guide will walk you through the process of setting up Gmail OAuth2 authentication for sending emails from your SplitKar application.

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click on "Select a project" at the top of the page
3. Click on "NEW PROJECT" in the popup
4. Enter a name for your project (e.g., "SplitKar")
5. Click "CREATE"

## Step 2: Enable the Gmail API

1. Select your newly created project
2. Go to "APIs & Services" > "Library" in the left sidebar
3. Search for "Gmail API"
4. Click on "Gmail API" in the search results
5. Click "ENABLE"

## Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen" in the left sidebar
2. Select "External" as the user type (unless you have a Google Workspace)
3. Click "CREATE"
4. Fill in the required information:
   - App name: SplitKar
   - User support email: Your email address
   - Developer contact information: Your email address
5. Click "SAVE AND CONTINUE"
6. Add the following scopes:
   - `https://mail.google.com/`
7. Click "SAVE AND CONTINUE"
8. Add test users (including your own email)
9. Click "SAVE AND CONTINUE"
10. Review your settings and click "BACK TO DASHBOARD"

## Step 4: Create OAuth2 Credentials

1. Go to "APIs & Services" > "Credentials" in the left sidebar
2. Click "CREATE CREDENTIALS" at the top of the page
3. Select "OAuth client ID"
4. Select "Web application" as the application type
5. Name: SplitKar Web Client
6. Add authorized redirect URIs:
   - `https://developers.google.com/oauthplayground`
7. Click "CREATE"
8. Note down the Client ID and Client Secret

## Step 5: Get a Refresh Token

1. Go to the [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
2. Click the gear icon (⚙️) in the top right corner
3. Check "Use your own OAuth credentials"
4. Enter your OAuth Client ID and Client Secret
5. Close the settings
6. Select `https://mail.google.com/` under "Gmail API v1" in the left panel
7. Click "Authorize APIs"
8. Sign in with your Google account and allow access
9. Click "Exchange authorization code for tokens"
10. Note down the Refresh Token

## Step 6: Configure Environment Variables

Add the following variables to your `.env` file:

\`\`\`
GMAIL_USER=your-email@gmail.com
GMAIL_CLIENT_ID=your-client-id
GMAIL_CLIENT_SECRET=your-client-secret
GMAIL_REFRESH_TOKEN=your-refresh-token
\`\`\`

## Step 7: Test Email Sending

1. Start your backend server
2. Use the `/api/auth/test-email` endpoint to send a test email
3. Check your inbox to verify the email was sent successfully

## Troubleshooting

- **Invalid Credentials**: Double-check your Client ID, Client Secret, and Refresh Token
- **Access Denied**: Make sure you've enabled the Gmail API and configured the OAuth consent screen correctly
- **Token Expired**: Refresh tokens can expire if unused for an extended period. Generate a new one if needed
- **Quota Exceeded**: Gmail API has usage limits. Check your Google Cloud Console for quota information

## Security Notes

- Keep your Client Secret and Refresh Token secure
- Do not commit these values to your repository
- Use environment variables or a secure secrets manager
- Consider using a dedicated email account for your application
\`\`\`

Let's create a test endpoint for email verification:
