import express from "express";
import { google } from "googleapis";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const router = express.Router();
const prisma = new PrismaClient();

// Encryption key for storing tokens securely
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32);
const ALGORITHM = 'aes-256-gcm';

// Utility functions for encryption/decryption
function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipher(ALGORITHM, ENCRYPTION_KEY);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
}

function decrypt(encryptedText) {
  const parts = encryptedText.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const authTag = Buffer.from(parts[1], 'hex');
  const encrypted = parts[2];
  const decipher = crypto.createDecipher(ALGORITHM, ENCRYPTION_KEY);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Create OAuth2 client
function createOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL_ONE
  );
}

// Get authenticated OAuth2 client for a user
async function getAuthenticatedClient(userId) {
  const googleAuth = await prisma.googleAuth.findUnique({
    where: { userId }
  });

  if (!googleAuth) {
    throw new Error('User not authenticated');
  }

  const oauth2Client = createOAuth2Client();
  
  // Decrypt tokens
  const accessToken = decrypt(googleAuth.accessToken);
  const refreshToken = decrypt(googleAuth.refreshToken);
  
  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
    token_type: googleAuth.tokenType,
    expiry_date: googleAuth.expiryDate.getTime()
  });

  // Check if access token is expired and refresh if needed
  if (new Date() >= googleAuth.expiryDate) {
    try {
      const { credentials } = await oauth2Client.refreshAccessToken();
      
      // Update database with new access token
      await prisma.googleAuth.update({
        where: { userId },
        data: {
          accessToken: encrypt(credentials.access_token),
          expiryDate: new Date(credentials.expiry_date),
          updatedAt: new Date()
        }
      });
      
      oauth2Client.setCredentials(credentials);
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw new Error('Token refresh failed. User needs to re-authenticate.');
    }
  }

  return oauth2Client;
}

// Authentication route
router.get("/auth", (req, res) => {
  try {
    const oauth2Client = createOAuth2Client();
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/calendar.readonly",
        "https://www.googleapis.com/auth/calendar.events",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile"
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

// OAuth callback route
router.get('/redirect', async (req, res) => {
  try {
    const { code } = req.query;
    
    if (!code) {
      return res.status(400).json({ error: 'No authorization code received' });
    }

    const oauth2Client = createOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);
    
    if (!tokens.refresh_token) {
      return res.status(400).json({ 
        error: 'No refresh token received. User may have already granted access.' 
      });
    }

    oauth2Client.setCredentials(tokens);

    // Get user info from Google
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();
    
    const googleUser = userInfo.data;
    
    // Create or update user in database
    let user = await prisma.user.findUnique({
      where: { email: googleUser.email }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name
        }
      });
    }

    // Store or update Google auth tokens
    const expiryDate = new Date(tokens.expiry_date);
    
    await prisma.googleAuth.upsert({
      where: { userId: user.id },
      update: {
        accessToken: encrypt(tokens.access_token),
        refreshToken: encrypt(tokens.refresh_token),
        tokenType: tokens.token_type || 'Bearer',
        scope: tokens.scope,
        expiryDate: expiryDate,
        googleEmail: googleUser.email,
        updatedAt: new Date()
      },
      create: {
        userId: user.id,
        accessToken: encrypt(tokens.access_token),
        refreshToken: encrypt(tokens.refresh_token),
        tokenType: tokens.token_type || 'Bearer',
        scope: tokens.scope,
        expiryDate: expiryDate,
        googleId: googleUser.id,
        googleEmail: googleUser.email
      }
    });

    // Verify calendar access
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    const calendarsResponse = await calendar.calendarList.list();
    
    res.json({
      success: true,
      message: 'Authentication successful! Tokens stored securely.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      calendarCount: calendarsResponse.data.items.length
    });
        
  } catch (error) {
    console.error('Token exchange error:', error);
    res.status(500).json({ 
      error: 'Failed to exchange code for tokens: ' + error.message 
    });
  }
});

// Get calendars for a user
router.get("/calendars/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const oauth2Client = await getAuthenticatedClient(userId);
    
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
        primary: cal.primary
      }))
    });
  } catch (error) {
    console.error("Error fetching calendars:", error);
    res.status(500).json({ 
      error: "Error fetching calendars: " + error.message 
    });
  }
});

// Get events for a user
router.get("/events/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const calendarId = req.query.calendar || "primary";
    const maxResults = parseInt(req.query.maxResults) || 10;
    
    const oauth2Client = await getAuthenticatedClient(userId);
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    
    const response = await calendar.events.list({
      calendarId,
      timeMin: new Date().toISOString(),
      maxResults,
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
        description: event.description,
        hangoutLink: event.hangoutLink
      }))
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ 
      error: "Error fetching events: " + error.message 
    });
  }
});

// Add event for a user
router.post("/addEvent/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
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

    const oauth2Client = await getAuthenticatedClient(userId);
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
    res.status(500).json({ 
      error: "Error creating event: " + error.message 
    });
  }
});

// Create Google Meet meeting for a user
router.post("/meeting/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { 
      summary, 
      description, 
      startDateTime, 
      endDateTime, 
      timeZone = 'UTC' 
    } = req.body;

    if (!startDateTime || !endDateTime) {
      return res.status(400).json({ 
        error: "Missing startDateTime or endDateTime" 
      });
    }

    const startDate = new Date(startDateTime);
    const endDate = new Date(endDateTime);

    if (endDate <= startDate) {
      return res.status(400).json({ 
        error: "End time must be after the start time" 
      });
    }

    const oauth2Client = await getAuthenticatedClient(userId);
    
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

    res.json({
      success: true,
      message: "Google Meet link created successfully",
      event: {
        id: response.data.id,
        summary: response.data.summary,
        hangoutLink: response.data.hangoutLink,
        htmlLink: response.data.htmlLink
      }
    });

  } catch (error) {
    console.error("Error creating meeting:", error);
    res.status(500).json({ 
      error: "Error creating Google Meet link: " + error.message 
    });
  }
});

// Check authentication status for a user
router.get("/status/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    const googleAuth = await prisma.googleAuth.findUnique({
      where: { userId },
      include: { user: true }
    });

    if (!googleAuth) {
      return res.json({
        authenticated: false,
        user: null
      });
    }

    const isExpired = new Date() >= googleAuth.expiryDate;
    
    res.json({
      authenticated: true,
      user: {
        id: googleAuth.user.id,
        email: googleAuth.user.email,
        name: googleAuth.user.name
      },
      tokenExpired: isExpired,
      expiryDate: googleAuth.expiryDate,
      lastUpdated: googleAuth.updatedAt
    });
  } catch (error) {
    console.error("Error checking status:", error);
    res.status(500).json({ 
      error: "Error checking authentication status: " + error.message 
    });
  }
});

// Revoke authentication for a user
router.post("/revoke/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    const googleAuth = await prisma.googleAuth.findUnique({
      where: { userId }
    });

    if (googleAuth) {
      // Revoke the token with Google
      const oauth2Client = createOAuth2Client();
      const accessToken = decrypt(googleAuth.accessToken);
      
      try {
        await oauth2Client.revokeToken(accessToken);
      } catch (error) {
        console.log("Token revocation with Google failed, but continuing with local cleanup");
      }

      // Remove from database
      await prisma.googleAuth.delete({
        where: { userId }
      });
    }

    res.json({
      success: true,
      message: "Authentication revoked successfully"
    });
  } catch (error) {
    console.error("Error revoking authentication:", error);
    res.status(500).json({ 
      error: "Error revoking authentication: " + error.message 
    });
  }
});

export default router;