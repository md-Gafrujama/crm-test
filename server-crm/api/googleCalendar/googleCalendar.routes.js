import express from "express";
import calendarController from "./googleCalendar.controller.js";
import jwtTokenMiddleware from "../../middleware/jwtoken.middleware.js";

const router = express.Router();

router.get("/auth", calendarController.auth);
router.get("/redirect", calendarController.redirect);
router.get("/calendars",jwtTokenMiddleware, calendarController.getCalendars);
router.get("/events",jwtTokenMiddleware, calendarController.getEvents);
router.get("/getAll",jwtTokenMiddleware,calendarController.getAllCalendarsAndEvents);

router.post("/addEvent",jwtTokenMiddleware, calendarController.addEvent);
router.post("/meeting",jwtTokenMiddleware, calendarController.createMeeting);
router.post("/createEvent",jwtTokenMiddleware,calendarController.createEvent);

router.get("/status",jwtTokenMiddleware, calendarController.status);

export default router;
