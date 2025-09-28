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

// Helper function to store tokens in database
const storeTokens = async (tokens, userId = null) => {
  try {
    const expiryDate = tokens.expiry_date ? new Date(tokens.expiry_date) : null;
    
    const tokenData = {
      userId,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiryDate,
      scope: tokens.scope ? tokens.scope.split(' ') : [],
      tokenType: tokens.token_type || 'Bearer'
    };

    // Delete existing tokens for this user (if userId exists) or all tokens (if no user system)
    if (userId) {
      await prisma.googleToken.deleteMany({ where: { userId } });
    } else {
      await prisma.googleToken.deleteMany({});
    }

    const savedToken = await prisma.googleToken.create({
      data: tokenData
    });

    console.log("Tokens stored in database:", savedToken.id);
    return savedToken;
  } catch (error) {
    console.error("Error storing tokens:", error);
    throw error;
  }
};

// Helper function to get tokens from database
const getStoredTokens = async (userId = null) => {
  try {
    const tokenRecord = await prisma.googleToken.findFirst({
      where: userId ? { userId } : {},
      orderBy: { createdAt: 'desc' }
    });

    if (!tokenRecord) {
      return null;
    }

    return {
      access_token: tokenRecord.accessToken,
      refresh_token: tokenRecord.refreshToken,
      expiry_date: tokenRecord.expiryDate ? tokenRecord.expiryDate.getTime() : null,
      token_type: tokenRecord.tokenType,
      scope: tokenRecord.scope.join(' ')
    };
  } catch (error) {
    console.error("Error retrieving tokens:", error);
    return null;
  }
};

// Helper function to refresh access token
const refreshAccessToken = async (userId = null) => {
  try {
    const storedTokens = await getStoredTokens(userId);
    
    if (!storedTokens || !storedTokens.refresh_token) {
      throw new Error('No refresh token available');
    }

    oauth2Client.setCredentials(storedTokens);
    
    const { credentials } = await oauth2Client.refreshAccessToken();
    
    // Update tokens in database
    await storeTokens(credentials, userId);
    
    // Update oauth2Client with new tokens
    oauth2Client.setCredentials(credentials);
    
    console.log("Access token refreshed successfully");
    return credentials;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
};

// Helper function to ensure valid authentication
const ensureValidAuth = async (userId = null) => {
  try {
    const storedTokens = await getStoredTokens(userId);
    
    if (!storedTokens) {
      throw new Error('No stored tokens found');
    }

    // Check if token is expired
    const now = new Date().getTime();
    const expiryTime = storedTokens.expiry_date;
    
    if (expiryTime && now >= expiryTime) {
      console.log("Token expired, refreshing...");
      await refreshAccessToken(userId);
    } else {
      oauth2Client.setCredentials(storedTokens);
    }

    return true;
  } catch (error) {
    console.error("Authentication validation failed:", error);
    throw error;
  }
};

// Routes
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
    
    // Store tokens in database
    await storeTokens(tokens);
    
    // Set credentials for immediate use
    oauth2Client.setCredentials(tokens);
            
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    
    const calendarsResponse = await calendar.calendarList.list();
    const calendars = calendarsResponse.data.items;
    
    res.json({ 
      success: true, 
      message: 'Authentication successful! Tokens stored in database.',
      calendarCount: calendars.length,
      access_token: tokens.access_token ? "Stored" : "Not received",
      has_refresh_token: !!tokens.refresh_token,
      stored_in_db: true
    });
    
  } catch (error) {
    console.error('Token exchange error:', error);
    res.status(500).json({ error: 'Failed to exchange code for tokens: ' + error.message });
  }
});

router.get("/calendars", async (req, res) => {
  try {
    await ensureValidAuth();

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
  } catch (error) {
    console.error("Error fetching calendars:", error);
    
    if (error.message.includes('No stored tokens') || error.message.includes('No refresh token')) {
      return res.status(401).json({ 
        error: "Authentication required. Please re-authenticate.",
        requiresAuth: true 
      });
    }
    
    res.status(500).json({ error: "Error fetching calendars: " + error.message });
  }
});

router.get("/events", async (req, res) => {
  try {
    await ensureValidAuth();

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
  } catch (error) {
    console.error("Error fetching events:", error);
    
    if (error.message.includes('No stored tokens') || error.message.includes('No refresh token')) {
      return res.status(401).json({ 
        error: "Authentication required. Please re-authenticate.",
        requiresAuth: true 
      });
    }
    
    res.status(500).json({ error: "Error fetching events: " + error.message });
  }
});

router.post("/addEvent", async (req, res) => {
  try {
    await ensureValidAuth();

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
    
  } catch (error) {
    console.error("Error creating event:", error);
    
    if (error.message.includes('No stored tokens') || error.message.includes('No refresh token')) {
      return res.status(401).json({ 
        error: "Authentication required. Please re-authenticate.",
        requiresAuth: true 
      });
    }
    
    res.status(500).json({ error: "Error creating event: " + error.message });
  }
});

router.post("/meeting", async (req, res) => {
  try {
    await ensureValidAuth();

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

  } catch (error) {
    console.error("Error creating meeting:", error);
    
    if (error.message.includes('No stored tokens') || error.message.includes('No refresh token')) {
      return res.status(401).json({ 
        error: "Authentication required. Please re-authenticate.",
        requiresAuth: true 
      });
    }
    
    res.status(500).json({ error: "Error creating Google Meet link: " + error.message });
  }
});

router.get("/status", async (req, res) => {
  try {
    const storedTokens = await getStoredTokens();
    const isAuthenticated = !!storedTokens;
    
    let tokenStatus = {
      authenticated: isAuthenticated,
      hasAccessToken: false,
      hasRefreshToken: false,
      isExpired: false,
      storedInDatabase: isAuthenticated
    };

    if (isAuthenticated) {
      tokenStatus.hasAccessToken = !!storedTokens.access_token;
      tokenStatus.hasRefreshToken = !!storedTokens.refresh_token;
      
      if (storedTokens.expiry_date) {
        const now = new Date().getTime();
        tokenStatus.isExpired = now >= storedTokens.expiry_date;
      }
    }

    res.json(tokenStatus);
  } catch (error) {
    console.error("Error checking status:", error);
    res.json({
      authenticated: false,
      hasAccessToken: false,
      hasRefreshToken: false,
      isExpired: false,
      storedInDatabase: false,
      error: true
    });
  }
});

// New route to manually refresh token
router.post("/refresh-token", async (req, res) => {
  try {
    const refreshedTokens = await refreshAccessToken();
    
    res.json({
      success: true,
      message: "Token refreshed successfully",
      hasAccessToken: !!refreshedTokens.access_token,
      hasRefreshToken: !!refreshedTokens.refresh_token
    });
  } catch (error) {
    console.error("Error refreshing token:", error);
    res.status(401).json({ 
      error: "Failed to refresh token: " + error.message,
      requiresAuth: true 
    });
  }
});

// Cleanup route for development
router.delete("/tokens", async (req, res) => {
  try {
    await prisma.googleToken.deleteMany({});
    oauth2Client.setCredentials({});
    
    res.json({
      success: true,
      message: "All tokens cleared from database"
    });
  } catch (error) {
    console.error("Error clearing tokens:", error);
    res.status(500).json({ error: "Error clearing tokens: " + error.message });
  }
});

export default router;
