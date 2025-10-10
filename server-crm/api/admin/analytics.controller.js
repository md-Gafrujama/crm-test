import express from "express";
import prisma from "../../prisma/prismaClient.js";
// import client from "../../middleware/redis.middleware.js";

// In-memory store for page time events: { [companyId]: Array<{ page: string, durationMs: number, userId: string, ts: number }> }
// Note: This is a volatile store and will reset on server restart. Replace with a persistent store when schema is available.
const pageTimeStore = new Map();

const analytics = {
  async getLeadsData(req, res) {
    try {
      const userType = req.user.userType;
      const companyId = req.user.companyId;

      if (userType != "admin") {
        res.status(200).json({
          msg: "You are not the admin so we cannot fetch the request data.",
        });
        return;
      }

      // const cacheKey = `leadsData:${companyId}`;
      // const cachedData = await client.get(cacheKey);

      // if (cachedData) {
      //   return res.status(200).json({
      //     msg: "Fetched leads data from cache.",
      //     ...JSON.parse(cachedData),
      //   });
      // }

      const qualifiedLeads = await prisma.Lead.count({
        where: {
          companyId: companyId,
          isCurrentVersion: true,
          status: {
            in: ["Qualified", "Closed Won"],
          },
        },
      });

      const pendingLeads = await prisma.lead.count({
        where: {
          companyId: companyId,
          isCurrentVersion: true,
          status: {
            in: [
              "Contacted",
              "Engaged",
              "On Hold",
              "Proposal sent",
              "Negotiation",
            ],
          },
        },
      });

      const lossLeads = await prisma.Lead.count({
        where: {
          companyId: companyId,
          isCurrentVersion: true,
          status: {
            in: ["Closed Lost", "Do Not Contact"],
          },
        },
      });

      const totalLeads = qualifiedLeads + pendingLeads + lossLeads;

      // const responseData = {
      //   totalLeads,qualifiedLeads,pendingLeads,lossLeads
      // }

      // await client.set(cacheKey, JSON.stringify(responseData), "EX", 600);

      // const qualifiedLeads = await prisma.Lead.count({where:{companyId:companyId,isCurrentVersion:true,status:"Qualified"}});
      // const lossLeads = await prisma.Lead.count({where:{companyId:companyId,isCurrentVersion:true,status:"Do Not Contact"}});


      res.status(200).json({
        msg: "Successfully fetched leads data from analytics.",
        totalLeads: totalLeads,
        qualifiedLeads: qualifiedLeads,
        pendingLeads: pendingLeads,
        lossLeads: lossLeads,
      });
    } catch (error) {
      res.status(500).json({
        msg: "Somthing went wrong in the server. It will be solved sortly.",
        error: error.message || error,
      });
    }
  },

  async getUsersData(req, res) {
    try {
      const userType = req.user.userType;
      const companyId = req.user.companyId;
      if (userType != "admin") {
        res.status(200).json({
          msg: "You are not the admin so we cannot fetch the request data.",
        });
        return;
      }

      const totalUser = await prisma.User.count({
        where: { companyId: companyId },
      });
      const activeUser = await prisma.User.count({
        where: { companyId: companyId, locked: false },
      });
      const totalEmployee = await prisma.Employee.count({
        where: { companyId: companyId },
      });

      const conversionRateFromTotal =
        totalUser > 0 ? (totalEmployee / totalUser) * 100 : 0;
      const conversionRateFromActive =
        activeUser > 0 ? (totalEmployee / activeUser) * 100 : 0;
      const detail =
        conversionRateFromActive > 100
          ? "You should have more employee than user"
          : "Good";

      res.status(200).json({
        msg: "Successfully fetched user's data for analytics.",
        totalUser: totalUser,
        activeUser: activeUser,
        totalEmployee: totalEmployee,
        conversionRateFromActive: conversionRateFromActive,
        conversionRateFromTotal: conversionRateFromTotal,
        detail,
      });
    } catch (error) {
      res.status(500).json({
        msg: "Somthing went wrong in the server. It will be solved sortly.",
        error: error.message || error,
      });
    }
  },

  // Record a page time event
  async postPageTimeEvent(req, res) {
    try {
      const userType = req.user.userType;
      const companyId = req.user.companyId;
      const userId = req.user.id;

      if (!companyId) {
        return res.status(400).json({ msg: "Missing company context" });
      }

      // Allow both admin and user events; restrict read to admin
      const { page, durationMs } = req.body || {};
      if (!page || typeof durationMs !== "number" || durationMs < 0) {
        return res.status(400).json({ msg: "Invalid payload" });
      }

      const list = pageTimeStore.get(companyId) || [];
      list.push({ page, durationMs, userId, ts: Date.now() });
      // Keep only the last N events per company to cap memory usage
      const MAX_EVENTS = 5000;
      if (list.length > MAX_EVENTS) {
        list.splice(0, list.length - MAX_EVENTS);
      }
      pageTimeStore.set(companyId, list);

      return res.status(201).json({ msg: "Recorded", count: list.length });
    } catch (error) {
      res.status(500).json({ msg: "Failed to record page time", error: error.message || error });
    }
  },

  // Get average time per page for the admin's company
  async getAverageTimePerPage(req, res) {
    try {
      const userType = req.user.userType;
      const companyId = req.user.companyId;
      if (userType !== "admin") {
        return res.status(403).json({ msg: "Forbidden: admin only" });
      }
      const list = pageTimeStore.get(companyId) || [];
      const agg = {};
      for (const ev of list) {
        if (!agg[ev.page]) agg[ev.page] = { total: 0, count: 0 };
        agg[ev.page].total += ev.durationMs;
        agg[ev.page].count += 1;
      }
      const averages = Object.keys(agg).map((page) => ({
        page,
        averageMs: agg[page].count ? Math.round(agg[page].total / agg[page].count) : 0,
        samples: agg[page].count,
      }));

      // Sort by highest average first
      averages.sort((a, b) => b.averageMs - a.averageMs);

      return res.status(200).json({
        msg: "Average time per page",
        data: averages,
      });
    } catch (error) {
      res.status(500).json({ msg: "Failed to compute averages", error: error.message || error });
    }
  },
};

export default analytics;
