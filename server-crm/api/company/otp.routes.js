import express from "express";

import { sendOTP,verifyOTP } from "./otp.controller.js";
const router = express.Router();
router.use(express.json());

router.post("/sendOTP",sendOTP);
router.post("/verifyOTP",verifyOTP);

export default router;