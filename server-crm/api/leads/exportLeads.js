import express from "express";
import jwtTokenMiddleware from "../../middleware/jwtoken.middleware.js";
import corsMiddleware from "../../middleware/cors.middleware.js";
import { fetchLeadsByUser } from "./leads.services.js";
import { convertLeadsToCSV } from "../../utilis/csvExporter.js";

const router = express.Router();

router.use(corsMiddleware);

router.get("/csv", jwtTokenMiddleware, async (req, res) => {
  try {
    const { uid: userId, userType,username } = req.user;

    if (!userId || !userType) {
      return res.status(400).json({ error: "Missing user ID or type" });
    }

    const leads = await fetchLeadsByUser(userId, userType,username);

    if (!leads.length) {
      return res.status(404).json({ error: "No leads found" });
    }

    const csv = convertLeadsToCSV(leads);

    res.header("Content-Type", "text/csv");
    res.header("Content-Disposition", 'attachment; filename="leads.csv"');
    res.send(csv);
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ error: error.message || "Server error" });
  }
});

export default router;
