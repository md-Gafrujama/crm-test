import express from "express";
import alertController from "./alerts.controller.js";
import jwtTokenMiddleware from "../../middleware/jwtoken.middleware.js";

const router = express.Router();

router.post("/", jwtTokenMiddleware, alertController.createAlert);
router.get("/", jwtTokenMiddleware, alertController.getAllAlert);
router.delete("/:id",jwtTokenMiddleware,alertController.deleteAlert);
router.put("/:id",jwtTokenMiddleware,alertController.updateAlert);

export default router;