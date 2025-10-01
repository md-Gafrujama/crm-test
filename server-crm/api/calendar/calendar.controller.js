// import express from "express";
// import prisma from "../../prisma/prismaClient.js";

// const calendar = {
//   async addEvent(req, res) {
//     try {
//       const { uid, companyId, userType } = req.user;

//       if (userType === "admin") {
//         const {  eventTopic,  eventDate,  startingTime,  endingTime,  description,  meeting,} = req.body;
//         const event = await prisma.Calendar.create({
//           data: {
//             uid, companyId, eventTopic, eventDate, startingTime, endingTime, description, meeting,}
//         });

//         res.status(200).json(event);
//       } else {
//         return res.status(200).json({
//           msg: "Sorry you are not an Admin to perform this action",
//         });
//       }
//     } catch (error) {
//       return res.status(500).json({
//         error: error,
//         message: "Something went wrong while adding event in the Calendar",
//       });
//     }
//   },

//   async getEvents(req, res) {
//     try {
//       const { uid, userType, companyId } = req.user;

//       const query = {
//         select: {
//           id: true,
//           uid: true,
//           companyId: true,
//           eventTopic: true,
//           eventDate: true,
//           startingTime: true,
//           endingTime: true,
//           description: true,
//           meeting: true,
//         },
//       };

//       if (userType !== "admin") {
//         query.where = { uid };
//       } else {
//         query.where = { uid, companyId };
//       }

//       const events = await prisma.Calendar.findMany(query);

//       return res.status(200).json({
//         success: true,
//         message: "Events retrieved successfully",
//         data: events,
//       });
//     } catch (error) {
//       console.error("Error fetching events:", error);
//       return res.status(500).json({
//         success: false,
//         message: "An error occurred while retrieving events",
//         error: error.message,
//       });
//     }
//   },

//   async updateEvent(req, res) {
//     try {
//       const { uid, userType, companyId } = req.user;
//       if (userType === "admin") {
//         const { id } = req.params;
//         const {
//           eventTopic,
//           eventDate,
//           startingTime,
//           endingTime,
//           description,
//           meeting,
//         } = req.body;

//         const updatedEvent = await prisma.Calendar.update({
//           where: { id: id },
//           data: {
//             eventTopic,
//             eventDate,
//             startingTime,
//             endingTime,
//             description,
//             meeting,
//           },
//         });
//         res.status(200).json(updatedEvent);
//       } else {
//         return res.status(200).json({
//           msg: "Sorry you are not an Admin to perform this action",
//         });
//       }
//     } catch (error) {
//       return res.status(500).json({
//         error,
//         message:
//           "Something went wrong while updating the event in the Calendar",
//       });
//     }
//   },

//   async deleteEvent(req, res) {
//     try {
//       const { uid, userType } = req.user;
//       if (userType === "admin") {
//         const { id } = req.params;

//         const deletedEvent = await prisma.Calendar.delete({
//           where: { id: id },
//         });

//         res.status(200).json({
//           msg: "Below given data of this specific event has been deleted",
//           deletedEvent,
//         });
//       } else {
//         return res.status(200).json({
//           msg: "Sorry you are not an Admin to perform this action",
//         });
//       }
//     } catch (error) {
//       return res.status(500).json({
//         error,
//         message:
//           "Something went wrong while deleting the event from the Calendar",
//       });
//     }
//   },
// };

// export default calendar;

import prisma from "../../prisma/prismaClient.js";

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

const calendar = {
  async addEvent(req, res) {
    try {
      const { uid, companyId, userType } = req.user;

      if (userType !== "admin") {
        return res.status(403).json({
          msg: "Sorry, you are not an Admin to perform this action",
        });
      }

      if (!req.googleEventData?.eventCreated) {
        return res.status(400).json({
          error: "Google Calendar event was not created successfully",
        });
      }

      const {
          summary,
          description,
          startDateTime,
          endDateTime,
          meeting = false,
      } = req.body;

      if (!summary || !startDateTime || !endDateTime) {
        return res.status(400).json({
          error:
            "Missing required fields: summary, startDateTime, and endDateTime are required",
        });
      }

      const startDate = formatDateToISO(startDateTime);
      const endDate = formatDateToISO(endDateTime);

      if (endDate <= startDate) {
        return res.status(400).json({
          error: "End time must be after the start time",
        });
      }

      const event = await prisma.Calendar.create({
        data: {
          uid,
          companyId,
          eventTopic: summary,
          eventDate: new Date(startDate),
          startingTime: new Date(startDate),
          endingTime: new Date(endDate),
          description: description || "",
          meeting,
          hangoutLink: req.googleEventData.hangoutLink || null,
          googleEventLink: req.googleEventData.googleEventLink || null,
        },
      });

      res.status(200).json({
        success: true,
        message: "Event added successfully",
        data: event,
      });
    } catch (error) {
      console.error("Error adding event:", error);
      res.status(500).json({
        error: error.message,
        message: "Something went wrong while adding event in the Calendar",
      });
    }
  },

  async getEvents(req, res) {
    try {
      const { uid, userType, companyId } = req.user;

      const query = {
        select: {
          id: true,
          uid: true,
          companyId: true,
          eventTopic: true,
          eventDate: true,
          startingTime: true,
          endingTime: true,
          description: true,
          meeting: true,
        },
      };

      if (userType !== "admin") {
        query.where = { uid };
      } else {
        query.where = { companyId };
      }

      const events = await prisma.Calendar.findMany(query);

      return res.status(200).json({
        success: true,
        message: "Events retrieved successfully",
        data: events,
      });
    } catch (error) {
      console.error("Error fetching events:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while retrieving events",
        error: error.message,
      });
    }
  },

  async updateEvent(req, res) {
    try {
      const { userType } = req.user;
      if (userType === "admin") {
        const { id } = req.params;
        const {
          summary,
          description,
          startDateTime,
          endDateTime,
          meeting,
        } = req.body;

        const updateData = {};

        if (summary) updateData.eventTopic = summary;
        if (description) updateData.description = description;
        if (startDateTime) updateData.startingTime = formatDateToISO(startDateTime);
        if (endDateTime) updateData.endingTime = formatDateToISO(endDateTime);
        if (meeting !== undefined) updateData.meeting = meeting;

        if (updateData.startingTime) {
          updateData.eventDate = updateData.startingTime;
        }

        const updatedEvent = await prisma.Calendar.update({
          where: { id },
          data: updateData,
        });

        res.status(200).json({
          success: true,
          message: "Event updated successfully",
          data: updatedEvent,
        });
      } else {
        return res.status(403).json({
          msg: "Sorry, you are not an Admin to perform this action",
        });
      }
    } catch (error) {
      console.error("Error updating event:", error);
      return res.status(500).json({
        error: error.message,
        message: "Something went wrong while updating the event",
      });
    }
  },

  async deleteEvent(req, res) {
    try {
      const { userType } = req.user;
      if (userType === "admin") {
        const { id } = req.params;

        const deletedEvent = await prisma.Calendar.delete({
          where: { id },
        });

        res.status(200).json({
          success: true,
          msg: "Event deleted successfully",
          deletedEvent,
        });
      } else {
        return res.status(403).json({
          msg: "Sorry, you are not an Admin to perform this action",
        });
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      return res.status(500).json({
        error: error.message,
        message: "Something went wrong while deleting the event",
      });
    }
  },
};

export default calendar;
