# Multi-Company CRM with Google Analytics (GA4) Integration

## 🚀 Overview

A comprehensive multi-company CRM system built with Node.js, Express, MongoDB, and React.js, featuring integrated Google Analytics (GA4) with real-time dashboards, OAuth2 authentication, and company-specific data isolation.

## ✨ Key Features

### 🔐 Authentication & Security
- JWT-based authentication
- OAuth2 integration with Google Analytics
- Company-specific data isolation
- Secure token storage in MongoDB
- Role-based access control (Admin, User, SuperAdmin)

### 📊 Google Analytics Integration
- **Real-time Analytics**: Live data updates every 5 minutes
- **Multi-tenant Support**: Each company has separate GA4 property
- **Comprehensive Metrics**: Active users, sessions, traffic sources, conversions
- **Interactive Dashboards**: Charts and visualizations using Chart.js
- **Historical Data**: 7, 30, 90-day analytics views
- **Socket.io Integration**: Real-time updates without page refresh

### 🏢 CRM Features
- Lead management and tracking
- User and employee management
- Calendar integration with Google Calendar
- Real-time notifications and alerts
- Activity tracking and reporting
- External data integration (Quore B2B, Compare Bazar)

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Prisma ORM
- **Authentication**: JWT + OAuth2
- **Real-time**: Socket.io
- **Analytics**: Google Analytics Data API
- **File Upload**: Cloudinary
- **Email**: Nodemailer
- **Caching**: Redis (Upstash)

### Frontend
- **Framework**: React.js (Vite)
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **Charts**: Chart.js + React Chart.js 2
- **Icons**: Lucide React
- **Notifications**: React Toastify
- **Real-time**: Socket.io Client

## 📁 Project Structure

