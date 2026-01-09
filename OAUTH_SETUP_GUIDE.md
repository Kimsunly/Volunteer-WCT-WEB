# OAuth Setup Guide for Volunteer WCT Web

This guide will help you set up OAuth authentication for Google, Facebook, and GitHub.

## Prerequisites

- Node.js and npm installed
- A deployed or local Next.js application
- Access to Google Cloud Console, Facebook Developers, and GitHub

---

## 1. Google OAuth Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API**

### Step 2: Create OAuth 2.0 Credentials

1. Navigate to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Select **Web application**
4. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for local dev)
   - `https://yourdomain.com/api/auth/callback/google` (for production)
5. Copy the **Client ID** and **Client Secret**

### Step 3: Add to .env.local

```env
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

---

## 2. Facebook OAuth Setup

### Step 1: Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click **My Apps** → **Create App**
3. Select **Consumer** or **Business** type
4. Fill in app details and create

### Step 2: Configure Facebook Login

1. In your app dashboard, go to **Add Product** → **Facebook Login**
2. Select **Web** platform
3. Add OAuth redirect URIs:
   - `http://localhost:3000/api/auth/callback/facebook`
   - `https://yourdomain.com/api/auth/callback/facebook`

### Step 3: Get App Credentials

1. Go to **Settings** → **Basic**
2. Copy **App ID** and **App Secret**

### Step 4: Add to .env.local

```env
FACEBOOK_CLIENT_ID=your-facebook-app-id-here
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret-here
```

---

## 3. GitHub OAuth Setup

### Step 1: Register OAuth App

1. Go to [GitHub Settings](https://github.com/settings/developers)
2. Click **OAuth Apps** → **New OAuth App**
3. Fill in application details:
   - **Application name**: Volunteer WCT Web
   - **Homepage URL**: `http://localhost:3000` or your domain
   - **Authorization callback URL**:
     - `http://localhost:3000/api/auth/callback/github`
     - `https://yourdomain.com/api/auth/callback/github`

### Step 2: Generate Client Secret

1. After creating the app, click **Generate a new client secret**
2. Copy the **Client ID** and **Client Secret**

### Step 3: Add to .env.local

```env
GITHUB_CLIENT_ID=your-github-client-id-here
GITHUB_CLIENT_SECRET=your-github-client-secret-here
```

---

## 4. NextAuth Configuration

### Set NextAuth Secret

Generate a random secret for JWT encryption:

```bash
openssl rand -base64 32
```

Add to `.env.local`:

```env
NEXTAUTH_SECRET=your-generated-secret-here
NEXTAUTH_URL=http://localhost:3000
```

For production, set `NEXTAUTH_URL` to your actual domain:

```env
NEXTAUTH_URL=https://yourdomain.com
```

---

## 5. Complete .env.local Example

Create a `.env.local` file in your project root:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production

# Google OAuth
GOOGLE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnop

# Facebook OAuth
FACEBOOK_CLIENT_ID=1234567890123456
FACEBOOK_CLIENT_SECRET=abcdef1234567890abcdef1234567890

# GitHub OAuth
GITHUB_CLIENT_ID=Iv1.1234567890abcdef
GITHUB_CLIENT_SECRET=abcdef1234567890abcdef1234567890abcdef12
```

---

## 6. Testing OAuth Login

### Local Development

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Navigate to: `http://localhost:3000/auth/login`

3. Click on social login buttons (Facebook, Google, GitHub)

4. Verify successful authentication and redirect

### Debugging

- Check browser console for errors
- Verify redirect URIs match exactly
- Ensure all environment variables are loaded
- Check NextAuth API route: `http://localhost:3000/api/auth/providers`

---

## 7. Common Issues & Solutions

### Issue: "Redirect URI mismatch"

**Solution**: Ensure the callback URL in your OAuth app settings matches exactly:

- For local: `http://localhost:3000/api/auth/callback/{provider}`
- For production: `https://yourdomain.com/api/auth/callback/{provider}`

### Issue: "Invalid client_id"

**Solution**: Double-check your Client ID in `.env.local` matches the one in your OAuth app

### Issue: OAuth button not working

**Solution**:

1. Verify NextAuth API route is accessible: `/api/auth/providers`
2. Check if `SessionProvider` is wrapping your app
3. Ensure `signIn()` function is imported from `next-auth/react`

### Issue: Session not persisting

**Solution**: Check that `NEXTAUTH_SECRET` is set and cookies are enabled in browser

---

## 8. Production Deployment

### Vercel

1. Add environment variables in Vercel dashboard:
   - Settings → Environment Variables
2. Add all OAuth credentials
3. Set `NEXTAUTH_URL` to your production domain

### Other Platforms

1. Set environment variables in your hosting platform
2. Update OAuth redirect URIs to production URLs
3. Restart your application

---

## 9. Security Best Practices

✅ **Never commit `.env.local` to version control**  
✅ **Use different OAuth apps for development and production**  
✅ **Rotate secrets regularly**  
✅ **Enable 2FA on all OAuth provider accounts**  
✅ **Monitor OAuth app usage and access logs**  
✅ **Use environment-specific callback URLs**

---

## 10. Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth Guide](https://developers.google.com/identity/protocols/oauth2)
- [Facebook Login Guide](https://developers.facebook.com/docs/facebook-login/)
- [GitHub OAuth Guide](https://docs.github.com/en/developers/apps/building-oauth-apps)

---

## Support

If you encounter issues:

1. Check the [NextAuth.js Troubleshooting Guide](https://next-auth.js.org/configuration/options#debug)
2. Enable debug mode in NextAuth config
3. Check provider-specific documentation

Happy coding! 🚀
