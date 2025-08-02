import express from "express";
import qb2b from "./qb2b.controller.js";

const router = express.Router();

router.post("/contact", qb2b.Contact);
router.get("/contact",qb2b.getContact);
router.delete("/contact/:id",qb2b.delContact);

router.post("/leads",qb2b.Leads);
router.get("/leads",qb2b.getLeads);
router.delete("/leads/:id",qb2b.delLeads);

export default router;