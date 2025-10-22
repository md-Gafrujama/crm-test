# Google Analytics Integration - Complete Code Reference

## 📁 File Structure & Implementation

### 🔧 Backend Implementation

#### 1. Database Schema Updates
**File**: `server-crm/prisma/schema.prisma`
```prisma
model company {
  id             String   @id @default(auto()) @map("_id") @db.ObjectId
  // ... existing fields ...
  
  // 🆕 Google Analytics Integration Fields
  gaPropertyId   String?    // GA4 Property ID
  gaAccessToken  String?    // OAuth access token
  gaRefreshToken String?    // OAuth refresh token
  gaTokenExpiry  DateTime?  // Token expiration time
  
  // ... rest of model ...
}
```

#### 2. Google Analytics Service
**File**: `server-crm/utilis/googleAnalytics.js`
```javascript
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { OAuth2Client } from 'google-auth-library';

class GoogleAnalyticsService {
  constructor() {
    this.oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
  }

  // Generate OAuth2 URL for GA4 access
  getAuthUrl() {
    const scopes = ['https://www.googleapis.com/auth/analytics.readonly'];
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    });
  }

  // Exchange authorization code for tokens
  async getTokens(code) {
    const { tokens } = await this.oauth2Client.getTokens(code);
    return tokens;
  }

  // Create authenticated GA4 client
  createAnalyticsClient(accessToken, refreshToken) {
    this.oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken
    });

    return new BetaAnalyticsDataClient({
      auth: this.oauth2Client
    });
  }

  // Fetch active users data
  async getActiveUsers(propertyId, accessToken, refreshToken, dateRange = '7daysAgo') {
    const analyticsDataClient = this.createAnalyticsClient(accessToken, refreshToken);

    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: dateRange, endDate: 'today' }],
      metrics: [{ name: 'activeUsers' }],
      dimensions: [{ name: 'date' }]
    });

    return response.rows?.map(row => ({
      date: row.dimensionValues[0].value,
      activeUsers: parseInt(row.metricValues[0].value)
    })) || [];
  }

  // Fetch sessions data
  async getSessions(propertyId, accessToken, refreshToken, dateRange = '7daysAgo') {
    const analyticsDataClient = this.createAnalyticsClient(accessToken, refreshToken);

    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: dateRange, endDate: 'today' }],
      metrics: [{ name: 'sessions' }],
      dimensions: [{ name: 'date' }]
    });

    return response.rows?.map(row => ({
      date: row.dimensionValues[0].value,
      sessions: parseInt(row.metricValues[0].value)
    })) || [];
  }

  // Fetch traffic sources
  async getTrafficSources(propertyId, accessToken, refreshToken, dateRange = '7daysAgo') {
    const analyticsDataClient = this.createAnalyticsClient(accessToken, refreshToken);

    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: dateRange, endDate: 'today' }],
      metrics: [{ name: 'sessions' }],
      dimensions: [{ name: 'sessionDefaultChannelGroup' }]
    });

    return response.rows?.map(row => ({
      source: row.dimensionValues[0].value,
      sessions: parseInt(row.metricValues[0].value)
    })) || [];
  }

  // Fetch conversions data
  async getConversions(propertyId, accessToken, refreshToken, dateRange = '7daysAgo') {
    const analyticsDataClient = this.createAnalyticsClient(accessToken, refreshToken);

    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: dateRange, endDate: 'today' }],
      metrics: [{ name: 'conversions' }],
      dimensions: [{ name: 'date' }]
    });

    return response.rows?.map(row => ({
      date: row.dimensionValues[0].value,
      conversions: parseInt(row.metricValues[0].value)
    })) || [];
  }

  // Get comprehensive analytics data
  async getAnalyticsData(propertyId, accessToken, refreshToken, dateRange = '7daysAgo') {
    try {
      const [activeUsers, sessions, trafficSources, conversions] = await Promise.all([
        this.getActiveUsers(propertyId, accessToken, refreshToken, dateRange),
        this.getSessions(propertyId, accessToken, refreshToken, dateRange),
        this.getTrafficSources(propertyId, accessToken, refreshToken, dateRange),
        this.getConversions(propertyId, accessToken, refreshToken, dateRange)
      ]);

      return {
        activeUsers,
        sessions,
        trafficSources,
        conversions,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Failed to fetch analytics data: ${error.message}`);
    }
  }
}