```
crm-test/
├── client-crm/                          # React Frontend
│   ├── .vite/                           # Vite build cache
│   │   └── deps/                        # Dependencies cache
│   ├── src/
│   │   ├── Components/
│   │   │   ├── Admin/                    # Admin Components
│   │   │   │   ├── AdminPages/
│   │   │   │   │   ├── Calendar/         # Calendar Management
│   │   │   │   │   │   ├── components/
│   │   │   │   │   │   │   ├── CalendarGrid.jsx
│   │   │   │   │   │   │   ├── CalendarHeader.jsx
│   │   │   │   │   │   │   ├── EventForm.jsx
│   │   │   │   │   │   │   ├── EventsList.jsx
│   │   │   │   │   │   │   ├── MonthlyStats.jsx
│   │   │   │   │   │   │   └── MonthYearPicker.jsx
│   │   │   │   │   │   ├── services/
│   │   │   │   │   │   │   └── calendarApi.js
│   │   │   │   │   │   ├── utils/
│   │   │   │   │   │   │   ├── authUtils.js
│   │   │   │   │   │   │   └── calendarUtils.js
│   │   │   │   │   │   └── Calendar.jsx
│   │   │   │   │   ├── dashboard/        # Admin Dashboard
│   │   │   │   │   │   ├── Dashboard.jsx
│   │   │   │   │   │   ├── DashboardOverview.jsx
│   │   │   │   │   │   ├── QuickActions.jsx
│   │   │   │   │   │   └── RecentActivities.jsx
│   │   │   │   │   ├── AdminAnalytics.jsx # 🆕 Analytics Dashboard
│   │   │   │   │   ├── AllUsers.jsx      # User Management
│   │   │   │   │   ├── DataSecurity.jsx  # Security Settings
│   │   │   │   │   ├── EmployeePage.jsx  # Employee Management
│   │   │   │   │   ├── GoogleCalendarCallback.jsx # Calendar OAuth
│   │   │   │   │   ├── Lockedusers.jsx   # Locked Users Management
│   │   │   │   │   └── PaymentSubscription.jsx # Payment Management
│   │   │   │   ├── common/               # Shared Admin Components
│   │   │   │   │   ├── CommentComponents.jsx
│   │   │   │   │   ├── Footer.jsx
│   │   │   │   │   ├── Header.jsx
│   │   │   │   │   └── sidebar.jsx
│   │   │   │   ├── constants/
│   │   │   │   │   └── index.jsx
│   │   │   │   ├── ExternalData/         # External Data Integration
│   │   │   │   │   ├── Comparebazar.jsx
│   │   │   │   │   ├── CompareComments.jsx
│   │   │   │   │   ├── Quoreb2b.jsx
│   │   │   │   │   └── QuoreComments.jsx
│   │   │   │   ├── Forms/                # Admin Forms
│   │   │   │   │   ├── AddEmployeeForm.jsx
│   │   │   │   │   ├── AlertsandReminderForm.jsx
│   │   │   │   │   ├── ContactQuore.jsx
│   │   │   │   │   ├── EditEmployee.jsx
│   │   │   │   │   ├── EditUser.jsx
│   │   │   │   │   ├── forgetPassword.jsx
│   │   │   │   │   ├── RealtimeTracking.jsx
│   │   │   │   │   ├── register.jsx
│   │   │   │   │   ├── sign.jsx
│   │   │   │   │   └── UpdatePassword.jsx
│   │   │   │   └── Leads/                # Lead Management
│   │   │   │       ├── LeadsActivity/
│   │   │   │       │   ├── components/
│   │   │   │       │   │   ├── DeleteLead.jsx
│   │   │   │       │   │   ├── EditLead.jsx
│   │   │   │       │   │   ├── LeadsTable.jsx
│   │   │   │       │   │   ├── UtilityComponents.jsx
│   │   │   │       │   │   └── ViewLead.jsx
│   │   │   │       │   ├── services/
│   │   │   │       │   │   └── leadsApi.js
│   │   │   │       │   └── LeadsActivity.jsx
│   │   │   │       ├── AddLeadsForm.jsx
│   │   │   │       └── QuoreLeads.jsx
│   │   │   ├── Analytics/                # 🆕 GA4 Integration
│   │   │   │   ├── GoogleAnalyticsDashboard.jsx
│   │   │   │   └── GoogleAnalyticsCallback.jsx
│   │   │   ├── CombinedForUser&Admin/    # Shared Components
│   │   │   │   ├── AlertsAndReminderDisplay.jsx
│   │   │   │   ├── AllActivities.jsx
│   │   │   │   ├── AllEmployees.jsx
│   │   │   │   ├── AllLockedUsers.jsx
│   │   │   │   ├── CombinedAlertReminder.jsx
│   │   │   │   ├── CombinedAlertReminderDisplay.jsx
│   │   │   │   ├── CombinedLeadForm.jsx
│   │   │   │   ├── CombinedRealtimeTracking.jsx
│   │   │   │   └── StatusHistoryPopup.jsx
│   │   │   ├── common/                   # Global Components
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── Navbar.jsx
│   │   │   ├── Landing/                  # Landing Page
│   │   │   │   └── LandingPage.jsx
│   │   │   ├── SuperAdmin/               # Super Admin Components
│   │   │   │   ├── common/
│   │   │   │   │   ├── Footer.jsx
│   │   │   │   │   ├── Header.jsx
│   │   │   │   │   └── sidebar.jsx
│   │   │   │   ├── constants/
│   │   │   │   │   └── index.jsx
│   │   │   │   └── SuperAdminPages/
│   │   │   │       └── dashboard.jsx
│   │   │   ├── Tracking/                 # Analytics Tracking
│   │   │   │   └── PageTimeTracker.jsx
│   │   │   └── User/                     # User Components
│   │   │       ├── common/
│   │   │       │   ├── PersonalDetails.jsx
│   │   │       │   ├── UserFooter.jsx
│   │   │       │   ├── UserHeader.jsx
│   │   │       │   └── UserSidebar.jsx
│   │   │       ├── constants/
│   │   │       │   └── index.jsx
│   │   │       ├── Leads/
│   │   │       │   └── UserLeads.jsx
│   │   │       └── UserPages/
│   │   │           ├── ConnectSocialMedia.jsx
│   │   │           ├── UserAnalytics.jsx
│   │   │           ├── UserDashboard.jsx
│   │   │           ├── userProfile.jsx
│   │   │           ├── UserReport.jsx
│   │   │           └── UserSettings.jsx
│   │   ├── config/                       # Configuration
│   │   │   └── api.js
│   │   ├── contexts/                     # React Contexts
│   │   │   ├── SearchContext.jsx
│   │   │   └── theme-context.jsx
│   │   ├── hooks/                        # Custom Hooks
│   │   │   ├── use-click-outside.jsx
│   │   │   └── use-theme.jsx
│   │   ├── Pages/                        # Page Components
│   │   │   ├── login.jsx
│   │   │   ├── Otp.jsx
│   │   │   ├── protectedRoute.js
│   │   │   └── superadmin.jsx
│   │   ├── routes/                       # Routing
│   │   │   └── layout.jsx
│   │   ├── utils/                        # Utilities
│   │   │   └── cn.js
│   │   ├── App.css                       # Global Styles
│   │   ├── App.jsx                       # 🆕 Updated with GA4 routes
│   │   ├── index.css                     # Base Styles
│   │   └── main.jsx                      # App Entry Point
│   ├── .env                             # Environment Variables
│   ├── .gitignore                       # Git Ignore
│   ├── eslint.config.js                 # ESLint Configuration
│   ├── index.html                       # HTML Template
│   ├── package-lock.json                # Package Lock
│   ├── package.json                     # 🆕 Updated with Socket.io
│   ├── postcss.config.js                # PostCSS Configuration
│   ├── README.md                        # Frontend README
│   ├── tailwind.config.js               # Tailwind Configuration
│   ├── vercel.json                      # Vercel Deployment
│   └── vite.config.js                   # Vite Configuration
│
├── server-crm/                          # Node.js Backend
│   ├── api/
│   │   ├── admin/                        # Admin APIs
│   │   │   ├── analytics.controller.js
│   │   │   └── analytics.routes.js
│   │   ├── alerts/                       # Alerts & Reminders
│   │   │   ├── alerts.controller.js
│   │   │   └── alerts.routes.js
│   │   ├── analytics/                    # 🆕 GA4 API Routes
│   │   │   ├── analytics.controller.js   # 🆕 GA4 Controller
│   │   │   └── analytics.routes.js       # 🆕 GA4 Routes
│   │   ├── auth/                         # Authentication APIs
│   │   │   ├── changePass.controller.js
│   │   │   ├── changePass.routes.js
│   │   │   ├── conformPass.controller.js
│   │   │   ├── conformPass.routes.js
│   │   │   ├── login.controller.js
│   │   │   ├── login.routes.js
│   │   │   ├── OTP.controller.js
│   │   │   ├── OTP.routes.js
│   │   │   ├── updateUser.js
│   │   │   ├── userProfile.controller.js
│   │   │   └── userProfile.routes.js
│   │   ├── calendar/                     # Calendar APIs
│   │   │   ├── calendar.controller.js
│   │   │   └── calendar.routes.js
│   │   ├── company/                      # Company Management
│   │   │   ├── companie.routes.js
│   │   │   ├── companies.controller.js
│   │   │   ├── otp.controller.js
│   │   │   └── otp.routes.js
│   │   ├── customer/                     # Customer APIs
│   │   │   ├── allUsers.contoller.js
│   │   │   ├── allUsers.routes.js
│   │   │   ├── editProfile.controller.js
│   │   │   ├── editProfile.routes.js
│   │   │   ├── recentActivities.api.js
│   │   │   ├── user.controller.js
│   │   │   ├── user.routes.js
│   │   │   ├── userData.contoller.js
│   │   │   └── userData.routes.js
│   │   ├── employee/                     # Employee APIs
│   │   │   ├── employee.controller.js
│   │   │   ├── employee.route.js
│   │   │   ├── employeeProfile.controller.js
│   │   │   └── employeeProfile.routes.js
│   │   ├── external/                     # External Data APIs
│   │   │   ├── compBaz.controller.js
│   │   │   ├── compBaz.routes.js
│   │   │   ├── qb2b.controller.js
│   │   │   └── qb2b.routes.js
│   │   ├── googleCalendar/               # Google Calendar APIs
│   │   │   ├── googleCalendar.controller.js
│   │   │   └── googleCalendar.routes.js
│   │   ├── leads/                        # Lead Management APIs
│   │   │   ├── exportLeads.js
│   │   │   ├── leads.contoller.js
│   │   │   ├── leads.routes.js
│   │   │   ├── leads.services.js
│   │   │   └── udleads.api.js
│   │   ├── OAuth/                        # OAuth APIs
│   │   │   ├── oauth.controller.js
│   │   │   └── oauth.routes.js
│   │   ├── security/                     # Security APIs
│   │   │   ├── security.controller.js
│   │   │   └── security.routes.js
│   │   └── superAdmin/                   # Super Admin APIs
│   │       ├── otp.controller.js
│   │       ├── superAdmin.controller.js
│   │       ├── superAdminSecond.controller.js
│   │       └── superAmin.routes.js
│   ├── automate/                         # Automation
│   │   ├── automate.controller.js
│   │   └── automate.routes.js
│   ├── middleware/                       # Express Middleware
│   │   ├── authenication.middleware.js
│   │   ├── cors.middleware.js
│   │   ├── googleCalendar.middleware.js
│   │   ├── jwtoken.middleware.js
│   │   ├── redis.middleware.js
│   │   ├── superAdmin.middleware.js
│   │   └── updatePassword.middleware.js
│   ├── prisma/                          # Database Schema & Client
│   │   ├── dbConnect.js
│   │   ├── migrateLeads.js
│   │   ├── prismaClient.js
│   │   └── schema.prisma                # 🆕 Updated with GA4 fields
│   ├── uploads/                         # File Uploads Directory
│   ├── utilis/                          # Utility Functions
│   │   ├── analyticsScheduler.js        # 🆕 Analytics Scheduler
│   │   ├── csvExporter.js
│   │   ├── fileUpload.js
│   │   ├── googleAnalytics.js           # 🆕 GA4 Service
│   │   ├── googleCalendar.js
│   │   ├── googleClient.js
│   │   └── realtimeAnalytics.js         # 🆕 Real-time Updates
│   ├── .env                             # 🆕 Updated with GA4 config
│   ├── .gitignore                       # Git Ignore
│   ├── index.js                         # 🆕 Updated with Socket.io
│   ├── package-lock.json                # Package Lock
│   ├── package.json                     # 🆕 Updated with GA4 dependencies
│   └── vercel.json                      # Vercel Deployment
│
├── GOOGLE_ANALYTICS_SETUP.md            # 🆕 GA4 Setup Guide
├── IMPLEMENTATION_REFERENCE.md          # 🆕 Complete Code Reference
└── README.md                            # This file
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account
- Google Cloud Console account
- Google Analytics 4 property

### 1. Clone Repository
```bash
git clone <repository-url>
cd crm-test
```

### 2. Backend Setup
```bash
cd server-crm
npm install

