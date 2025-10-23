import { BetaAnalyticsDataClient } from "@google-analytics/data";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const analyticsClient = new BetaAnalyticsDataClient({
  keyFilename: path.resolve(process.env.GA4_KEY_FILE),
});

export const getAllEvents = async (req, res) => {
  try {
    const [response] = await analyticsClient.runReport({
      property: process.env.GA4_PROPERTY_ID,
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      dimensions: [{ name: "eventName" }],
      metrics: [{ name: "eventCount" }],
    });

    const formatted = response.rows?.map((row) => ({
      eventName: row.dimensionValues[0].value,
      eventCount: row.metricValues[0].value,
    }));

    res.json({ events: formatted || [] });
  } catch (err) {
    console.error("GA4 Data API Error:", err);
    res.status(500).json({ error: "Failed to fetch GA4 events" });
  }
};
