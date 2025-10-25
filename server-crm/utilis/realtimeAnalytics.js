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
  if (this.activeCompanies.has(companyId)) return; // already scheduled

  this.activeCompanies.add(companyId);
  let retryCount = 0;
  const maxRetries = 5;

  const updateCompanyData = async () => {
    if (!this.activeCompanies.has(companyId)) return;

    try {
      await this.fetchAndBroadcastData(companyId);
      retryCount = 0; // reset retry counter after success
      setTimeout(updateCompanyData, this.updateInterval);
    } catch (error) {
      console.error(`Error updating analytics for company ${companyId}:`, error.message);
      retryCount++;

      const delay = retryCount > maxRetries ? this.updateInterval : 60000; // short retry until maxRetries
      setTimeout(updateCompanyData, delay);
    }
  };

  // Start first update after 1 second
  setTimeout(updateCompanyData, 1000);
}

  // Fetch and broadcast analytics data
 async fetchAndBroadcastData(companyId) {
  try {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: { gaPropertyId: true, gaAccessToken: true, gaRefreshToken: true }
    });

    if (!company?.gaPropertyId || !company?.gaAccessToken) return;

    const analyticsData = await googleAnalyticsService.getAnalyticsData(
      company.gaPropertyId,
      company.gaAccessToken,
      company.gaRefreshToken,
      'today'
    );

    // Safely calculate summary
    const summary = {
      totalActiveUsers: (analyticsData.activeUsers ?? []).reduce((sum, item) => sum + (item.activeUsers ?? 0), 0),
      totalSessions: (analyticsData.sessions ?? []).reduce((sum, item) => sum + (item.sessions ?? 0), 0),
      totalConversions: (analyticsData.conversions ?? []).reduce((sum, item) => sum + (item.conversions ?? 0), 0),
      topTrafficSource: (analyticsData.trafficSources ?? []).sort((a, b) => (b.sessions ?? 0) - (a.sessions ?? 0))[0]?.source || 'N/A',
      lastUpdated: new Date().toISOString()
    };

    // Safe socket emit
    try {
      io.to(`company-${companyId}`).emit('analytics-update', { summary, fullData: analyticsData });
    } catch (socketError) {
      console.warn(`Socket emit failed for company ${companyId}:`, socketError.message);
    }

    return summary;

  } catch (error) {
    console.error(`Failed to fetch analytics for company ${companyId}:`, error.message);
    return null; // graceful failure
  }
}
  // Get active companies count
  getActiveCompaniesCount() {
    return this.activeCompanies.size;
  }
}

export default new RealtimeAnalyticsService();