import express from "express";
import prisma from "../../prisma/prismaClient.js";

const calendar = {
  async addEvent(req, res) {
    try {
      const { uid, companyId } = req.user;
      const {
        eventTopic,
        eventDate,
        startingTime,
        endingTime,
        description,
        meeting,
      } = req.body;

      const event = await prisma.Calendar.create({
        data: {
          uid,
          companyId,
          eventTopic,
          eventDate,
          startingTime,
          endingTime,
          description,
          meeting,
        },
      });

      res.status(200).json(event);
    } catch (error) {
      return res.status(500).json({
        error:error,
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
        query.where = { uid, companyId };
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
      const { id } = req.params;
      const {
        eventTopic,
        eventDate,
        startingTime,
        endingTime,
        description,
        meeting,
      } = req.body;

      const updatedEvent = await prisma.Calendar.update({
        where: { id: Number(id) },
        data: {
          eventTopic,
          eventDate,
          startingTime,
          endingTime,
          description,
          meeting,
        },
      });

      res.status(200).json(updatedEvent);
    } catch (error) {
      return res.status(500).json({
        error,
        message:
          "Something went wrong while updating the event in the Calendar",
      });
    }
  },

  async deleteEvent(req, res) {
    try {
      const { id } = req.params;

      const deletedEvent = await prisma.Calendar.delete({
        where: { id: Number(id) },
      });

      res.status(200).json(deletedEvent);
    } catch (error) {
      return res.status(500).json({
        error,
        message:
          "Something went wrong while deleting the event from the Calendar",
      });
    }
  },
};

export default calendar;
