import express from "express";
import {
  unlockAccount,
  lockAccount,
  getLockedAccounts,
} from "./security.controller.js";

import jwtTokenMiddleware from "../../middleware/jwtoken.middleware.js";

const router = express.Router();

router.use(jwtTokenMiddleware);

router.post("/lock/:id", lockAccount);

router.post("/unlock/:id", unlockAccount);

router.get("/locked", getLockedAccounts);

export default router;