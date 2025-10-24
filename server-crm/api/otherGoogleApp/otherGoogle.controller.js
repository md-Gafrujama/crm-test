import { BetaAnalyticsDataClient } from "@google-analytics/data";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const KEY_FILE = process.env.GA4_KEY_FILE;
const PROPERTY_ID = process.env.GA4_PROPERTY_ID;

if (!KEY_FILE || !PROPERTY_ID) {
  console.error("Missing GA4_KEY_FILE or GA4_PROPERTY_ID in .env file");
  process.exit(1);
}

const analyticsClient = new BetaAnalyticsDataClient({
  keyFilename: path.resolve(KEY_FILE),
});

export const getAllEvents = async (req, res) => {
  try {
    const [response] = await analyticsClient.runReport({
      property: PROPERTY_ID,
      dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
      dimensions: [
        { name: "eventName" },
        { name: "country" },
        { name: "city" },
        { name: "deviceCategory" },
      ],
      metrics: [
        { name: "eventCount" },
        { name: "sessions" },
        { name: "totalUsers" },
      ],
      limit: 1000,
    });

    const formatted = response.rows?.map((row) => ({
      eventName: row.dimensionValues?.[0]?.value || "unknown_event",
      country: row.dimensionValues?.[1]?.value || "N/A",
      city: row.dimensionValues?.[2]?.value || "N/A",
      device: row.dimensionValues?.[3]?.value || "N/A",
      eventCount: row.metricValues?.[0]?.value || "0",
      sessions: row.metricValues?.[1]?.value || "0",
      totalUsers: row.metricValues?.[2]?.value || "0",
    }));

    const totals = response.totals?.[0]?.metricValues;
    const summary = {
      eventCount: totals?.[0]?.value || "0",
      sessions: totals?.[1]?.value || "0",
      totalUsers: totals?.[2]?.value || "0",
    };

    res.json({
      company: "qb2b",
      propertyId: PROPERTY_ID,
      totalRows: formatted?.length || 0,
      summary,
      data: formatted || [],
    });
  } catch (err) {
    console.error("GA4 Data API Error:", err);
    res.status(500).json({
      error: "Failed to fetch GA4 data",
      details: err.message,
    });
  }
};
