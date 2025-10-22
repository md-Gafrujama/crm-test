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