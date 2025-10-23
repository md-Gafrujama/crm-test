import express from "express";
import { getAllEvents } from "./otherGoogle.controller.js";

const router = express.Router();

router.get("/:companyId", getAllEvents);

export default router;
