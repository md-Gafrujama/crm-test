import express from "express";
import { google } from "googleapis";

const router = express.Router();

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL_ONE 
);

router.get("/auth", (req, res) => {
  try {
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: "https://www.googleapis.com/auth/calendar.readonly",
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
        oauth2Client.setCredentials(tokens);
        
        console.log('Tokens received successfully');
        
        const calendar = google.calendar({ version: "v3", auth: oauth2Client });
        
        const calendarsResponse = await calendar.calendarList.list();
        const calendars = calendarsResponse.data.items;
        
        res.json({ 
            success: true, 
            message: 'Authentication successful! Calendar access verified.',
            calendarCount: calendars.length,
            access_token: tokens.access_token ? "Received" : "Not received",
            has_refresh_token: !!tokens.refresh_token
        });
        
    } catch (error) {
        console.error('Token exchange error:', error);
        res.status(500).json({ error: 'Failed to exchange code for tokens: ' + error.message });
    }
});

router.get("/calendars", async (req, res) => {
  try {
    if (!oauth2Client.credentials) {
      return res.status(401).json({ error: "Not authenticated. Please go to /api/calendar/auth first" });
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
    res.status(500).json({ error: "Error fetching calendars: " + err.message });
  }
});

router.get("/events", async (req, res) => {
  try {
    if (!oauth2Client.credentials) {
      return res.status(401).json({ error: "Not authenticated. Please go to /api/calendar/auth first" });
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
    res.status(500).json({ error: "Error fetching events: " + err.message });
  }
});

router.get("/status", (req, res) => {
  const isAuthenticated = !!oauth2Client.credentials;
  res.json({
    authenticated: isAuthenticated,
    hasAccessToken: !!oauth2Client.credentials?.access_token,
    hasRefreshToken: !!oauth2Client.credentials?.refresh_token
  });
});

export default router;