import { BetaAnalyticsDataClient } from "@google-analytics/data";
import prisma from "../../prisma/prismaClient.js";
import path from "path";

export const getAllEvents = async (req, res) => {
  try {
    const companyId = req.user.companyId; 
    if (!companyId) {
      return res.status(400).json({ error: "companyId is required" });
    }

    // Fetch company credentials from DB
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: {
        keyFile: true,       // JSON key file stored in DB
        gaPropertyId: true,  // GA4 Property ID
      },
    });

    if (!company || !company.keyFile || !company.gaPropertyId) {
      return res.status(404).json({ error: "GA4 credentials not found for this company" });
    }

    // Sanitize GA4 Property ID: remove "properties/" prefix and trim spaces
    const rawPropertyId = company.gaPropertyId.toString().trim();
    const numericPropertyId = rawPropertyId.replace(/^properties\//i, '');
    
    if (!/^\d+$/.test(numericPropertyId)) {
      return res.status(400).json({ 
        error: `Invalid GA4 Property ID: ${company.gaPropertyId}. Must be numeric.` 
      });
    }

    // Prepare credentials
    const credentials = typeof company.keyFile === "object" ? company.keyFile : undefined;
    const keyFilePath = typeof company.keyFile === "string" ? path.resolve(company.keyFile) : undefined;

    const analyticsClient = new BetaAnalyticsDataClient({
      keyFilename: keyFilePath,
      credentials: credentials,
    });

    // Run GA4 report
    const [response] = await analyticsClient.runReport({
      property: `properties/${numericPropertyId}`,
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

    // Format response
    const data = response.rows?.map((row) => ({
      eventName: row.dimensionValues?.[0]?.value || "unknown_event",
      country: row.dimensionValues?.[1]?.value || "N/A",
      city: row.dimensionValues?.[2]?.value || "N/A",
      device: row.dimensionValues?.[3]?.value || "N/A",
      eventCount: row.metricValues?.[0]?.value || "0",
      sessions: row.metricValues?.[1]?.value || "0",
      totalUsers: row.metricValues?.[2]?.value || "0",
    })) || [];

    const totals = response.totals?.[0]?.metricValues || [];
    const summary = {
      eventCount: totals[0]?.value || "0",
      sessions: totals[1]?.value || "0",
      totalUsers: totals[2]?.value || "0",
    };

    // Send a clean, single response
    res.json({
      companyId,
      propertyId: numericPropertyId,
      totalRows: data.length,
      summary,
      data,
    });

  } catch (err) {
    console.error("GA4 Data API Error:", err);
    res.status(500).json({
      error: "Failed to fetch GA4 data",
      details: err.message,
    });
  }
};
