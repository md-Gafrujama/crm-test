import express from "express";
import { getAllEvents } from "./otherGoogle.controller.js";
import jwtTokenMiddleware from "../../middleware/jwtoken.middleware.js";
const router = express.Router();

router.get("/",jwtTokenMiddleware,getAllEvents);

export default router;
