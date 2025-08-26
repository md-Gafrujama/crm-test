import express from "express";
import prisma from "../../prisma/prismaClient.js";
import jwtTokenMiddleware from "../../middleware/jwtoken.middleware.js";
import superAdmin from "./superAdmin.controller.js";
import {sendOtp,verifyOtp} from "./otp.controller.js";

const router = express.Router();

router.get("/",jwtTokenMiddleware,superAdmin.getAllData);
router.post("/send-otp", sendOtp);  
router.post("/verify-otp", verifyOtp); 
//router.delete("/:id",jwtTokenMiddleware,superAdmin.deleteCompany);
//router.put("/:id",jwtTokenMiddleware,superAdmin.updateCompanyStatus);

export default router;