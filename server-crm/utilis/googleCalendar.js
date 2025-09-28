import express from "express";
import { google } from "googleapis";
import { PrismaClient } from "@prisma/client";
import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";

const router = express.Router();
const prisma = new PrismaClient();

// Security middleware
router.use(helmet());
router.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per window
  message: "Too many authentication attempts, please try again later."
});

// Session configuration with Prisma store
const sessionMiddleware = session({
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax"
  },
  secret: process.env.SESSION_SECRET || "your-super-secret-key-change-in-production",
  resave: false,
  saveUninitialized: false,
  store: new PrismaSessionStore(prisma, {
    checkPeriod: 2 * 60 * 1000, // 2 minutes
    dbRecordIdIsSessionId: true,
    dbRecordIdFunction: undefined,
  }),
});

router.use(sessionMiddleware);

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL_ONE 
);

// Enhanced error handling
class AuthError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Helper function to get or create user
async function getOrCreateUser(googleUserInfo) {
  try {
    let user = await prisma.user.findUnique({
      where: { email: googleUserInfo.email }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: googleUserInfo.email,
          name: googleUserInfo.name,
          avatar: googleUserInfo.picture,
        }
      });
    }

    return user;
  } catch (error) {
    throw new AuthError("Failed to create or retrieve user", 500);
  }
}

// Enhanced refresh access token with better error handling
async function refreshAccessToken(userId) {
  try {
    const tokenRecord = await prisma.oAuthToken.findUnique({
      where: { userId_provider: { userId, provider: "google" } }
    });

    if (!tokenRecord || !tokenRecord.refreshToken) {
      throw new AuthError("No refresh token available - re-authentication required", 401);
    }

    // Check if token needs refresh (5 minutes before expiry)
    const now = new Date();
    const expiryBuffer = new Date(tokenRecord.accessTokenExpiresAt.getTime() - 5 * 60 * 1000);
    
    if (now < expiryBuffer) {
      return tokenRecord; // Token still valid
    }

    console.log(`Refreshing token for user ${userId}...`);

    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: tokenRecord.refreshToken,
      }),
    });

    const tokensOrError = await response.json();
    
    if (!response.ok) {
      console.error("Token refresh failed:", tokensOrError);
      throw new AuthError(`Token refresh failed: ${tokensOrError.error_description}`, 401);
    }

    const newTokens = tokensOrError;
    const expiresAt = new Date(Date.now() + newTokens.expires_in * 1000);

    // Update tokens in database
    const updatedToken = await prisma.oAuthToken.update({
      where: { userId_provider: { userId, provider: "google" } },
      data: {
        accessToken: newTokens.access_token,
        accessTokenExpiresAt: expiresAt,
        refreshToken: newTokens.refresh_token || tokenRecord.refreshToken,
        updatedAt: new Date(),
      },
    });

    console.log(`Token refreshed successfully for user ${userId}`);
    return updatedToken;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw error;
  }
}

// Helper function to get valid tokens for user
async function getValidTokens(userId) {
  try {
    const refreshedToken = await refreshAccessToken(userId);
    
    oauth2Client.setCredentials({
      access_token: refreshedToken.accessToken,
      refresh_token: refreshedToken.refreshToken,
    });

    return refreshedToken;
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthError("Authentication required. Please re-authenticate.", 401);
  }
}

// Middleware to ensure user authentication
const requireAuth = async (req, res, next) => {
  try {
    const userId = req.session.userId || req.query.userId || req.body.userId;
    
    if (!userId) {
      return res.status(401).json({ 
        error: "User ID is required. Please authenticate first.",
        requiresAuth: true 
      });
    }

    req.userId = userId;
    next();
  } catch (error) {
    res.status(500).json({ error: "Authentication middleware error" });
  }
};

