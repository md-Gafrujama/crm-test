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