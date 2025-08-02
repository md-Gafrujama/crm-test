import express from "express"
import path from "path"
import User from "./user.controller.js"
import { upload,uploadToCloudinary } from "../../utilis/fileUpload.js"

const router = express.Router()

router.post('/', upload.single('profilePhoto'), uploadToCloudinary, User.addUser);

export default router