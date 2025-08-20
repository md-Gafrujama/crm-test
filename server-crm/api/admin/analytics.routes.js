import express from "express";
import jwtTokenMiddleware from "../../middleware/jwtoken.middleware.js";
import analytics from "./analytics.controller.js";
const router = express.Router();

router.get("/leads",jwtTokenMiddleware,analytics.getLeadsData);
router.get("/users",jwtTokenMiddleware,analytics.getUsersData);

export default router;