import express from "express";
import jwtTokenMiddleware from "../../middleware/jwtoken.middleware.js";
import leadsWork from "./leads.contoller.js";

const router = express.Router();
router.use(express.json())

router.post("/",jwtTokenMiddleware,leadsWork.addLeads);
router.get("/",jwtTokenMiddleware,leadsWork.getLeads);
router.put("/update-lead/:id", jwtTokenMiddleware, leadsWork.upLeads);
router.delete("/delete-lead/:id", jwtTokenMiddleware, leadsWork.delLeads);
router.get("/history/:id", jwtTokenMiddleware, leadsWork.getLeadHistory);


export default router;