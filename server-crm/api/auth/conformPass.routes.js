import express from "express";
import { updatePassword } from "./conformPass.controller.js";

const router = express.Router();

router.put("/", updatePassword);

export default router;
