import express from "express";
import jwtTokenMiddleware from "../../middleware/jwtoken.middleware.js";
import changePass from "./changePass.controller.js";

const router = express.Router();

router.post('/', jwtTokenMiddleware,changePass.editPass);

export default router;