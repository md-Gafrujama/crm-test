import express from "express";
import jwtTokenMiddleware from "../../middleware/jwtoken.middleware.js";
import corsMiddleware from "../../middleware/cors.middleware.js";
import { fetchLeadsByUser,fetchTimelyLeadsByUser } from "./leads.services.js";
import { convertLeadsToCSV } from "../../utilis/csvExporter.js";

const router = express.Router();

router.use(corsMiddleware);

router.get("/csv", jwtTokenMiddleware, async (req, res) => {
  try {
    const { uid: userId, userType, username } = req.user;
    const { condition } = req.query; 

    if (!userId || !userType) {
      return res.status(400).json({ error: "Missing user ID or type" });
    }

    let leads;
    const today = new Date();

    switch (condition) {
      case "weekly":
      case "monthly":
        leads = await fetchTimelyLeadsByUser(userId, userType, username, null, today, condition);
        break;
      default:
        leads = await fetchLeadsByUser(userId, userType, username);
        break;
    }

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
