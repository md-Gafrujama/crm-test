import express from "express";
import calendar from "./calendar.controller.js";
import jwtTokenMiddleware from "../../middleware/jwtoken.middleware.js";
import googleCalendarMiddleware from "../../middleware/googleCalendar.middleware.js";
const router = express.Router();

router.get("/getAllEvents",jwtTokenMiddleware,calendar.getEvents);
router.post("/postAnEvent",jwtTokenMiddleware, googleCalendarMiddleware.createEvent, calendar.addEvent);
  router.put("/updateEvent/:id",jwtTokenMiddleware,calendar.updateEvent);
router.delete("/delEvent/:id",jwtTokenMiddleware,calendar.deleteEvent);

export default router;