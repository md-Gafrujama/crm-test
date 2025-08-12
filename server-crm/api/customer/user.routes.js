import express from "express"
import path from "path"
import User from "./user.controller.js"
import { upload,uploadToCloudinary } from "../../utilis/fileUpload.js"
import jwtTokenMiddleware from "../../middleware/jwtoken.middleware.js"
import corsMiddleware from "../../middleware/cors.middleware.js"; // ✅ IMPORTED!

const router = express.Router();

// ✅ Handle preflight (OPTIONS) for this route
router.options("/", corsMiddleware);

// ✅ Apply CORS to all requests on this router
router.use(corsMiddleware);

// ✅ POST route with upload
router.post("/", upload.single('profilePhoto'), uploadToCloudinary, jwtTokenMiddleware, User.addUser);

export default router;
