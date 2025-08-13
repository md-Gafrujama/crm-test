import express from "express";
import company from "./companies.controller.js";
import jwtTokenMiddleware from "../../middleware/jwtoken.middleware.js";
import { upload,uploadToCloudinary } from "../../utilis/fileUpload.js"

const router = express.Router();
router.use(express.json());


router.post("/",   upload.single('profilePhoto'),   uploadToCloudinary,   company.fillCompany);
router.get("/",jwtTokenMiddleware, company.getDetail);

export default router;