# Install new GA4 dependencies
npm install socket.io @google-analytics/data google-auth-library
```

### 3. Frontend Setup
```bash
cd client-crm
npm install

# Install Socket.io client
npm install socket.io-client
```

### 4. Environment Configuration

Create/update `server-crm/.env`:
```env
# Server Configuration
PORT=8888

# Database
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/database"

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Email Configuration
EMAIL=your_email@gmail.com
PASSWORD=your_app_password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Redis
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token

# Google OAuth (Calendar & Analytics)
CLIENT_ID=your_google_client_id
CLIENT_SECRET=your_google_client_secret

# 🆕 Google Analytics OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3333/google-analytics-callback

# 🆕 Google Analytics 4
GA4_MEASUREMENT_ID=G-XXXXXXXXXX
GA4_API_SECRET=your_measurement_protocol_api_secret
```

Create `client-crm/.env`:
```env
VITE_API_URL=http://localhost:8888
```

### 5. Database Setup
```bash
cd server-crm
npx prisma generate
npx prisma db push
```

### 6. Google Cloud Console Setup

1. **Enable APIs**:
   - Google Analytics Data API
   - Google Calendar API

2. **Create OAuth2 Credentials**:
   - Application type: Web application
   - Authorized redirect URIs:
     - `http://localhost:3333/google-analytics-callback`
     - `http://localhost:5173/google-analytics-callback`

