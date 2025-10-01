import { google } from "googleapis";
import prisma from "../prisma/prismaClient.js";

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

const googleCalendarMiddleware = {
  async createEvent(req, res, next) {
    try {
      const {
        eventTopic,
        startingTime,
        endingTime,
        description,
        eventFor,
        companyId,
        uid,
        withMeet = false,
        calendarId = "primary",
        timeZone = "UTC",
      } = req.body;

      if (!oauth2Client.credentials?.access_token) {
        return res.status(401).json({
          error:
            "Google Calendar not authenticated. Please authenticate first at /api/calendar/auth",
        });
      }

      const startDate = formatDateToISO(startingTime);
      const endDate = formatDateToISO(endingTime);

      if (endDate <= startDate) {
        return res.status(400).json({
          error: "End time must be after the start time",
        });
      }

      const calendar = google.calendar({ version: "v3", auth: oauth2Client });

      const event = {
        summary: eventTopic,
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

      if (withMeet) {
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
        conferenceDataVersion: withMeet ? 1 : 0,
      });

      const eventData = {
        uid,
        companyId,
        eventTopic,
        description,
        eventDate: new Date(startDate),
        startingTime: new Date(startDate),
        endingTime: new Date(endDate),
        eventFor,
        meeting: withMeet ? "with-meet" : "without-meet",
        hangoutLink: response.data.hangoutLink || null,
        googleEventLink: response.data.htmlLink || null,
      };

      const savedEvent = await prisma.calendar.create({
        data: eventData,
      });

      req.googleEventData = {
        ...eventData,
        id: savedEvent.id,
        eventCreated: true,
      };

      next();
    } catch (error) {
      console.error("Google Calendar middleware error:", error);
      return res.status(500).json({
        error: "Failed to create Google Calendar event: " + error.message,
      });
    }
  },
};

export default googleCalendarMiddleware;
