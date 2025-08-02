import express, { json } from "express";
import auth from "./oauth.controller.js"
import jwtTokenMiddleware from "../../middleware/jwtoken.middleware.js";

const router = express.Router();

router.get("/oauth/github",jwtTokenMiddleware,auth.github);
router.get("/oauth/fb",jwtTokenMiddleware,auth.fb);
router.get("/oauth/linkedIn",jwtTokenMiddleware,auth.linkedIn);
router.get("/oauth/whatsApp",jwtTokenMiddleware,auth.whatsApp);

export default router;