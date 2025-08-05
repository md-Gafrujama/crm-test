import express from "express";
import { sendOTP, verifyOTP } from "./OTP.controller.js";

const router = express.Router();
router.use(express.json());

router.post("/send", sendOTP);
router.post("/verify", verifyOTP);

export default router;
