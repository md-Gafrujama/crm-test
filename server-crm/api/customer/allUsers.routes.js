import express, { Router } from "express";
import jwtTokenMiddleware from "../../middleware/jwtoken.middleware.js"
import allUsersDetail from "./allUsers.contoller.js";

const router = express.Router();

router.get("/",jwtTokenMiddleware,allUsersDetail.allData);
router.get("/admin",jwtTokenMiddleware,allUsersDetail.onlyAdmin);
router.get("/user",jwtTokenMiddleware,allUsersDetail.onlyUser);

export default router;