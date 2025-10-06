import { google } from "googleapis";
import prisma from "../prisma/prismaClient.js";

const createOAuth2Client = () =>
  new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL_ONE,
    process.env.REDIRECT_URL_TWO
  );

function formatDateToISO(dateTimeStr) {
  if (!dateTimeStr) throw new Error("Date string is empty");

  const normalized = dateTimeStr.replace(" ", "T");
  const isoDate = new Date(normalized);

  if (isNaN(isoDate.getTime())) {
    throw new Error(
      "Invalid date format, expected RFC3339 like 2025-09-29T10:00:00+05:45"
    );
  }

  return isoDate.toISOString();
}

async function getAuthenticatedClient(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || !user.googleAccessToken || !user.googleRefreshToken) {
    throw new Error("Google account not connected. Please authenticate.");
  }

  const oauth2Client = createOAuth2Client();

  oauth2Client.setCredentials({
    access_token: user.googleAccessToken,
    refresh_token: user.googleRefreshToken,
    expiry_date: user.googleExpiryDate,
  });

  const needsRefresh =
    !user.googleExpiryDate || Date.now() >= user.googleExpiryDate - 60 * 1000;

  if (needsRefresh) {
    const { credentials } = await oauth2Client.refreshAccessToken();
    oauth2Client.setCredentials(credentials);

    await prisma.user.update({
      where: { id: userId },
      data: {
        googleAccessToken: credentials.access_token,
        googleExpiryDate: credentials.expiry_date,
        ...(credentials.refresh_token && {
          googleRefreshToken: credentials.refresh_token,
        }),
      },
    });
  }

  return oauth2Client;
}

const googleCalendarMiddleware = {
  async createEvent(req, res, next) {
    try {
      const {
        summary,
        startDateTime,
        endDateTime,
        description,
        eventPurpose,
        meetingType,
        requireMeeting = false,
        calendarId = "primary",
        timeZone = "UTC",
      } = req.body;

      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated." });
      }

      const oauth2Client = await getAuthenticatedClient(userId);
      const calendar = google.calendar({ version: "v3", auth: oauth2Client });

      const startDate = formatDateToISO(startDateTime);
      const endDate = formatDateToISO(endDateTime);

      if (endDate <= startDate) {
        return res
          .status(400)
          .json({ error: "End time must be after the start time" });
      }

      const event = {
        summary: summary,
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
      const eventData = {
        uid,
        companyId,
        eventTopic: summary,
        description,
        eventDate: new Date(startDate),
        startingTime: new Date(startDate),
        endingTime: new Date(endDate),
        eventPurpose,
        meetingType: requireMeeting ? "ONLINE" : meetingType || null,
        meeting: requireMeeting,
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
        hangoutLink: response.data.hangoutLink || null,
        googleEventLink: response.data.htmlLink || null,
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