// Routes
router.get("/auth", authLimiter, (req, res) => {
  try {
    const userId = req.query.userId;
    
    // Generate state parameter for security
    const state = Buffer.from(JSON.stringify({ 
      userId,
      timestamp: Date.now(),
      nonce: Math.random().toString(36).substring(7)
    })).toString('base64');

    // Store state in session for validation
    req.session.oauthState = state;

    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/calendar.readonly",
        "https://www.googleapis.com/auth/calendar.events",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile"
      ],
      prompt: "consent",
      state: state
    });
    
    console.log("Generated auth URL with state:", state);
    res.redirect(url);
  } catch (error) {
    console.error("Auth error:", error);
    res.status(500).json({ error: "Failed to generate auth URL" });
  }
});

router.get('/redirect', async (req, res) => {
  try {
    const { code, state } = req.query;
    
    if (!code) {
      return res.status(400).json({ error: 'No authorization code received' });
    }

    // Validate state parameter
    if (!state || state !== req.session.oauthState) {
      return res.status(400).json({ error: 'Invalid state parameter' });
    }

    // Parse state to get user info
    let stateData;
    try {
      stateData = JSON.parse(Buffer.from(state, 'base64').toString());
    } catch (e) {
      return res.status(400).json({ error: 'Invalid state format' });
    }

    console.log("Received code for state:", stateData);

    const { tokens } = await oauth2Client.getToken(code);
    const expiresAt = new Date(Date.now() + (tokens.expires_in || 3600) * 1000);

    // Get user info from Google
    oauth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const userInfoResponse = await oauth2.userinfo.get();
    const googleUserInfo = userInfoResponse.data;

    // Create or get user
    const user = await getOrCreateUser(googleUserInfo);

    // Store tokens in database
    await prisma.oAuthToken.upsert({
      where: { userId_provider: { userId: user.id, provider: "google" } },
      update: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        accessTokenExpiresAt: expiresAt,
        scope: tokens.scope?.split(' ') || [],
        tokenType: tokens.token_type || "Bearer",
        idToken: tokens.id_token,
        updatedAt: new Date(),
      },
      create: {
        userId: user.id,
        provider: "google",
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        accessTokenExpiresAt: expiresAt,
        scope: tokens.scope?.split(' ') || [],
        tokenType: tokens.token_type || "Bearer",
        idToken: tokens.id_token,
      },
    });

    // Store user in session
    req.session.userId = user.id;
    req.session.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar
    };

    // Clear OAuth state
    delete req.session.oauthState;
    
    // Test calendar access
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    const calendarsResponse = await calendar.calendarList.list();
    const calendars = calendarsResponse.data.items;
    
    res.json({ 
      success: true, 
      message: 'Authentication successful! Tokens stored securely.',
      user: req.session.user,
      calendarCount: calendars.length,
      redirectUrl: process.env.FRONTEND_URL || "http://localhost:3000/calendar"
    });
    
  } catch (error) {
    console.error('Token exchange error:', error);
    res.status(500).json({ 
      error: 'Failed to exchange code for tokens: ' + error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

router.get("/calendars", requireAuth, async (req, res) => {
  try {
    await getValidTokens(req.userId);
    
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    const response = await calendar.calendarList.list();
    const calendars = response.data.items;
    
    res.json({ 
      success: true, 
      message: `Found ${calendars.length} calendars`,
      calendars: calendars.map(cal => ({
        id: cal.id,
        summary: cal.summary,
        description: cal.description,
        primary: cal.primary,
        accessRole: cal.accessRole
      }))
    });
  } catch (error) {
    console.error("Error fetching calendars:", error);
    if (error instanceof AuthError) {
      return res.status(error.statusCode).json({ 
        error: error.message,
        requiresAuth: error.statusCode === 401
      });
    }
    res.status(500).json({ error: "Error fetching calendars: " + error.message });
  }
});

router.get("/events", requireAuth, async (req, res) => {
  try {
    const { calendar: calendarId = "primary", timeMin, timeMax, maxResults = 250 } = req.query;
    
    await getValidTokens(req.userId);
    
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    
    const queryParams = {
      calendarId,
      timeMin: timeMin || new Date().toISOString(),
      singleEvents: true,
      orderBy: "startTime",
      maxResults: parseInt(maxResults)
    };

    if (timeMax) {
      queryParams.timeMax = timeMax;
    }

    const response = await calendar.events.list(queryParams);
    const events = response.data.items || [];
    
    res.json({ 
      success: true, 
      message: `Found ${events.length} events`,
      events: events.map(event => ({
        id: event.id,
        summary: event.summary,
        description: event.description,
        start: event.start,
        end: event.end,
        location: event.location,
        attendees: event.attendees?.map(a => ({ email: a.email, responseStatus: a.responseStatus })),
        hangoutLink: event.hangoutLink,
        htmlLink: event.htmlLink
      })),
      calendarId,
      nextPageToken: response.data.nextPageToken
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    if (error instanceof AuthError) {
      return res.status(error.statusCode).json({ 
        error: error.message,
        requiresAuth: error.statusCode === 401
      });
    }
    res.status(500).json({ error: "Error fetching events: " + error.message });
  }
});

router.post("/addEvent", requireAuth, async (req, res) => {
  try {
    const {
      summary,
      description,
      startDateTime,
      endDateTime,
      calendarId = "primary",
      timeZone = "UTC",
      location,
      attendees,
      reminders
    } = req.body;

    if (!summary || !startDateTime || !endDateTime) {
      return res.status(400).json({ 
        error: "Missing required fields: summary, startDateTime, and endDateTime are required" 
      });
    }

    await getValidTokens(req.userId);

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const event = {
      summary,
      description: description || "",
      start: {
        dateTime: startDateTime,
        timeZone: timeZone,
      },
      end: {
        dateTime: endDateTime,
        timeZone: timeZone,
      },
      location: location || "",
      attendees: attendees?.map(email => ({ email })) || [],
      reminders: reminders || {
        useDefault: true
      }
    };

    const response = await calendar.events.insert({
      calendarId: calendarId,
      resource: event,
      sendUpdates: 'all' // Send email notifications to attendees
    });

    console.log("Event created successfully:", response.data.id);
    
    res.json({ 
      success: true, 
      message: "Event created successfully",
      event: {
        id: response.data.id,
        summary: response.data.summary,
        start: response.data.start,
        end: response.data.end,
        location: response.data.location,
        htmlLink: response.data.htmlLink,
        hangoutLink: response.data.hangoutLink
      }
    });
    
  } catch (error) {
    console.error("Error creating event:", error);
    if (error instanceof AuthError) {
      return res.status(error.statusCode).json({ 
        error: error.message,
        requiresAuth: error.statusCode === 401
      });
    }
    res.status(500).json({ error: "Error creating event: " + error.message });
  }
});

router.post("/meeting", requireAuth, async (req, res) => {
  try {
    const { 
      summary, 
      description, 
      startDateTime, 
      endDateTime, 
      timeZone = 'UTC',
      attendees,
      calendarId = "primary"
    } = req.body;

    if (!startDateTime || !endDateTime) {
      return res.status(400).json({ error: "Missing startDateTime or endDateTime" });
    }

    const startDate = new Date(startDateTime);
    const endDate = new Date(endDateTime);

    if (endDate <= startDate) {
      return res.status(400).json({ error: "End time must be after the start time" });
    }

    await getValidTokens(req.userId);

    const event = {
      summary: summary || "Google Meet Meeting",  
      description: description || "Google Meet event",  
      start: {
        dateTime: startDateTime, 
        timeZone: timeZone,
      },
      end: {
        dateTime: endDateTime, 
        timeZone: timeZone,
      },
      attendees: attendees?.map(email => ({ email })) || [],
      conferenceData: {
        createRequest: {
          requestId: `meet_${Date.now()}_${Math.random().toString(36).substring(7)}`,  
          conferenceSolutionKey: { type: 'hangoutsMeet' }, 
        },
      },
    };

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    const response = await calendar.events.insert({
      calendarId,
      resource: event,
      conferenceDataVersion: 1,
      sendUpdates: 'all'
    });

    const hangoutLink = response.data.hangoutLink;

    res.json({ 
      success: true, 
      message: "Google Meet link created successfully", 
      hangoutLink: hangoutLink,
      event: {
        id: response.data.id,
        summary: response.data.summary,
        hangoutLink: response.data.hangoutLink,
        htmlLink: response.data.htmlLink
      }
    });

  } catch (error) {
    console.error("Error creating meeting:", error);
    if (error instanceof AuthError) {
      return res.status(error.statusCode).json({ 
        error: error.message,
        requiresAuth: error.statusCode === 401
      });
    }
    res.status(500).json({ error: "Error creating Google Meet link: " + error.message });
  }
});

router.get("/status", async (req, res) => {
  try {
    const userId = req.session.userId || req.query.userId;
    
    if (!userId) {
      return res.json({
        authenticated: false,
        hasAccessToken: false,
        hasRefreshToken: false,
        user: null,
        message: "No user session found"
      });
    }

    const tokenRecord = await prisma.oAuthToken.findUnique({
      where: { userId_provider: { userId, provider: "google" } },
      include: { user: true }
    });

    if (!tokenRecord) {
      return res.json({
        authenticated: false,
        hasAccessToken: false,
        hasRefreshToken: false,
        user: req.session.user || null,
        message: "No tokens found for this user"
      });
    }

    const now = new Date();
    const isExpired = now > tokenRecord.accessTokenExpiresAt;

    res.json({
      authenticated: true,
      hasAccessToken: !isExpired,
      hasRefreshToken: !!tokenRecord.refreshToken,
      expiresAt: tokenRecord.accessTokenExpiresAt,
      isExpired,
      user: {
        id: tokenRecord.user.id,
        email: tokenRecord.user.email,
        name: tokenRecord.user.name,
        avatar: tokenRecord.user.avatar
      },
      tokenInfo: {
        scope: tokenRecord.scope,
        tokenType: tokenRecord.tokenType
      }
    });
  } catch (error) {
    console.error("Error checking status:", error);
    res.status(500).json({ error: "Error checking authentication status" });
  }
});

// Enhanced logout endpoint
router.post("/logout", (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).json({ error: "Error logging out" });
      }
      
      res.clearCookie('connect.sid'); // Clear session cookie
      res.json({ 
        success: true, 
        message: "Logged out successfully" 
      });
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Error during logout" });
  }
});

// Revoke token endpoint
router.post("/revoke", requireAuth, async (req, res) => {
  try {
    const tokenRecord = await prisma.oAuthToken.findUnique({
      where: { userId_provider: { userId: req.userId, provider: "google" } }
    });

    if (tokenRecord?.accessToken) {
      // Revoke token with Google
      try {
        await fetch(`https://oauth2.googleapis.com/revoke?token=${tokenRecord.accessToken}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
      } catch (revokeError) {
        console.warn("Error revoking token with Google:", revokeError.message);
      }
    }

    // Delete token from database
    await prisma.oAuthToken.delete({
      where: { userId_provider: { userId: req.userId, provider: "google" } }
    });

    res.json({
      success: true,
      message: "Token revoked successfully"
    });
  } catch (error) {
    console.error("Error revoking token:", error);
    res.status(500).json({ error: "Error revoking token" });
  }
});

// Clean up expired tokens (can be called by a cron job)
router.delete("/cleanup-tokens", async (req, res) => {
  try {
    const expiredTokens = await prisma.oAuthToken.deleteMany({
      where: {
        accessTokenExpiresAt: {
          lt: new Date()
        },
        refreshToken: null // Only delete if no refresh token available
      }
    });

    res.json({
      success: true,
      message: `Cleaned up ${expiredTokens.count} expired tokens`
    });
  } catch (error) {
    console.error("Error cleaning up tokens:", error);
    res.status(500).json({ error: "Error cleaning up tokens" });
  }
});

export default router;