3. **Get GA4 Property ID**:
   - Go to Google Analytics
   - Admin → Property Settings
   - Copy Property ID (format: 123456789)

## 🚀 Running the Application

### Development Mode
```bash
# Terminal 1 - Backend
cd server-crm
npm run dev

# Terminal 2 - Frontend
cd client-crm
npm run dev
```

### Production Mode
```bash
# Backend
cd server-crm
npm start

# Frontend
cd client-crm
npm run build
npm run preview
```

## 📊 Google Analytics Integration Usage

### For Company Admins:

1. **Connect Google Analytics**:
   - Navigate to Analytics Dashboard
   - Click "Connect Google Analytics"
   - Authorize with Google (popup)
   - Enter GA4 Property ID
   - Start viewing real-time data

2. **Available Metrics**:
   - Active Users (real-time)
   - Sessions (daily/weekly/monthly)
   - Traffic Sources (channels)
   - Conversions (goals/events)
   - Historical trends

3. **Real-time Features**:
   - Live connection status
   - Auto-refresh every 5 minutes
   - Socket.io real-time updates
   - Interactive charts

## 🔌 API Endpoints

### Google Analytics APIs
```
GET    /api/ga/auth-url              # Get OAuth URL
POST   /api/ga/oauth-callback        # Handle OAuth callback
GET    /api/ga/data/:companyId       # Get analytics data
GET    /api/ga/summary/:companyId    # Get analytics summary
DELETE /api/ga/disconnect/:companyId # Disconnect analytics
```

