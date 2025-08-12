import express from "express"
import path from "path"
import User from "./user.controller.js"
import { upload,uploadToCloudinary } from "../../utilis/fileUpload.js"
import jwtTokenMiddleware from "../../middleware/jwtoken.middleware.js"

const router = express.Router()
// ✅ Handle OPTIONS preflight explicitly
router.options("/", corsMiddleware); // Preflight for this route

// ✅ Apply CORS to all requests on this router
router.use(corsMiddleware);

router.post('/', upload.single('profilePhoto'), uploadToCloudinary,jwtTokenMiddleware, User.addUser);

export default router
