import express from "express";
import jwtTokenMiddleware from "../../middleware/jwtoken.middleware.js";
import userProfile from "./userProfile.controller.js";

const router = express.Router();
router.use(express.json());

router.get("/:id", jwtTokenMiddleware, userProfile.getUser);
router.put("/:id", jwtTokenMiddleware, userProfile.updateUser);
router.delete("/:id", jwtTokenMiddleware, userProfile.deleteUser);

export default router;
