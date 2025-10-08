import { google } from "googleapis";
import prisma from "../../prisma/prismaClient.js";
import jwt from "jsonwebtoken";
import { ObjectId } from "bson";

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
      const tokenFromQuery = req.query.authToken;

      if (tokenFromQuery) {
        try {
          const decoded = jwt.verify(tokenFromQuery, process.env.JWT_SECRET);
          console.log("Decoded JWT:", decoded);

          req.session = req.session || {};
          req.session.userId = decoded.uid;
          req.session.userEmail = decoded.email;
        } catch (jwtError) {
          console.error("JWT verification failed:", jwtError);
          return res
            .status(401)
            .json({ error: "Invalid authentication token" });
        }
      } else if (!req.user) {
        return res
          .status(401)
          .json({ error: "Missing or invalid authorization header" });
      }

      const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: [
          "https://www.googleapis.com/auth/calendar.readonly",
          "https://www.googleapis.com/auth/calendar.events",
          "https://www.googleapis.com/auth/userinfo.email",
          "https://www.googleapis.com/auth/userinfo.profile",
          "openid",
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
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
        return res.redirect(
          `${frontendUrl}/admin/calendar?auth=error&message=${encodeURIComponent(
            "No authorization code received"
          )}`
        );
      }

      // console.log("Received OAuth code:", code);

      const { tokens } = await oauth2Client.getToken(code);
      // console.log("Tokens from Google:", tokens);

      if (!tokens.access_token) {
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
        return res.redirect(
          `${frontendUrl}/admin/calendar?auth=error&message=${encodeURIComponent(
            "No access token received. Check your redirect URI and scopes."
          )}`
        );
      }

      oauth2Client.setCredentials(tokens);

      const tokenInfo = await oauth2Client.getTokenInfo(tokens.access_token);
      // console.log("Token info verified:", tokenInfo);

      const oauth2 = google.oauth2({
        auth: oauth2Client,
        version: "v2",
      });

      const { data: userInfo } = await oauth2.userinfo.get();
      // console.log("Fetched user info:", userInfo);

      if (!userInfo.email) {
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
        return res.redirect(
          `${frontendUrl}/admin/calendar?auth=error&message=${encodeURIComponent(
            "Failed to get user email from Google"
          )}`
        );
      }

      const user = await prisma.user.findUnique({
        where: { email: userInfo.email },
      });

      if (!user) {
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
        return res.redirect(
          `${frontendUrl}/admin/calendar?auth=error&message=${encodeURIComponent(
            `No local user found with email: ${userInfo.email}`
          )}`
        );
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          googleAccessToken: tokens.access_token,
          googleRefreshToken: tokens.refresh_token ?? user.googleRefreshToken,
          googleExpiryDate: tokens.expiry_date ?? user.googleExpiryDate,
        },
      });

      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      return res.redirect(
        `${frontendUrl}/admin/calendar?auth=success&message=Google account connected successfully`
      );
    } catch (error) {
      console.error("OAuth redirect error:", error.response?.data || error);
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      return res.redirect(
        `${frontendUrl}/admin/calendar?auth=error&message=${encodeURIComponent(
          "Google OAuth failed: " + error.message
        )}`
      );
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
          error: "Not authenticated. Please go to /api/calendar/auth first.",
        });
      }

      const calendarId = "primary";
      const calendar = google.calendar({ version: "v3", auth: oauth2Client });

      const timeMin = new Date();
      const timeMax = new Date();
      timeMax.setMonth(timeMax.getMonth() + 3);

      const response = await calendar.events.list({
        calendarId,
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        maxResults: 250,
        singleEvents: true,
        orderBy: "startTime",
      });

      const googleEvents = response.data.items || [];

      const dbEvents = await prisma.calendar.findMany({
        where: {
          companyId: req.user.companyId,
        },
        select: {
          id: true,
          googleEventId: true,
          eventTopic: true,
          startTime: true,
          endTime: true,
          description: true,
          hangoutLink: true,
        },
      });

      const formattedEvents = googleEvents.map((event) => {
        const hangoutLink =
          event.conferenceData?.entryPoints?.find(
            (entry) => entry.entryPointType === "video"
          )?.uri || null;

        const matchingDb = dbEvents.find(
          (dbEvent) => dbEvent.googleEventId === event.id
        );

        return {
          googleEventId: event.id,
          dbId: matchingDb ? matchingDb.id : null,
          summary: event.summary || "No Title",
          description: event.description || matchingDb?.description || "",
          start: event.start?.dateTime || event.start?.date,
          end: event.end?.dateTime || event.end?.date,
          hangoutLink: hangoutLink || matchingDb?.hangoutLink || null,
          source: matchingDb ? "synced" : "google_only",
        };
      });

      const dbOnlyEvents = dbEvents
        .filter(
          (dbEvent) =>
            !googleEvents.some((gEvent) => gEvent.id === dbEvent.googleEventId)
        )
        .map((event) => ({
          googleEventId: event.googleEventId,
          dbId: event.id,
          summary: event.eventTopic || "No Title",
          description: event.description || "",
          start: event.startTime,
          end: event.endTime,
          hangoutLink: event.hangoutLink || null,
          source: "db_only",
        }));

      const allEvents = [...formattedEvents, ...dbOnlyEvents];

      res.json({
        success: true,
        message: `Found ${allEvents.length} events (Google + Local)`,
        events: allEvents,
      });
    } catch (err) {
      console.error("Error fetching events", err);
      res
        .status(500)
        .json({ error: "Error fetching events", message: err.message });
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
          googleEventId: event.id,
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
        googleEventId: event.googleEventId,
        topic: event.eventTopic,
        description: event.description,
        start: event.startTime,
        end: event.endTime,
        eventDate: event.eventDate,
        eventPurpose: event.eventPurpose,
        meetingType: event.meetingType,
        googleEventLink: event.googleEventLink,
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

  async createMeeting(req, res) {
    try {
      if (!oauth2Client.credentials?.access_token)
        return res.status(401).json({
          error: "Not authenticated. Please go to /api/calendar/auth first.",
        });

      const {
        summary,
        description,
        startDateTime,
        endDateTime,
        timeZone = "UTC",
        eventPurpose,
        calendarId = "primary",
      } = req.body;
      if (!summary || !startDateTime || !endDateTime || !eventPurpose)
        return res.status(400).json({
          error:
            "Missing required fields: summary, startDateTime, endDateTime, eventPurpose",
        });

      const startDate = formatDateToISO(startDateTime);
      const endDate = formatDateToISO(endDateTime);
      if (endDate <= startDate)
        return res
          .status(400)
          .json({ error: "End time must be after the start time." });

      const calendar = google.calendar({ version: "v3", auth: oauth2Client });
      const event = {
        summary,
        description: description || "Online Meeting",
        start: { dateTime: startDate, timeZone },
        end: { dateTime: endDate, timeZone },
        conferenceData: {
          createRequest: {
            requestId: Date.now().toString(),
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        },
      };

      const response = await calendar.events.insert({
        calendarId: calendarId,
        resource: event,
        conferenceDataVersion: 1,
      });

      const googleEventId = response.data.id;
      const googleEventLink = response.data.htmlLink;
      const hangoutLink = response.data.hangoutLink;

      const { uid, companyId } = req.user;
      const createdBy = uid;

      const dbEvent = await prisma.calendar.create({
        data: {
          uid,
          companyId,
          eventTopic: summary,
          eventDate: new Date(startDate),
          startTime: new Date(startDate),
          endTime: new Date(endDate),
          meetingType: "ONLINE",
          description: description || "",
          eventPurpose,
          hangoutLink,
          googleEventId: googleEventId,
          googleEventLink,
          calendarId: calendarId,
          createdBy,
          updatedBy: createdBy,
        },
      });

      res.json({
        success: true,
        message: "Meeting created successfully with Google Meet link",
        meeting: {
          id: dbEvent.id,
          googleEventId: googleEventId,
          summary: response.data.summary,
          start: response.data.start,
          end: response.data.end,
          htmlLink: googleEventLink,
          hangoutLink,
        },
      });
    } catch (err) {
      console.error("Error creating meeting", err);
      res
        .status(500)
        .json({ error: "Error creating meeting", message: err.message });
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
        start: { dateTime: startDate, timeZone },
        end: { dateTime: endDate, timeZone },
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

      const newEvent = await prisma.calendar.create({
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
          googleEventId: response.data.id,
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
          dbId: newEvent.id,
          googleEventId: response.data.id,
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

  async editEvent(req, res) {
    try {
      if (!oauth2Client.credentials?.access_token) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const eventId = req.params.eventId;
      if (!eventId) {
        return res
          .status(400)
          .json({ error: "Missing required field eventId" });
      }

      const {
        summary,
        description,
        startDateTime,
        endDateTime,
        timeZone = "UTC",
        meetingType,
        eventPurpose,
      } = req.body;

      const isMongoId = ObjectId.isValid(eventId);

      const dbRecord = await prisma.calendar.findFirst({
        where: isMongoId
          ? { OR: [{ id: eventId }, { googleEventId: eventId }] }
          : { googleEventId: eventId },
      });

      if (!dbRecord) {
        return res
          .status(404)
          .json({ error: "Event not found in local database" });
      }

      const calendarId = dbRecord.calendarId || "primary";
      const googleEventId = dbRecord.googleEventId;

      const updatedEvent = {};
      if (summary) updatedEvent.summary = summary;
      if (description !== undefined) updatedEvent.description = description;

      if (startDateTime && endDateTime) {
        const startDate = formatDateToISO(startDateTime);
        const endDate = formatDateToISO(endDateTime);
        if (endDate <= startDate) {
          return res
            .status(400)
            .json({ error: "End time must be after the start time" });
        }
        updatedEvent.start = { dateTime: startDate, timeZone };
        updatedEvent.end = { dateTime: endDate, timeZone };
      } else if (startDateTime || endDateTime) {
        return res.status(400).json({
          error:
            "Both startDateTime and endDateTime must be provided together.",
        });
      }

      let googleResponse = null;
      const calendar = google.calendar({ version: "v3", auth: oauth2Client });

      if (googleEventId) {
        try {
          googleResponse = await calendar.events.patch({
            calendarId,
            eventId: googleEventId,
            resource: updatedEvent,
          });
        } catch (googleErr) {
          console.warn("Failed to update Google event:", googleErr.message);
        }
      }

      const updateData = {
        updatedBy: req.user.uid,
        updatedAt: new Date(),
        ...(summary && { eventTopic: summary }),
        ...(description !== undefined && { description }),
        ...(startDateTime && {
          startTime: new Date(startDateTime),
          eventDate: new Date(startDateTime),
        }),
        ...(endDateTime && { endTime: new Date(endDateTime) }),
        ...(meetingType && { meetingType }),
        ...(eventPurpose && { eventPurpose }),
      };

      const updatedDbEvent = await prisma.calendar.update({
        where: { id: dbRecord.id },
        data: updateData,
      });

      res.json({
        success: true,
        message: "Event updated successfully",
        updatedEvent: {
          dbId: updatedDbEvent.id,
          googleEventId: googleResponse?.data?.id || googleEventId,
          summary: googleResponse?.data?.summary || updatedDbEvent.eventTopic,
          start: googleResponse?.data?.start || updatedDbEvent.startTime,
          end: googleResponse?.data?.end || updatedDbEvent.endTime,
          htmlLink:
            googleResponse?.data?.htmlLink || updatedDbEvent.googleEventLink,
        },
      });
    } catch (err) {
      console.error("Error updating event", err);
      res.status(500).json({
        error: "Error updating event",
        message: err.message,
      });
    }
  },

  async deleteEvent(req, res) {
    try {
      if (!oauth2Client.credentials?.access_token) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const eventIdParam = req.params.eventId;
      if (!eventIdParam) {
        return res
          .status(400)
          .json({ error: "Missing required field eventId" });
      }

      const isMongoId = ObjectId.isValid(eventIdParam);

      const dbRecord = await prisma.calendar.findFirst({
        where: isMongoId
          ? { OR: [{ id: eventIdParam }, { googleEventId: eventIdParam }] }
          : { googleEventId: eventIdParam },
      });

      if (!dbRecord) {
        return res
          .status(404)
          .json({ error: "Event not found in local database" });
      }

      const calendarId = dbRecord.calendarId || "primary";

      if (dbRecord.googleEventId) {
        const calendar = google.calendar({ version: "v3", auth: oauth2Client });

        try {
          await calendar.events.get({
            calendarId,
            eventId: dbRecord.googleEventId,
          });

          await calendar.events.delete({
            calendarId,
            eventId: dbRecord.googleEventId,
          });

          // console.log(`Deleted Google event: ${dbRecord.googleEventId}`);
        } catch (googleErr) {
          if (googleErr.code === 404) {
            console.warn(
              `Google event already deleted: ${dbRecord.googleEventId}`
            );
          } else {
            console.error("Failed to delete from Google:", googleErr.message);
            return res.status(502).json({
              error: "Failed to delete event from Google Calendar",
              message: googleErr.message,
            });
          }
        }
      }

      await prisma.calendar.delete({
        where: { id: dbRecord.id },
      });

      res.json({
        success: true,
        message:
          "Event deleted successfully from Google Calendar (if existed) and local DB",
        deleted: {
          dbId: dbRecord.id,
          googleEventId: dbRecord.googleEventId || null,
        },
      });
    } catch (err) {
      console.error("Error deleting event:", err);
      res.status(500).json({
        error: "Error deleting event",
        message: err.message,
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
