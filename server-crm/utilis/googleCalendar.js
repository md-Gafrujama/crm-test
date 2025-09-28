import express from "express";
import { google } from "googleapis";
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL_ONE 
);

// Helper function to refresh expired tokens
async function refreshAccessToken(tokenRecord) {
  try {
    if (!tokenRecord.refreshToken) {
      throw new Error('No refresh token available');
    }

    const url = "https://oauth2.googleapis.com/token?" +
      new URLSearchParams({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: tokenRecord.refreshToken,
      });

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      console.error('Token refresh failed:', refreshedTokens);
      throw new Error(refreshedTokens.error || 'Token refresh failed');
    }

    // Calculate expiration time
    const expiresAt = new Date(Date.now() + (refreshedTokens.expires_in * 1000));

    // Update token in database
    const updatedToken = await prisma.googleToken.update({
      where: { id: tokenRecord.id },
      data: {
        accessToken: refreshedTokens.access_token,
        expiresAt: expiresAt,
        refreshToken: refreshedTokens.refresh_token || tokenRecord.refreshToken,
        updatedAt: new Date(),
      },
    });

    return updatedToken;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw error;
  }
}

// Helper function to get valid token (refresh if needed)
async function getValidToken(userId = 'default_user') {
  try {
    let tokenRecord = await prisma.googleToken.findUnique({
      where: { userId: userId }
    });

    if (!tokenRecord) {
      return null;
    }

    // Check if token is expired (with 5-minute buffer)
    const now = new Date();
    const expirationBuffer = new Date(tokenRecord.expiresAt.getTime() - 5 * 60 * 1000);

    if (now > expirationBuffer && tokenRecord.refreshToken) {
      console.log('Token expired, refreshing...');
      tokenRecord = await refreshAccessToken(tokenRecord);
    }

    return tokenRecord;
  } catch (error) {
    console.error('Error getting valid token:', error);
    return null;
  }
}

// Helper function to setup oauth2Client with token
async function setupOAuth2Client(userId = 'default_user') {
  const tokenRecord = await getValidToken(userId);
  
  if (!tokenRecord) {
    return null;
  }

  oauth2Client.setCredentials({
    access_token: tokenRecord.accessToken,
    refresh_token: tokenRecord.refreshToken,
    expiry_date: tokenRecord.expiresAt.getTime(),
    token_type: tokenRecord.tokenType,
  });

  return tokenRecord;
}

router.get("/auth", (req, res) => {
  try {
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/calendar.readonly",
        "https://www.googleapis.com/auth/calendar.events"
      ],
      prompt: "consent"
    });
    console.log("Generated auth URL:", url);
    res.redirect(url);
  } catch (error) {
    console.error("Auth error:", error);
    res.status(500).json({ error: "Failed to generate auth URL" });
  }
});

router.get('/redirect', async (req, res) => {
  try {
    const { code } = req.query;
    
    if (!code) {
      return res.status(400).json({ error: 'No authorization code received' });
    }

    console.log("Received code:", code);

    const { tokens } = await oauth2Client.getToken(code);
    
    // Calculate expiration time
    const expiresAt = new Date(Date.now() + (tokens.expires_in * 1000));
    
    // Store or update token in database
    const userId = 'default_user'; // You can modify this to use actual user ID
    
    await prisma.googleToken.upsert({
      where: { userId: userId },
      update: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || undefined,
        expiresAt: expiresAt,
        scope: tokens.scope || 'calendar',
        tokenType: tokens.token_type || 'Bearer',
        updatedAt: new Date(),
      },
      create: {
        userId: userId,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || undefined,
        expiresAt: expiresAt,
        scope: tokens.scope || 'calendar',
        tokenType: tokens.token_type || 'Bearer',
      },
    });

    oauth2Client.setCredentials(tokens);
            
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    
    const calendarsResponse = await calendar.calendarList.list();
    const calendars = calendarsResponse.data.items;
    
    res.json({ 
      success: true, 
      message: 'Authentication successful! Calendar access verified.',
      calendarCount: calendars.length,
      access_token: tokens.access_token ? "Received" : "Not received",
      has_refresh_token: !!tokens.refresh_token,
      expires_at: expiresAt.toISOString()
    });
    
  } catch (error) {
    console.error('Token exchange error:', error);
    res.status(500).json({ error: 'Failed to exchange code for tokens: ' + error.message });
  }
});

router.get("/calendars", async (req, res) => {
  try {
    const userId = 'default_user'; // Modify as needed
    const tokenRecord = await setupOAuth2Client(userId);
    
    if (!tokenRecord) {
      return res.status(401).json({ 
        error: "Not authenticated or token expired. Please go to /api/calendar/auth first",
        requiresAuth: true
      });
    }

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    const response = await calendar.calendarList.list();
    const calendars = response.data.items;
    
    res.json({ 
      success: true, 
      message: `Found ${calendars.length} calendars`,
      calendars: calendars.map(cal => ({
        id: cal.id,
        summary: cal.summary,
        description: cal.description
      }))
    });
  } catch (err) {
    console.error("Error fetching calendars:", err);
    
    if (err.code === 401 || err.message.includes('invalid_grant')) {
      return res.status(401).json({ 
        error: "Authentication failed. Please re-authenticate at /api/calendar/auth",
        requiresAuth: true
      });
    }
    
    res.status(500).json({ error: "Error fetching calendars: " + err.message });
  }
});

