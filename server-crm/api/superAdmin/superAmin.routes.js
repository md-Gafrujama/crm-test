import express from "express";
import prisma from "../../prisma/prismaClient.js";
import jwtTokenMiddleware from "../../middleware/jwtoken.middleware.js";
import superAdmin from "./superAdmin.controller.js"
const router = express.Router();

router.get("/",jwtTokenMiddleware,superAdmin.getAllData);
//router.delete("/:id",jwtTokenMiddleware,superAdmin.deleteCompany);
//router.put("/:id",jwtTokenMiddleware,superAdmin.updateCompanyStatus);

export default router;