# Google Analytics (GA4) Integration Setup Guide

## Overview
This integration allows each company in your multi-company CRM to connect their own Google Analytics 4 property and view real-time analytics data including active users, sessions, traffic sources, and conversions.

## Features Implemented
- ✅ OAuth2 authentication for Google Analytics
- ✅ Secure token storage in MongoDB
- ✅ Company-specific analytics isolation
- ✅ Real-time updates via Socket.io
- ✅ Comprehensive dashboard with charts
- ✅ Automatic token refresh handling

## Setup Instructions

### 1. Google Cloud Console Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google Analytics Data API
4. Create OAuth 2.0 credentials:
   - Go to APIs & Services > Credentials
   - Click "Create Credentials" > "OAuth 2.0 Client ID"
   - Set application type to "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3333/google-analytics-callback` (development)
     - `https://your-domain.com/google-analytics-callback` (production)

### 2. Environment Variables
Update your `.env` file with:
```env
# Google OAuth for Analytics
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3333/google-analytics-callback
```

### 3. Database Migration
Run Prisma generate to update the database schema:
```bash
cd server-crm
npx prisma generate
npx prisma db push  # If using MongoDB
```

### 4. Google Analytics 4 Setup
1. Create a GA4 property in [Google Analytics](https://analytics.google.com/)
2. Note down your Property ID (format: 123456789)
3. Ensure the Google account has access to the GA4 property

### 5. Start the Application
```bash
# Start backend
cd server-crm
npm run dev

# Start frontend
cd client-crm
npm run dev
```

## How to Use

### For Company Admins:
1. Navigate to Analytics Dashboard
2. Click "Connect Google Analytics"
3. Authorize with Google (popup window)
4. Enter your GA4 Property ID when prompted
5. View real-time analytics data

### Features Available:
- **Real-time Metrics**: Active users, sessions, conversions
- **Traffic Sources**: Channel-wise session breakdown
- **Historical Data**: 7, 30, 90-day views
- **Live Updates**: Data refreshes every 5 minutes
- **Company Isolation**: Each company sees only their data

## API Endpoints

### Authentication
- `GET /api/ga/auth-url` - Get Google OAuth URL
- `POST /api/ga/oauth-callback` - Handle OAuth callback

### Analytics Data
- `GET /api/ga/data/:companyId` - Get analytics data
- `GET /api/ga/summary/:companyId` - Get analytics summary
- `DELETE /api/ga/disconnect/:companyId` - Disconnect analytics

## Security Features
- JWT authentication required for all endpoints
- Company-specific data isolation
- Secure token storage with encryption
- Automatic token refresh handling
- OAuth2 with proper scopes

## Real-time Updates
- Socket.io connection per company
- Automatic updates every 5 minutes
- Live connection status indicator
- Graceful error handling

## Troubleshooting

### Common Issues:
1. **OAuth Error**: Check redirect URI matches exactly
2. **No Data**: Verify GA4 Property ID is correct
3. **Token Expired**: System auto-refreshes, or reconnect manually
4. **Permission Denied**: Ensure Google account has GA4 access

### Debug Steps:
1. Check browser console for errors
2. Verify environment variables are set
3. Confirm GA4 property has data
4. Test OAuth flow in incognito mode

## File Structure
```
server-crm/
├── api/analytics/
│   ├── analytics.controller.js
│   └── analytics.routes.js
├── utilis/
│   ├── googleAnalytics.js
│   ├── realtimeAnalytics.js
│   └── analyticsScheduler.js

client-crm/
├── src/Components/Analytics/
│   ├── GoogleAnalyticsDashboard.jsx
│   └── GoogleAnalyticsCallback.jsx
```

## Next Steps
1. Configure production OAuth redirect URIs
2. Set up SSL certificates for production
3. Configure rate limiting for API endpoints
4. Add more GA4 metrics as needed
5. Implement data caching for better performance

## Support
For issues or questions, check the console logs and ensure all environment variables are properly configured.