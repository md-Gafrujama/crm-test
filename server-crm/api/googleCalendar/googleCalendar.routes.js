import express from "express";
import calendarController from "./googleCalendar.controller.js";
import jwtTokenMiddleware from "../../middleware/jwtoken.middleware.js";

const router = express.Router();

router.get("/auth",jwtTokenMiddleware, calendarController.auth);
router.get("/redirect", calendarController.redirect);
router.get("/calendars",jwtTokenMiddleware, calendarController.getCalendars);
router.get("/events",jwtTokenMiddleware, calendarController.getEvents);

router.post("/addEvent",jwtTokenMiddleware, calendarController.addEvent);
router.post("/meeting",jwtTokenMiddleware, calendarController.createMeeting);

router.get("/status",jwtTokenMiddleware, calendarController.status);

export default router;
