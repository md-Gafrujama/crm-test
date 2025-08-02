import express from "express";
import jwtTokenMiddleware from "../../middleware/jwtoken.middleware.js";
import data from "./userData.contoller.js";

const router = express.Router();

router.get("/",jwtTokenMiddleware,data.getData);

export default router;
