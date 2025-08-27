import express, { Router } from "express";
import jwtTokenMiddleware from "../../middleware/jwtoken.middleware.js"
import allUsersDetail from "./allUsers.contoller.js";

const router = express.Router();

router.get("/",jwtTokenMiddleware,allUsersDetail.allData);
router.get("/info",jwtTokenMiddleware,allUsersDetail.info);
router.get("/admin",jwtTokenMiddleware,allUsersDetail.onlyAdmin);
router.get("/user",jwtTokenMiddleware,allUsersDetail.onlyUser);
router.get("/active",jwtTokenMiddleware,allUsersDetail.onlyActive);
router.get("/inactive",jwtTokenMiddleware,allUsersDetail.onlyInactive);

export default router;