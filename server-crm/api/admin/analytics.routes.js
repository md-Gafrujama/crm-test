import express from "express";
import jwtTokenMiddleware from "../../middleware/jwtoken.middleware.js";
import analytics from "./analytics.controller.js";
const router = express.Router();

router.get("/leads",jwtTokenMiddleware,analytics.getLeadsData);
router.get("/users",jwtTokenMiddleware,analytics.getUsersData);

// Page time tracking
router.post("/page-time", jwtTokenMiddleware, analytics.postPageTimeEvent);
router.get("/page-time/averages", jwtTokenMiddleware, analytics.getAverageTimePerPage);

export default router;