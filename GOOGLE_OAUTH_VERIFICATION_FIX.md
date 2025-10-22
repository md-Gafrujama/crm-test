# Google OAuth Verification Fix - Error 403: access_denied

## 🚨 Problem
```
Access blocked: smartCRMCalendar has not completed the Google verification process
Error 403: access_denied
```

## 🔧 Quick Solutions

### Option 1: Add Test Users (Immediate Fix)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **OAuth consent screen**
3. Scroll down to **Test users** section
4. Click **+ ADD USERS**
5. Add your email: `smartcrmmarketing786@gmail.com`
6. Click **SAVE**
7. Try the OAuth flow again

### Option 2: Publish App (For Production)
1. In **OAuth consent screen**, click **PUBLISH APP**
2. Click **CONFIRM** when prompted
3. Your app will be available to all users immediately

### Option 3: Update OAuth Consent Screen
1. Go to **OAuth consent screen**
2. Click **EDIT APP**
3. Fill required fields:
   - **App name**: `Smart CRM Analytics`
   - **User support email**: `smartcrmmarketing786@gmail.com`
   - **Developer contact email**: `smartcrmmarketing786@gmail.com`
4. Add **Authorized domains** (if using custom domain):
   - `localhost` (for development)
   - Your production domain
5. **Save and Continue**

## 🔐 OAuth Scopes Configuration

Ensure you have the correct scopes:
```
https://www.googleapis.com/auth/analytics.readonly
https://www.googleapis.com/auth/calendar
```

## 🌐 Redirect URIs Configuration

Make sure these are added in **Credentials** → **OAuth 2.0 Client IDs**:
```
http://localhost:3333/google-analytics-callback
http://localhost:5173/google-analytics-callback
https://yourdomain.com/google-analytics-callback (for production)
```

## 🚀 Alternative: Create New OAuth App

If issues persist, create a fresh OAuth application:

1. **Create New Project**:
   - Go to Google Cloud Console
   - Click **Select a project** → **NEW PROJECT**
   - Name: `CRM-Analytics-App`
   - Click **CREATE**

2. **Enable APIs**:
   ```bash
   - Google Analytics Data API
   - Google Calendar API
   ```

3. **Configure OAuth Consent**:
   - **Application type**: External
   - **App name**: CRM Analytics
   - **User support email**: Your email
   - **Scopes**: Add analytics.readonly and calendar scopes
   - **Test users**: Add your email

4. **Create Credentials**:
   - **Credentials** → **+ CREATE CREDENTIALS** → **OAuth 2.0 Client ID**
   - **Application type**: Web application
   - **Name**: CRM Analytics Client
   - **Authorized redirect URIs**: Add your callback URLs

5. **Update Environment Variables**:
   ```env
   GOOGLE_CLIENT_ID=new_client_id
   GOOGLE_CLIENT_SECRET=new_client_secret
   ```

## 🔄 Testing Steps

1. **Clear Browser Cache**: Clear cookies and cache for Google accounts
2. **Use Incognito Mode**: Test OAuth flow in private/incognito window
3. **Check Console Logs**: Look for detailed error messages
4. **Verify Redirect URI**: Ensure exact match between console and code

## 📋 Verification Checklist

- [ ] Test users added to OAuth consent screen
- [ ] Correct scopes configured (analytics.readonly, calendar)
- [ ] Redirect URIs match exactly
- [ ] App published or in testing mode with authorized users
- [ ] Environment variables updated with correct credentials
- [ ] APIs enabled (Analytics Data API, Calendar API)

## 🚨 Common Mistakes

1. **Case Sensitivity**: Redirect URIs are case-sensitive
2. **Trailing Slashes**: Don't add trailing slashes to redirect URIs
3. **HTTP vs HTTPS**: Use HTTP for localhost, HTTPS for production
4. **Port Numbers**: Include port numbers for development URLs

## 💡 Development vs Production

### Development Setup:
```env
GOOGLE_REDIRECT_URI=http://localhost:3333/google-analytics-callback
```

### Production Setup:
```env
GOOGLE_REDIRECT_URI=https://yourdomain.com/google-analytics-callback
```

## 🔍 Debug Information

If you continue having issues, check:

1. **OAuth Consent Screen Status**: Should show "Testing" or "In production"
2. **API Quotas**: Ensure you haven't exceeded API limits
3. **Project Billing**: Some APIs require billing to be enabled
4. **Service Account**: Consider using service account for server-to-server auth

## 📞 Support

If the issue persists:
1. Check Google Cloud Console audit logs
2. Verify your Google account has necessary permissions
3. Try with a different Google account
4. Contact Google Cloud Support if using paid plan

---

**Quick Fix**: Add `smartcrmmarketing786@gmail.com` as a test user in OAuth consent screen!