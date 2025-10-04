import { google } from "googleapis";
import prisma from "../../prisma/prismaClient.js";
import jwt from "jsonwebtoken";

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL_ONE
);

function formatDateToISO(dateTimeStr) {
  if (!dateTimeStr) throw new Error("Date string is empty");

  let normalized = dateTimeStr.replace(" ", "T");

  const isoDate = new Date(normalized);
  if (isNaN(isoDate.getTime())) {
    throw new Error(
      "Invalid date format, expected RFC3339 like 2025-09-29T10:00:00+05:45"
    );
  }
  return isoDate.toISOString();
}

const calendarController = {
  async auth(req, res) {
    try {
      // Check if token is provided in query parameter (for OAuth flow)
      const tokenFromQuery = req.query.authToken;
      
      if (tokenFromQuery) {
        try {
          // Verify the JWT token
          const decoded = jwt.verify(tokenFromQuery, process.env.JWT_SECRET);
          console.log("Decoded JWT:", decoded);
          
          // Store user info for the OAuth callback
          req.session = req.session || {};
          req.session.userId = decoded.uid;
          req.session.userEmail = decoded.email;
        } catch (jwtError) {
          console.error("JWT verification failed:", jwtError);
          return res.status(401).json({ error: "Invalid authentication token" });
        }
      } else if (!req.user) {
        return res.status(401).json({ error: "Missing or invalid authorization header" });
      }
      
      const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: [
          "https://www.googleapis.com/auth/calendar.readonly",
          "https://www.googleapis.com/auth/calendar.events",
          "https://www.googleapis.com/auth/userinfo.email",
          "https://www.googleapis.com/auth/userinfo.profile",
          "openid"
        ],
      });
      console.log("Generated auth URL:", url);
      res.redirect(url);
    } catch (error) {
      console.error("Auth error:", error);
      res.status(500).json({ error: "Failed to generate auth URL" });
    }
  },

  async redirect(req, res) {
    try {
      const { code } = req.query;
      if (!code) {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        return res.redirect(`${frontendUrl}/admin/calendar?auth=error&message=${encodeURIComponent('No authorization code received')}`);
      }

      console.log("Received OAuth code:", code);

      const { tokens } = await oauth2Client.getToken(code);
      console.log("Tokens from Google:", tokens);

      if (!tokens.access_token) {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        return res.redirect(`${frontendUrl}/admin/calendar?auth=error&message=${encodeURIComponent('No access token received. Check your redirect URI and scopes.')}`);
      }

      oauth2Client.setCredentials(tokens);

      const tokenInfo = await oauth2Client.getTokenInfo(tokens.access_token);
      console.log("Token info verified:", tokenInfo);

      const oauth2 = google.oauth2({
        auth: oauth2Client,
        version: "v2",
      });

      const { data: userInfo } = await oauth2.userinfo.get();
      console.log("Fetched user info:", userInfo);

      if (!userInfo.email) {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        return res.redirect(`${frontendUrl}/admin/calendar?auth=error&message=${encodeURIComponent('Failed to get user email from Google')}`);
      }

      const user = await prisma.user.findUnique({
        where: { email: userInfo.email },
      });

      if (!user) {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        return res.redirect(`${frontendUrl}/admin/calendar?auth=error&message=${encodeURIComponent(`No local user found with email: ${userInfo.email}`)}`);
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          googleAccessToken: tokens.access_token,
          googleRefreshToken: tokens.refresh_token ?? user.googleRefreshToken,
          googleExpiryDate: tokens.expiry_date ?? user.googleExpiryDate,
        },
      });

      // Redirect to the Calendar page after successful authentication
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      return res.redirect(`${frontendUrl}/admin/calendar?auth=success&message=Google account connected successfully`);
    } catch (error) {
      console.error("🔴 OAuth redirect error:", error.response?.data || error);
      // Redirect to calendar page with error message
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      return res.redirect(`${frontendUrl}/admin/calendar?auth=error&message=${encodeURIComponent('Google OAuth failed: ' + error.message)}`);
    }
  },

  async getCalendars(req, res) {
    try {
      if (!oauth2Client.credentials) {
        return res.status(401).json({
          error: "Not authenticated. Please go to /api/calendar/auth first",
        });
      }

      const calendar = google.calendar({ version: "v3", auth: oauth2Client });
      const response = await calendar.calendarList.list();
      const calendars = response.data.items;

      res.json({
        success: true,
        message: `Found ${calendars.length} calendars`,
        calendars: calendars.map((cal) => ({
          id: cal.id,
          summary: cal.summary,
          description: cal.description,
        })),
      });
    } catch (err) {
      console.error("Error fetching calendars:", err);
      res
        .status(500)
        .json({ error: "Error fetching calendars: " + err.message });
    }
  },

  async getEvents(req, res) {
    try {
      if (!oauth2Client.credentials?.access_token) {
        return res.status(401).json({
          error: "Not authenticated. Please go to /api/calendar/auth first",
        });
      }

      const calendarId = req.query.calendar || "primary";
      const calendar = google.calendar({ version: "v3", auth: oauth2Client });

      // Get events for the next 3 months to ensure we get all events
      const timeMin = new Date();
      const timeMax = new Date();
      timeMax.setMonth(timeMax.getMonth() + 3);

      const response = await calendar.events.list({
        calendarId,
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        maxResults: 250, // Increased limit to get more events
        singleEvents: true,
        orderBy: "startTime",
      });

      const events = response.data.items || [];

      const formattedEvents = events.map((event) => ({
        id: event.id,
        summary: event.summary || "No Title",
        start: event.start?.dateTime || event.start?.date,
        end: event.end?.dateTime || event.end?.date,
        description: event.description || "",
      }));

      res.json({
        success: true,
        message: `Found ${formattedEvents.length} events`,
        events: formattedEvents,
      });
    } catch (err) {
      console.error("Error fetching events:", err);
      res.status(500).json({ error: "Error fetching events: " + err.message });
    }
  },

  async getAllCalendarsAndEvents(req, res) {
    try {
      if (!oauth2Client.credentials?.access_token) {
        return res.status(401).json({
          error: "Not authenticated. Please go to /api/calendar/auth first",
        });
      }

      const calendar = google.calendar({ version: "v3", auth: oauth2Client });

      const calendarListResponse = await calendar.calendarList.list();
      const calendars = calendarListResponse.data.items;

      const calendarWithEvents = [];

      for (const cal of calendars) {
        const calendarId = cal.id;

        const eventsResponse = await calendar.events.list({
          calendarId,
          timeMin: new Date().toISOString(),
          maxResults: 10,
          singleEvents: true,
          orderBy: "startTime",
        });

        const events = (eventsResponse.data.items || []).map((event) => ({
          id: event.id,
          summary: event.summary || "No Title",
          start: event.start?.dateTime || event.start?.date,
          end: event.end?.dateTime || event.end?.date,
          description: event.description || "",
          type: "google",
        }));

        calendarWithEvents.push({
          id: cal.id,
          summary: cal.summary,
          description: cal.description,
          events,
        });
      }
      let dbWhereCondition = {};

      if (req.user.userType === "admin") {
        dbWhereCondition = {
          companyId: req.user.companyId,
        };
      } else {
        dbWhereCondition = {
          companyId: req.user.companyId,
          createdBy: req.user.uid,
        };
      }

      const dbEvents = await prisma.calendar.findMany({
        where: dbWhereCondition,
        orderBy: {
          eventDate: "asc",
        },
      });

      const formattedDbEvents = dbEvents.map((event) => ({
        id: event.id,
        topic: event.eventTopic,
        description: event.description,
        start: event.startTime,
        end: event.endTime,
        eventDate: event.eventDate,
        eventPurpose: event.eventPurpose,
        meetingType: event.meetingType,
      }));

      res.json({
        success: true,
        message: `Found ${calendars.length} Google calendars and ${formattedDbEvents.length} local events`,
        googleCalendars: calendarWithEvents,
        localCalendarEvents: formattedDbEvents,
      });
    } catch (err) {
      console.error("Error fetching calendars and events:", err);
      res.status(500).json({
        error: "Error fetching calendars and events: " + err.message,
      });
    }
  },

  async addEvent(req, res) {
    try {
      if (!oauth2Client.credentials?.access_token) {
        return res.status(401).json({
          error: "Not authenticated. Please go to /api/calendar/auth first",
        });
      }

      const {
        summary,
        description,
        startDateTime,
        endDateTime,
        calendarId = "primary",
        timeZone = "UTC",
        meetingType,
        eventPurpose,
      } = req.body;

      if (!summary || !startDateTime || !endDateTime || !eventPurpose) {
        return res.status(400).json({
          error:
            "Missing required fields: summary, startDateTime, endDateTime, and eventPurpose are required",
        });
      }

      const validMeetingTypes = ["IN_PERSON", "ONLINE", "HYBRID", "OFFLINE"];
      const validEventPurposes = [
        "MEETING",
        "TRAINING",
        "WORKSHOP",
        "WEBINAR",
        "OTHER",
      ];

      if (meetingType && !validMeetingTypes.includes(meetingType)) {
        return res.status(400).json({
          error: `Invalid meetingType. Must be one of: ${validMeetingTypes.join(
            ", "
          )}`,
        });
      }

      if (!validEventPurposes.includes(eventPurpose)) {
        return res.status(400).json({
          error: `Invalid eventPurpose. Must be one of: ${validEventPurposes.join(
            ", "
          )}`,
        });
      }

      const startDate = formatDateToISO(startDateTime);
      const endDate = formatDateToISO(endDateTime);

      if (endDate <= startDate) {
        return res.status(400).json({
          error: "End time must be after the start time",
        });
      }

      const calendar = google.calendar({ version: "v3", auth: oauth2Client });

      const event = {
        summary,
        description: description || "",
        start: {
          dateTime: startDate,
          timeZone,
        },
        end: {
          dateTime: endDate,
          timeZone,
        },
      };

      const response = await calendar.events.insert({
        calendarId,
        resource: event,
      });

      console.log("Event created on Google Calendar:", response.data.id);

      try {
        const { uid, companyId, id: createdBy } = req.user;

        await prisma.Calendar.create({
          data: {
            uid,
            companyId,
            eventTopic: summary,
            eventDate: new Date(startDate),
            startTime: new Date(startDate),
            endTime: new Date(endDate),
            meetingType: meetingType || null,
            description: description || "",
            eventPurpose,
            hangoutLink: response.data.hangoutLink || null,
            googleEventLink: response.data.htmlLink || null,
            createdBy,
            updatedBy: createdBy,
          },
        });
      } catch (dbError) {
        console.error("Failed to save event to DB:", dbError);
      }

      res.json({
        success: true,
        message: "Event created successfully",
        event: {
          id: response.data.id,
          summary: response.data.summary,
          start: response.data.start,
          end: response.data.end,
          htmlLink: response.data.htmlLink,
          hangoutLink: response.data.hangoutLink,
        },
      });
    } catch (err) {
      console.error("Error creating event:", err);
      if (err.response) console.error("Error details:", err.response.data);
      res.status(500).json({ error: "Error creating event: " + err.message });
    }
  },

  async createMeeting(req, res) {
    try {
      const { uid, companyId, id: createdBy } = req.user;
      console.log("User info:", { uid, companyId, createdBy });

      const savedMeeting = await prisma.Calendar.create({
        data: {
          uid,
          companyId,
          eventTopic: summary || "Google Meet Meeting",
          eventDate: new Date(startDate),
          startTime: new Date(startDate),
          endTime: new Date(endDate),
          meetingType: "ONLINE",
          description: description || "Google Meet event",
          eventPurpose: "MEETING",
          hangoutLink,
          googleEventLink: response.data.htmlLink || null,
          createdBy,
          updatedBy: createdBy,
        },
      });

      console.log("Meeting saved in DB:", savedMeeting);
    } catch (dbError) {
      console.error(
        "❌ Failed to save meeting in DB:",
        dbError.message || dbError
      );
      if (dbError.meta) console.error("Prisma error meta:", dbError.meta);
    }
  },

  async createEvent(req, res) {
    try {
      if (!oauth2Client.credentials?.access_token) {
        return res.status(401).json({
          error: "Not authenticated. Please go to /api/calendar/auth first",
        });
      }

      const {
        summary,
        description,
        startDateTime,
        endDateTime,
        timeZone = "UTC",
        calendarId = "primary",
        meetingType,
        eventPurpose,
        requireMeeting = false,
      } = req.body;

      if (!summary || !startDateTime || !endDateTime || !eventPurpose) {
        return res.status(400).json({
          error:
            "Missing required fields: summary, startDateTime, endDateTime, eventPurpose",
        });
      }

      const validMeetingTypes = ["IN_PERSON", "ONLINE", "HYBRID", "OFFLINE"];
      const validEventPurposes = [
        "MEETING",
        "TRAINING",
        "WORKSHOP",
        "WEBINAR",
        "OTHER",
      ];

      if (meetingType && !validMeetingTypes.includes(meetingType)) {
        return res.status(400).json({
          error: `Invalid meetingType. Must be one of: ${validMeetingTypes.join(
            ", "
          )}`,
        });
      }

      if (!validEventPurposes.includes(eventPurpose)) {
        return res.status(400).json({
          error: `Invalid eventPurpose. Must be one of: ${validEventPurposes.join(
            ", "
          )}`,
        });
      }

      const startDate = formatDateToISO(startDateTime);
      const endDate = formatDateToISO(endDateTime);

      if (endDate <= startDate) {
        return res.status(400).json({
          error: "End time must be after the start time",
        });
      }

      const calendar = google.calendar({ version: "v3", auth: oauth2Client });

      const event = {
        summary,
        description: description || "",
        start: {
          dateTime: startDate,
          timeZone,
        },
        end: {
          dateTime: endDate,
          timeZone,
        },
      };

      if (requireMeeting) {
        event.conferenceData = {
          createRequest: {
            requestId: `${Date.now()}`,
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        };
      }

      const response = await calendar.events.insert({
        calendarId,
        resource: event,
        conferenceDataVersion: requireMeeting ? 1 : 0,
      });

      const { uid, companyId } = req.user;
      const createdBy = uid;

      await prisma.Calendar.create({
        data: {
          uid,
          companyId,
          eventTopic: summary,
          eventDate: new Date(startDate),
          startTime: new Date(startDate),
          endTime: new Date(endDate),
          meetingType: requireMeeting ? "ONLINE" : meetingType || null,
          description: description || "",
          eventPurpose,
          hangoutLink: response.data.hangoutLink || null,
          googleEventLink: response.data.htmlLink || null,
          createdBy,
          updatedBy: createdBy,
        },
      });

      res.json({
        success: true,
        message: requireMeeting
          ? "Meeting created with Google Meet link"
          : "Event created successfully",
        event: {
          id: response.data.id,
          summary: response.data.summary,
          start: response.data.start,
          end: response.data.end,
          htmlLink: response.data.htmlLink,
          hangoutLink: response.data.hangoutLink || null,
        },
      });
    } catch (err) {
      console.error("Error creating event:", err);
      if (err.response) console.error("Error details:", err.response.data);
      res.status(500).json({
        error: "Error creating event: " + err.message,
      });
    }
  },

  status(req, res) {
    const isAuthenticated = !!oauth2Client.credentials;
    res.json({
      authenticated: isAuthenticated,
      hasAccessToken: !!oauth2Client.credentials?.access_token,
      hasRefreshToken: !!oauth2Client.credentials?.refresh_token,
    });
  },
};
export default calendarController;