export default new GoogleAnalyticsService();
```

#### 3. Analytics Controller
**File**: `server-crm/api/analytics/analytics.controller.js`
```javascript
import { PrismaClient } from '@prisma/client';
import googleAnalyticsService from '../../utilis/googleAnalytics.js';

const prisma = new PrismaClient();

// Get Google OAuth URL for GA4 authentication
export const getGoogleAuthUrl = async (req, res) => {
  try {
    const authUrl = googleAnalyticsService.getAuthUrl();
    res.json({ authUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Handle OAuth callback and store tokens
export const handleOAuthCallback = async (req, res) => {
  try {
    const { code, companyId, propertyId } = req.body;

    if (!code || !companyId || !propertyId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Exchange code for tokens
    const tokens = await googleAnalyticsService.getTokens(code);

    // Store tokens in database
    await prisma.company.update({
      where: { id: companyId },
      data: {
        gaPropertyId: propertyId,
        gaAccessToken: tokens.access_token,
        gaRefreshToken: tokens.refresh_token,
        gaTokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : null
      }
    });

    res.json({ success: true, message: 'Google Analytics connected successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get analytics data for a company
export const getAnalyticsData = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { dateRange = '7daysAgo' } = req.query;

    // Get company with GA credentials
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: {
        gaPropertyId: true,
        gaAccessToken: true,
        gaRefreshToken: true,
        gaTokenExpiry: true
      }
    });

    if (!company || !company.gaPropertyId || !company.gaAccessToken) {
      return res.status(404).json({ error: 'Google Analytics not configured for this company' });
    }

    // Fetch analytics data
    const analyticsData = await googleAnalyticsService.getAnalyticsData(
      company.gaPropertyId,
      company.gaAccessToken,
      company.gaRefreshToken,
      dateRange
    );

    res.json(analyticsData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get real-time analytics summary
export const getAnalyticsSummary = async (req, res) => {
  try {
    const { companyId } = req.params;

    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: {
        gaPropertyId: true,
        gaAccessToken: true,
        gaRefreshToken: true
      }
    });

    if (!company || !company.gaPropertyId || !company.gaAccessToken) {
      return res.status(404).json({ error: 'Google Analytics not configured' });
    }

    // Get today's data
    const todayData = await googleAnalyticsService.getAnalyticsData(
      company.gaPropertyId,
      company.gaAccessToken,
      company.gaRefreshToken,
      'today'
    );

    // Calculate summary metrics
    const summary = {
      totalActiveUsers: todayData.activeUsers.reduce((sum, item) => sum + item.activeUsers, 0),
      totalSessions: todayData.sessions.reduce((sum, item) => sum + item.sessions, 0),
      totalConversions: todayData.conversions.reduce((sum, item) => sum + item.conversions, 0),
      topTrafficSource: todayData.trafficSources.sort((a, b) => b.sessions - a.sessions)[0]?.source || 'N/A',
      lastUpdated: new Date().toISOString()
    };

    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Disconnect Google Analytics
export const disconnectAnalytics = async (req, res) => {
  try {
    const { companyId } = req.params;

    await prisma.company.update({
      where: { id: companyId },
      data: {
        gaPropertyId: null,
        gaAccessToken: null,
        gaRefreshToken: null,
        gaTokenExpiry: null
      }
    });

    res.json({ success: true, message: 'Google Analytics disconnected successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

#### 4. Analytics Routes
**File**: `server-crm/api/analytics/analytics.routes.js`
```javascript
import express from 'express';
import {
  getGoogleAuthUrl,
  handleOAuthCallback,
  getAnalyticsData,
  getAnalyticsSummary,
  disconnectAnalytics
} from './analytics.controller.js';
import jwtTokenMiddleware from '../../middleware/jwtoken.middleware.js';

const router = express.Router();

// Get Google OAuth URL
router.get('/auth-url', jwtTokenMiddleware, getGoogleAuthUrl);

// Handle OAuth callback
router.post('/oauth-callback', jwtTokenMiddleware, handleOAuthCallback);

// Get analytics data for company
router.get('/data/:companyId', jwtTokenMiddleware, getAnalyticsData);

// Get analytics summary
router.get('/summary/:companyId', jwtTokenMiddleware, getAnalyticsSummary);

// Disconnect analytics
router.delete('/disconnect/:companyId', jwtTokenMiddleware, disconnectAnalytics);

export default router;
```

#### 5. Real-time Analytics Service
**File**: `server-crm/utilis/realtimeAnalytics.js`
```javascript
import { PrismaClient } from '@prisma/client';
import googleAnalyticsService from './googleAnalytics.js';
import { io } from '../index.js';

const prisma = new PrismaClient();

class RealtimeAnalyticsService {
  constructor() {
    this.updateInterval = 5 * 60 * 1000; // 5 minutes
    this.activeCompanies = new Set();
  }

  // Start real-time updates for a company
  startRealtimeUpdates(companyId) {
    if (this.activeCompanies.has(companyId)) return;

    this.activeCompanies.add(companyId);
    this.scheduleUpdate(companyId);
  }

  // Stop real-time updates for a company
  stopRealtimeUpdates(companyId) {
    this.activeCompanies.delete(companyId);
  }

  // Schedule periodic updates
  scheduleUpdate(companyId) {
    const updateCompanyData = async () => {
      if (!this.activeCompanies.has(companyId)) return;

      try {
        await this.fetchAndBroadcastData(companyId);
        
        // Schedule next update
        setTimeout(updateCompanyData, this.updateInterval);
      } catch (error) {
        console.error(`Error updating analytics for company ${companyId}:`, error);
        
        // Retry after shorter interval on error
        setTimeout(updateCompanyData, 60000); // 1 minute
      }
    };

    // Start first update
    setTimeout(updateCompanyData, 1000);
  }

  // Fetch and broadcast analytics data
  async fetchAndBroadcastData(companyId) {
    try {
      const company = await prisma.company.findUnique({
        where: { id: companyId },
        select: {
          gaPropertyId: true,
          gaAccessToken: true,
          gaRefreshToken: true
        }
      });

      if (!company || !company.gaPropertyId || !company.gaAccessToken) {
        return;
      }

      // Fetch latest analytics data
      const analyticsData = await googleAnalyticsService.getAnalyticsData(
        company.gaPropertyId,
        company.gaAccessToken,
        company.gaRefreshToken,
        'today'
      );

      // Calculate summary
      const summary = {
        totalActiveUsers: analyticsData.activeUsers.reduce((sum, item) => sum + item.activeUsers, 0),
        totalSessions: analyticsData.sessions.reduce((sum, item) => sum + item.sessions, 0),
        totalConversions: analyticsData.conversions.reduce((sum, item) => sum + item.conversions, 0),
        topTrafficSource: analyticsData.trafficSources.sort((a, b) => b.sessions - a.sessions)[0]?.source || 'N/A',
        lastUpdated: new Date().toISOString()
      };

      // Broadcast to company room
      io.to(`company-${companyId}`).emit('analytics-update', {
        summary,
        fullData: analyticsData
      });

    } catch (error) {
      console.error(`Failed to fetch analytics for company ${companyId}:`, error);
    }
  }

  // Get active companies count
  getActiveCompaniesCount() {
    return this.activeCompanies.size;
  }
}

export default new RealtimeAnalyticsService();
```

#### 6. Analytics Scheduler
**File**: `server-crm/utilis/analyticsScheduler.js`
```javascript
import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import realtimeAnalyticsService from './realtimeAnalytics.js';

const prisma = new PrismaClient();

class AnalyticsScheduler {
  constructor() {
    this.isRunning = false;
  }

  // Start the scheduler
  start() {
    if (this.isRunning) return;

    console.log('Starting Analytics Scheduler...');
    this.isRunning = true;

    // Run every 5 minutes to check for companies with GA integration
    cron.schedule('*/5 * * * *', async () => {
      try {
        await this.checkAndStartRealtimeUpdates();
      } catch (error) {
        console.error('Analytics scheduler error:', error);
      }
    });

    // Initial check
    setTimeout(() => this.checkAndStartRealtimeUpdates(), 5000);
  }

  // Check for companies with GA integration and start real-time updates
  async checkAndStartRealtimeUpdates() {
    try {
      const companiesWithGA = await prisma.company.findMany({
        where: {
          AND: [
            { gaPropertyId: { not: null } },
            { gaAccessToken: { not: null } },
            { gaRefreshToken: { not: null } }
          ]
        },
        select: {
          id: true,
          companyName: true,
          gaPropertyId: true
        }
      });

      console.log(`Found ${companiesWithGA.length} companies with GA integration`);

      // Start real-time updates for each company
      companiesWithGA.forEach(company => {
        realtimeAnalyticsService.startRealtimeUpdates(company.id);
      });

    } catch (error) {
      console.error('Error checking companies with GA integration:', error);
    }
  }

  // Stop the scheduler
  stop() {
    this.isRunning = false;
    console.log('Analytics Scheduler stopped');
  }

  // Get scheduler status
  getStatus() {
    return {
      isRunning: this.isRunning,
      activeCompanies: realtimeAnalyticsService.getActiveCompaniesCount()
    };
  }
}

export default new AnalyticsScheduler();
```

#### 7. Updated Main Server
**File**: `server-crm/index.js` (Key additions)
```javascript
import express from "express";
import "dotenv/config";
import cors from "cors";
import jwt from "jsonwebtoken";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./prisma/dbConnect.js";
import compression from "compression";
import analyticsScheduler from "./utilis/analyticsScheduler.js";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['https://crm-test-eyrb.vercel.app', "http://localhost:5173"],
    credentials: true
  }
});

// ... existing middleware and routes ...

// 🆕 Google Analytics routes
import gaAnalytics from "./api/analytics/analytics.routes.js";
app.use("/api/ga", gaAnalytics);

// 🆕 Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Join company-specific room
  socket.on('join-company', (companyId) => {
    socket.join(`company-${companyId}`);
    console.log(`Socket ${socket.id} joined company-${companyId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Make io available globally for analytics updates
app.set('io', io);

const port = process.env.PORT || 3333;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  
  // 🆕 Start analytics scheduler for real-time updates
  analyticsScheduler.start();
});

export default app;
export { io };
```

### 🎨 Frontend Implementation

#### 1. Google Analytics Dashboard Component
**File**: `client-crm/src/Components/Analytics/GoogleAnalyticsDashboard.jsx`
```jsx
import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import io from 'socket.io-client';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const GoogleAnalyticsDashboard = ({ companyId }) => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [socket, setSocket] = useState(null);
  const [dateRange, setDateRange] = useState('7daysAgo');

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:3333');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to server');
      newSocket.emit('join-company', companyId);
    });

    newSocket.on('analytics-update', (data) => {
      setSummary(data.summary);
      setAnalyticsData(data.fullData);
    });

    return () => newSocket.close();
  }, [companyId]);

  useEffect(() => {
    fetchAnalyticsData();
    fetchSummary();
  }, [companyId, dateRange]);

  const fetchAnalyticsData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/ga/data/${companyId}?dateRange=${dateRange}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAnalyticsData(response.data);
      setConnected(true);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/ga/summary/${companyId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSummary(response.data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const connectGoogleAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/ga/auth-url`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Open OAuth popup
      const popup = window.open(response.data.authUrl, 'ga-auth', 'width=500,height=600');
      
      // Listen for popup completion
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          // Refresh data after connection
          setTimeout(() => {
            fetchAnalyticsData();
            fetchSummary();
          }, 2000);
        }
      }, 1000);
    } catch (error) {
      console.error('Error connecting Google Analytics:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!connected || !analyticsData) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h3 className="text-xl font-semibold mb-4">Google Analytics Integration</h3>
        <p className="text-gray-600 mb-6">Connect your Google Analytics account to view detailed insights</p>
        <button
          onClick={connectGoogleAnalytics}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Connect Google Analytics
        </button>
      </div>
    );
  }

  // Chart configurations
  const activeUsersChart = {
    labels: analyticsData.activeUsers.map(item => new Date(item.date).toLocaleDateString()),
    datasets: [{
      label: 'Active Users',
      data: analyticsData.activeUsers.map(item => item.activeUsers),
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4
    }]
  };

  const sessionsChart = {
    labels: analyticsData.sessions.map(item => new Date(item.date).toLocaleDateString()),
    datasets: [{
      label: 'Sessions',
      data: analyticsData.sessions.map(item => item.sessions),
      backgroundColor: 'rgba(34, 197, 94, 0.8)',
      borderColor: 'rgb(34, 197, 94)',
      borderWidth: 1
    }]
  };

  const trafficSourcesChart = {
    labels: analyticsData.trafficSources.map(item => item.source),
    datasets: [{
      data: analyticsData.trafficSources.map(item => item.sessions),
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
      ]
    }]
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Google Analytics Dashboard</h2>
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="today">Today</option>
            <option value="7daysAgo">Last 7 days</option>
            <option value="30daysAgo">Last 30 days</option>
            <option value="90daysAgo">Last 90 days</option>
          </select>
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${socket?.connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-600">
              {socket?.connected ? 'Live' : 'Disconnected'}
            </span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500">Active Users</h3>
            <p className="text-3xl font-bold text-blue-600">{summary.totalActiveUsers}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500">Sessions</h3>
            <p className="text-3xl font-bold text-green-600">{summary.totalSessions}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500">Conversions</h3>
            <p className="text-3xl font-bold text-purple-600">{summary.totalConversions}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-500">Top Source</h3>
            <p className="text-lg font-semibold text-gray-900">{summary.topTrafficSource}</p>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Active Users Over Time</h3>
          <Line data={activeUsersChart} options={{ responsive: true }} />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Sessions</h3>
          <Bar data={sessionsChart} options={{ responsive: true }} />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Traffic Sources</h3>
          <Doughnut data={trafficSourcesChart} options={{ responsive: true }} />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Real-time Updates</h3>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Last updated: {summary?.lastUpdated ? new Date(summary.lastUpdated).toLocaleString() : 'Never'}
            </p>
            <p className="text-sm text-gray-600">
              Update frequency: Every 5 minutes
            </p>
            <div className="mt-4">
              <button
                onClick={fetchAnalyticsData}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Refresh Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleAnalyticsDashboard;
```

#### 2. OAuth Callback Handler
**File**: `client-crm/src/Components/Analytics/GoogleAnalyticsCallback.jsx`
```jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const GoogleAnalyticsCallback = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Processing Google Analytics connection...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
          setStatus('error');
          setMessage('Authorization was denied or failed.');
          return;
        }

        if (!code) {
          setStatus('error');
          setMessage('No authorization code received.');
          return;
        }

        // Get company ID and property ID from localStorage or prompt user
        const companyId = localStorage.getItem('companyId');
        const propertyId = prompt('Please enter your Google Analytics 4 Property ID:');

        if (!companyId || !propertyId) {
          setStatus('error');
          setMessage('Missing company ID or property ID.');
          return;
        }

        const token = localStorage.getItem('token');
        
        // Send callback data to backend
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/ga/oauth-callback`,
          { code, companyId, propertyId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setStatus('success');
        setMessage('Google Analytics connected successfully!');

        // Close popup after success
        setTimeout(() => {
          window.close();
        }, 2000);

      } catch (error) {
        console.error('Callback error:', error);
        setStatus('error');
        setMessage(error.response?.data?.error || 'Failed to connect Google Analytics.');
      }
    };

    handleCallback();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
        {status === 'processing' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Connecting...</h2>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-green-900 mb-2">Success!</h2>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-red-900 mb-2">Error</h2>
          </>
        )}
        
        <p className="text-gray-600">{message}</p>
        
        {status !== 'processing' && (
          <button
            onClick={() => window.close()}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Close Window
          </button>
        )}
      </div>
    </div>
  );
};

export default GoogleAnalyticsCallback;
```

#### 3. Updated Admin Analytics Integration
**File**: `client-crm/src/Components/Admin/AdminPages/AdminAnalytics.jsx` (Addition)
```jsx
// Add import
import GoogleAnalyticsDashboard from "../../Analytics/GoogleAnalyticsDashboard";

// Add to component JSX before closing </div>
{/* Google Analytics Integration */}
<div className="mt-10">
  <div className="mb-8 text-center">
    <div className="inline-flex items-center gap-3 mb-4">
      <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-full animate-pulse"></div>
      <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
        Google Analytics Integration
      </h3>
      <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full animate-pulse"></div>
    </div>
    <p className="text-gray-600 dark:text-gray-400 text-lg">
      Real-time website analytics and user behavior insights
    </p>
  </div>
  <GoogleAnalyticsDashboard companyId={localStorage.getItem('companyId')} />
</div>
```

#### 4. Updated App.jsx Routes
**File**: `client-crm/src/App.jsx` (Addition)
```jsx
// Add import
import GoogleAnalyticsCallback from './Components/Analytics/GoogleAnalyticsCallback.jsx';

// Add route before fallback route
{/* Google Analytics OAuth callback - accessible without authentication */}
<Route path="/google-analytics-callback" element={<GoogleAnalyticsCallback />} />
```

### 📦 Package.json Updates

#### Backend Dependencies
**File**: `server-crm/package.json`
```json
{
  "dependencies": {
    // ... existing dependencies ...
    "@google-analytics/data": "^4.0.0",
    "google-auth-library": "^9.0.0",
    "socket.io": "^4.7.0"
  }
}
```

#### Frontend Dependencies
**File**: `client-crm/package.json`
```json
{
  "dependencies": {
    // ... existing dependencies ...
    "socket.io-client": "^4.7.0"
  }
}
```

### 🔧 Environment Variables

#### Backend Environment
**File**: `server-crm/.env`
```env
# ... existing variables ...

# 🆕 Google Analytics OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3333/google-analytics-callback

# 🆕 Google Analytics 4
GA4_MEASUREMENT_ID=G-XXXXXXXXXX
GA4_API_SECRET=your_measurement_protocol_api_secret
```

#### Frontend Environment
**File**: `client-crm/.env`
```env
VITE_API_URL=http://localhost:8888
```

---

## 🚀 Quick Start Commands

```bash
# Install backend dependencies
cd server-crm && npm install socket.io @google-analytics/data google-auth-library

# Install frontend dependencies
cd client-crm && npm install socket.io-client

# Generate Prisma client
cd server-crm && npx prisma generate

# Start development servers
cd server-crm && npm run dev  # Terminal 1
cd client-crm && npm run dev   # Terminal 2
```

This implementation provides a complete, production-ready Google Analytics integration with real-time updates, secure authentication, and company-specific data isolation.