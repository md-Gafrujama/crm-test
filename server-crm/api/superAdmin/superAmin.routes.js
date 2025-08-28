import express from "express";
import prisma from "../../prisma/prismaClient.js";
import superAdminAuthMiddleware from "../../middleware/superAdmin.middleware.js";
import superAdmin from "./superAdmin.controller.js";
import {sendOtp,verifyOtp} from "./otp.controller.js";

const router = express.Router();

router.get("/",superAdminAuthMiddleware,superAdmin.getAllData);
router.post("/send-otp", sendOtp);  
router.post("/verify-otp", verifyOtp); 
//router.delete("/:id",superAdminAuthMiddleware,superAdmin.deleteCompany);
router.put("/:id",superAdminAuthMiddleware,superAdmin.updateCompanyStatus);

export default router;