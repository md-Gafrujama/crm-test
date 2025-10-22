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