### Existing CRM APIs
```
# Authentication
POST   /api/login                    # User login
POST   /api/registerComp             # Company registration

# User Management
GET    /api/allUser                  # Get all users
POST   /api/addUser                  # Add new user
PUT    /api/editProfile/:id          # Edit user profile

# Lead Management
GET    /api/leads                    # Get leads
POST   /api/leads                    # Create lead
PUT    /api/leads/:id                # Update lead
DELETE /api/leads/:id                # Delete lead

# Analytics (Internal)
GET    /api/analytics/users          # User analytics
GET    /api/analytics/leads          # Lead analytics
```

## 🔐 Security Features

### Authentication Flow
1. **JWT Authentication**: All API endpoints protected
2. **OAuth2 Integration**: Secure Google account linking
3. **Company Isolation**: Each company sees only their data
4. **Token Management**: Automatic refresh handling
5. **Role-based Access**: Admin, User, SuperAdmin roles

### Data Protection
- Encrypted token storage
- Company-specific data queries
- Secure API endpoints
- Input validation and sanitization

## 🔄 Real-time Architecture

### Socket.io Implementation
```javascript
// Server-side (index.js)
io.on('connection', (socket) => {
  socket.on('join-company', (companyId) => {
    socket.join(`company-${companyId}`);
  });
});

// Real-time analytics updates
io.to(`company-${companyId}`).emit('analytics-update', data);
```

### Client-side Integration
```javascript
// React component
const socket = io(API_URL);
socket.emit('join-company', companyId);
socket.on('analytics-update', (data) => {
  setAnalyticsData(data);
});
```

