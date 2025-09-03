import express from "express";
import prisma from "../../prisma/prismaClient.js";
import superAdminAuthMiddleware from "../../middleware/superAdmin.middleware.js";
import superAdmin from "./superAdmin.controller.js";
import superAdminSecond from "./superAdminSecond.controller.js";
import {sendOtp,verifyOtp} from "./otp.controller.js";

const router = express.Router();

router.get("/",superAdminAuthMiddleware,superAdmin.getAllData);
router.get("/count",superAdminAuthMiddleware,superAdmin.count);
router.get("/approved",superAdminAuthMiddleware,superAdmin.approved);
router.get("/pending",superAdminAuthMiddleware,superAdmin.pending);
router.get("/rejected",superAdminAuthMiddleware,superAdmin.rejected);
router.get("/companyType",superAdminAuthMiddleware,superAdmin.companyType);

router.get("/leadsCount",superAdminAuthMiddleware,superAdminSecond.getLeadsData)

router.delete("/del/:id",superAdminAuthMiddleware,superAdmin.deleteCompany);
router.put("/update/:id",superAdminAuthMiddleware,superAdmin.updateCompanyStatus);

router.post("/send-otp", sendOtp);  
router.post("/verify-otp", verifyOtp); 

export default router;