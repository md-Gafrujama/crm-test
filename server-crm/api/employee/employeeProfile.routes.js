import express from "express";
import jwtTokenMiddleware from "../../middleware/jwtoken.middleware.js";
import employeeProfile from "./employeeProfile.controller.js";

const router = express.Router();
router.use(express.json());

router.get("/:id", jwtTokenMiddleware, employeeProfile.getEmployee);
router.put("/:id", jwtTokenMiddleware, employeeProfile.updateEmployee);
router.delete("/:id", jwtTokenMiddleware, employeeProfile.deleteEmployee);

export default router;
