import express, { Router } from "express";
import jwtTokenMiddleware from "../../middleware/jwtoken.middleware.js"
import allUsersDetail from "./allUsers.contoller.js";

const router = express.Router();

router.get("/",jwtTokenMiddleware,allUsersDetail.allData);

export default router;