router.get("/events", async (req, res) => {
  try {
    const userId = 'default_user'; // Modify as needed
    const tokenRecord = await setupOAuth2Client(userId);
    
    if (!tokenRecord) {
      return res.status(401).json({ 
        error: "Not authenticated or token expired. Please go to /api/calendar/auth first",
        requiresAuth: true
      });
    }

    const calendarId = req.query.calendar || "primary";
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    
    const response = await calendar.events.list({
      calendarId,
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = response.data.items;
    
    res.json({ 
      success: true, 
      message: `Found ${events.length} events`,
      events: events.map(event => ({
        id: event.id,
        summary: event.summary,
        start: event.start,
        end: event.end,
        description: event.description
      }))
    });
  } catch (err) {
    console.error("Error fetching events:", err);
    
    if (err.code === 401 || err.message.includes('invalid_grant')) {
      return res.status(401).json({ 
        error: "Authentication failed. Please re-authenticate at /api/calendar/auth",
        requiresAuth: true
      });
    }
    
    res.status(500).json({ error: "Error fetching events: " + err.message });
  }
});

router.post("/addEvent", async (req, res) => {
  try {
    const userId = 'default_user'; // Modify as needed
    const tokenRecord = await setupOAuth2Client(userId);
    
    if (!tokenRecord) {
      return res.status(401).json({ 
        error: "Not authenticated or token expired. Please go to /api/calendar/auth first",
        requiresAuth: true
      });
    }

    const {
      summary,
      description,
      startDateTime,
      endDateTime,
      calendarId = "primary",
      timeZone = "UTC"
    } = req.body;

    if (!summary || !startDateTime || !endDateTime) {
      return res.status(400).json({ 
        error: "Missing required fields: summary, startDateTime, and endDateTime are required" 
      });
    }

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
    };

    const response = await calendar.events.insert({
      calendarId: calendarId,
      resource: event,
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
        htmlLink: response.data.htmlLink,
        hangoutLink: response.data.hangoutLink
      }
    });
    
  } catch (err) {
    console.error("Error creating event:", err);
    
    if (err.code === 401 || err.message.includes('invalid_grant')) {
      return res.status(401).json({ 
        error: "Authentication failed. Please re-authenticate at /api/calendar/auth",
        requiresAuth: true
      });
    }
    
    res.status(500).json({ error: "Error creating event: " + err.message });
  }
});

router.post("/meeting", async (req, res) => {
  try {
    const userId = 'default_user'; // Modify as needed
    const tokenRecord = await setupOAuth2Client(userId);
    
    if (!tokenRecord) {
      return res.status(401).json({ 
        error: "Not authenticated or token expired. Please go to /api/calendar/auth first",
        requiresAuth: true
      });
    }

    const { summary, description, startDateTime, endDateTime, timeZone = 'UTC' } = req.body;

    if (!startDateTime || !endDateTime) {
      return res.status(400).json({ error: "Missing startDateTime or endDateTime" });
    }

    const startDate = new Date(startDateTime);
    const endDate = new Date(endDateTime);

    if (endDate <= startDate) {
      return res.status(400).json({ error: "End time must be after the start time" });
    }

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
      conferenceData: {
        createRequest: {
          requestId: `${Date.now()}`,  
          conferenceSolutionKey: { type: 'hangoutsMeet' }, 
          status: { statusCode: 'success' },
        },
      },
    };

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
      conferenceDataVersion: 1,  
    });

    const hangoutLink = response.data.hangoutLink;

    res.json({ 
      success: true, 
      message: "Google Meet link created successfully", 
      hangoutLink: hangoutLink 
    });

  } catch (err) {
    console.error("Error creating meeting:", err);
    
    if (err.code === 401 || err.message.includes('invalid_grant')) {
      return res.status(401).json({ 
        error: "Authentication failed. Please re-authenticate at /api/calendar/auth",
        requiresAuth: true
      });
    }
    
    if (err.response) {
      console.error("Error response details:", err.response.data);
    }
    res.status(500).json({ error: "Error creating Google Meet link: " + err.message });
  }
});

router.get("/status", async (req, res) => {
  try {
    const userId = 'default_user'; // Modify as needed
    const tokenRecord = await getValidToken(userId);
    
    const isAuthenticated = !!tokenRecord;
    const hasValidToken = tokenRecord && new Date() < new Date(tokenRecord.expiresAt);
    
    res.json({
      authenticated: isAuthenticated,
      hasAccessToken: isAuthenticated,
      hasRefreshToken: tokenRecord?.refreshToken ? true : false,
      tokenExpiresAt: tokenRecord?.expiresAt?.toISOString(),
      isTokenValid: hasValidToken
    });
  } catch (error) {
    console.error('Error checking status:', error);
    res.json({
      authenticated: false,
      hasAccessToken: false,
      hasRefreshToken: false,
      error: 'Failed to check authentication status'
    });
  }
});

// New endpoint to manually refresh token
router.post("/refresh-token", async (req, res) => {
  try {
    const userId = 'default_user'; // Modify as needed
    const tokenRecord = await prisma.googleToken.findUnique({
      where: { userId: userId }
    });
    
    if (!tokenRecord || !tokenRecord.refreshToken) {
      return res.status(401).json({ 
        error: "No refresh token available. Please re-authenticate.",
        requiresAuth: true
      });
    }
    
    const refreshedToken = await refreshAccessToken(tokenRecord);
    
    res.json({
      success: true,
      message: "Token refreshed successfully",
      expiresAt: refreshedToken.expiresAt.toISOString()
    });
    
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(500).json({ 
      error: "Failed to refresh token: " + error.message,
      requiresAuth: true
    });
  }
});

export default router;