## 📈 Analytics Scheduler

Automatic background service that:
- Checks for companies with GA4 integration
- Starts real-time updates every 5 minutes
- Handles token refresh automatically
- Manages multiple company connections
- Provides graceful error handling

## 🎨 Frontend Components

### GoogleAnalyticsDashboard.jsx
```jsx
// Key features:
- Real-time metrics display
- Interactive charts (Line, Bar, Doughnut)
- Date range selection
- Live connection status
- OAuth integration flow
```

### GoogleAnalyticsCallback.jsx
```jsx
// OAuth callback handler:
- Processes authorization code
- Stores tokens securely
- Handles errors gracefully
- Auto-closes popup window
```

## 🗄️ Database Schema Updates

### Company Model (Prisma)
```prisma
model company {
  // ... existing fields
  
  // 🆕 Google Analytics Integration
  gaPropertyId   String?
  gaAccessToken  String?
  gaRefreshToken String?
  gaTokenExpiry  DateTime?
}
```

## 🔧 Configuration Files

### Package.json Updates
```json
// server-crm/package.json
{
  "dependencies": {
    "@google-analytics/data": "^4.0.0",
    "google-auth-library": "^9.0.0",
    "socket.io": "^4.7.0"
  }
}

// client-crm/package.json
{
  "dependencies": {
    "socket.io-client": "^4.7.0"
  }
}
```

## 🚨 Troubleshooting

### Common Issues & Solutions

1. **OAuth Redirect Mismatch**
   ```
   Error: redirect_uri_mismatch
   Solution: Ensure redirect URI in Google Console matches exactly
   ```

2. **No Analytics Data**
   ```
   Issue: Empty charts/metrics
   Solution: Verify GA4 Property ID and data availability
   ```

3. **Socket Connection Failed**
   ```
   Issue: Real-time updates not working
   Solution: Check CORS settings and Socket.io configuration
   ```

4. **Token Expired**
   ```
   Issue: Authentication errors
   Solution: System auto-refreshes, or reconnect manually
   ```

## 🔄 Development Workflow

### Adding New Analytics Metrics
1. Update `googleAnalytics.js` service
2. Add new API endpoint in controller
3. Update frontend dashboard component
4. Test with real GA4 data

### Extending Real-time Features
1. Modify `realtimeAnalytics.js`
2. Update Socket.io event handlers
3. Add frontend listeners
4. Test multi-company isolation

## 🚀 Deployment

### Production Checklist
- [ ] Update OAuth redirect URIs for production domain
- [ ] Configure SSL certificates
- [ ] Set production environment variables
- [ ] Enable rate limiting
- [ ] Configure MongoDB Atlas
- [ ] Set up Redis caching
- [ ] Configure Cloudinary
- [ ] Test GA4 integration end-to-end

### Environment-specific Configs
```bash
# Development
GOOGLE_REDIRECT_URI=http://localhost:3333/google-analytics-callback

# Production
GOOGLE_REDIRECT_URI=https://yourdomain.com/google-analytics-callback
```

## 📝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/analytics-enhancement`)
3. Commit changes (`git commit -am 'Add new analytics feature'`)
4. Push to branch (`git push origin feature/analytics-enhancement`)
5. Create Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Support

For support and questions:
- Check console logs for errors
- Verify environment variables
- Test OAuth flow in incognito mode
- Ensure GA4 property has data
- Contact development team

---

## 🎯 Next Steps & Roadmap

- [ ] Add more GA4 metrics (bounce rate, page views, etc.)
- [ ] Implement data caching for better performance
- [ ] Add export functionality for analytics data
- [ ] Create analytics alerts and notifications
- [ ] Integrate with Google Analytics Intelligence API
- [ ] Add custom dashboard builder
- [ ] Implement analytics data visualization improvements

---

**Built with ❤️ for multi-company CRM analytics**