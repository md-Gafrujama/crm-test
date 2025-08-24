import express from "express";
import { sendOTP, verifyOTP } from "./otp.controller.js";
import { upload, uploadToCloudinary } from "../../utilis/fileUpload.js";

const router = express.Router();

router.use(express.json()); 

router.post("/sendOTP", sendOTP);
router.post("/verifyOTP",upload.single('profilePhoto'),uploadToCloudinary,verifyOTP);

export default router;