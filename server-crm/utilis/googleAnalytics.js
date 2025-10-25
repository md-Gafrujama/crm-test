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

  
  createAnalyticsClient(accessToken, refreshToken, keyFile = null) {
  if (keyFile) {
    const auth = new GoogleAuth({
      credentials: keyFile,
      scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
    });
    return new BetaAnalyticsDataClient({ auth });
  }

  // ✅ Fallback to OAuth2 (user tokens)
  this.oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  // Use REST API instead of BetaAnalyticsDataClient to avoid gRPC crash
  return {
    runReport: async (request) => {
      const { google } = await import('googleapis');
      const analyticsData = google.analyticsdata('v1beta');
      const res = await analyticsData.properties.runReport({
        ...request,
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return [res.data];
    },
  };}

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
  if (!propertyId || !accessToken) {
    throw new Error('Missing required GA credentials or property ID.');
  }

  try {
    const [activeUsers, sessions, trafficSources, conversions] = await Promise.all([
      this.getActiveUsers(propertyId, accessToken, refreshToken, dateRange).catch(() => []),
      this.getSessions(propertyId, accessToken, refreshToken, dateRange).catch(() => []),
      this.getTrafficSources(propertyId, accessToken, refreshToken, dateRange).catch(() => []),
      this.getConversions(propertyId, accessToken, refreshToken, dateRange).catch(() => [])
    ]);

    return {
      activeUsers,
      sessions,
      trafficSources,
      conversions,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('GA fetch error:', error);
    throw new Error(`Failed to fetch analytics data: ${error.message}`);
  }
}
}

export default new GoogleAnalyticsService();