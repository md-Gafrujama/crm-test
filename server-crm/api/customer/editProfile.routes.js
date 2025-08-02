import express from 'express';
import { updateUserProfile } from "./editProfile.controller.js";
import jwtTokenMiddleware from "../../middleware/jwtoken.middleware.js";

const router = express.Router();

router.put('/update-profile/:id', jwtTokenMiddleware, updateUserProfile);

export default router;
