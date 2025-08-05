import express from "express";
import company from "./companies.controller.js";

const router = express.Router();
router.use(express.json());

router.post("/",company.fillCompany);

export default router;