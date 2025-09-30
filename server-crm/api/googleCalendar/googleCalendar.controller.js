import { google } from "googleapis";
import prisma from "../../prisma/prismaClient.js";

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
    throw new Error("Invalid date format, expected RFC3339 like 2025-09-29T10:00:00+05:45");
  }
  return isoDate.toISOString();
}

const calendarController = {
  async auth(req, res) {
    try {
      const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: [
          "https://www.googleapis.com/auth/calendar.readonly",
          "https://www.googleapis.com/auth/calendar.events",
        ],
        prompt: "consent",
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
        return res
          .status(400)
          .json({ error: "No authorization code received" });
      }

      console.log("Received code:", code);

      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);

      const calendar = google.calendar({ version: "v3", auth: oauth2Client });
      const calendarsResponse = await calendar.calendarList.list();
      const calendars = calendarsResponse.data.items;

      res.json({
        success: true,
        message: "Authentication successful! Calendar access verified.",
        calendarCount: calendars.length,
        access_token: tokens.access_token ? "Received" : "Not received",
        has_refresh_token: !!tokens.refresh_token,
      });
    } catch (error) {
      console.error("Token exchange error:", error);
      res.status(500).json({
        error: "Failed to exchange code for tokens: " + error.message,
      });
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
      if (!oauth2Client.credentials) {
        return res.status(401).json({
          error: "Not authenticated. Please go to /api/calendar/auth first",
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
        events: events.map((event) => ({
          id: event.id,
          summary: event.summary,
          start: event.start,
          end: event.end,
          description: event.description,
        })),
      });
    } catch (err) {
      console.error("Error fetching events:", err);
      res.status(500).json({ error: "Error fetching events: " + err.message });
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
      } = req.body;

      if (!summary || !startDateTime || !endDateTime) {
        return res.status(400).json({
          error:
            "Missing required fields: summary, startDateTime, and endDateTime are required",
        });
      }

      // validate times
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

      console.log("Event created successfully:", response.data.id);

      try {
        const { uid, companyId } = req.user;

        await prisma.Calendar.create({
          data: {
            uid,
            companyId,
            eventTopic: summary,
            eventDate: startDate,
            startingTime: startDate,
            endingTime: endDate,
            description: description || "",
            meeting:null,
          },
        });
      } catch (dbError) {
        console.error("Failed to save event in DB:", dbError);
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
      } = req.body;

      if (!startDateTime || !endDateTime) {
        return res
          .status(400)
          .json({ error: "Missing startDateTime or endDateTime" });
      }

      // validate times
      const startDate = formatDateToISO(startDateTime);
      const endDate = formatDateToISO(endDateTime);

      if (endDate <= startDate) {
        return res
          .status(400)
          .json({ error: "End time must be after the start time" });
      }

      const event = {
        summary: summary || "Google Meet Meeting",
        description: description || "Google Meet event",
        start: {
          dateTime: startDate,
          timeZone,
        },
        end: {
          dateTime: endDate,
          timeZone,
        },
        conferenceData: {
          createRequest: {
            requestId: `${Date.now()}`,
            conferenceSolutionKey: { type: "hangoutsMeet" },
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

      try {
        const { uid, companyId } = req.user;

        await prisma.Calendar.create({
          data: {
            uid,
            companyId,
            eventTopic: summary || "Google Meet Meeting",
            eventDate: startDate,
            startingTime: startDate,
            endingTime: endDate,
            description: description || "Google Meet event",
            meeting: true,
          },
        });
      } catch (dbError) {
        console.error("Failed to save meeting in DB:", dbError);
      }

      res.json({
        success: true,
        message: "Google Meet link created successfully",
        hangoutLink,
      });
    } catch (err) {
      console.error("Error creating meeting:", err);
      if (err.response)
        console.error("Error response details:", err.response.data);
      res
        .status(500)
        .json({ error: "Error creating Google Meet link: " + err.message });
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