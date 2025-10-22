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