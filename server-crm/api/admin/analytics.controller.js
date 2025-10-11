import express from "express";
import prisma from "../../prisma/prismaClient.js";
// import client from "../../middleware/redis.middleware.js";

// In-memory store for page time events: { [companyId]: Array<{ page: string, durationMs: number, userId: string, ts: number, ip?: string, userAgent?: string, deviceType?: 'mobile'|'tablet'|'desktop' }> }
// Note: This is a volatile store and will reset on server restart. Replace with a persistent store when schema is available.
const pageTimeStore = new Map();

function detectDeviceType(userAgent = '') {
  const ua = userAgent.toLowerCase();
  const isTablet = /(ipad|tablet|(android(?!.*mobile)))/i.test(userAgent);
  const isMobile = /mobile|iphone|ipod|android.*mobile|windows phone/i.test(userAgent);
  if (isTablet) return 'tablet';
  if (isMobile) return 'mobile';
  return 'desktop';
}

function getRequestIp(req) {
  const xfwd = req.headers['x-forwarded-for'];
  if (typeof xfwd === 'string' && xfwd.length) {
    // X-Forwarded-For may contain multiple IPs
    return xfwd.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || req.ip;
}

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

      const qualifiedLeads = await prisma.Lead.count({
        where: {
          companyId: companyId,
          isCurrentVersion: true,
          status: { in: ["Qualified", "Closed Won"] },
        },
      });

      const pendingLeads = await prisma.Lead.count({
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
          status: { in: ["Closed Lost", "Do Not Contact"] },
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

  // List recent page time events (includes ip, deviceType, userAgent)
  async getRecentEvents(req, res) {
    try {
      const userType = req.user.userType;
      const companyId = req.user.companyId;
      if (userType !== "admin") {
        return res.status(403).json({ msg: "Forbidden: admin only" });
      }
      const { userId } = req.query || {};
      const limit = Math.min(parseInt(req.query?.limit || '100', 10) || 100, 500);

      // Try DB first
      try {
        const where = { companyId, ...(userId ? { userId } : {}) };
        const rows = await prisma.pageTimeEvent.findMany({
          where,
          orderBy: { timestamp: 'desc' },
          take: limit,
          select: {
            id: true,
            userId: true,
            page: true,
            durationMs: true,
            deviceType: true,
            ip: true,
            userAgent: true,
            timestamp: true,
          },
        });
        return res.status(200).json({ msg: 'Recent events', data: rows });
      } catch (e) {
        // Fallback to memory
        const list = (pageTimeStore.get(companyId) || [])
          .filter(ev => !userId || ev.userId === userId)
          .sort((a,b) => b.ts - a.ts)
          .slice(0, limit)
          .map((ev, idx) => ({
            id: `${ev.userId || 'anon'}-${ev.ts}-${idx}`,
            userId: ev.userId,
            page: ev.page,
            durationMs: ev.durationMs,
            deviceType: ev.deviceType,
            ip: ev.ip,
            userAgent: ev.userAgent,
            timestamp: new Date(ev.ts).toISOString(),
          }));
        return res.status(200).json({ msg: 'Recent events (memory)', data: list });
      }
    } catch (error) {
      res.status(500).json({ msg: 'Failed to fetch recent events', error: error.message || error });
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
      const userId = req.user.id || req.user.uid;

      if (!companyId) {
        return res.status(400).json({ msg: "Missing company context" });
      }

      // Allow both admin and user events; restrict read to admin
      const { page, durationMs } = req.body || {};
      if (!page || typeof durationMs !== "number" || durationMs < 0) {
        return res.status(400).json({ msg: "Invalid payload" });
      }

      const userAgent = req.get('user-agent') || '';
      const ip = getRequestIp(req);
      const deviceType = detectDeviceType(userAgent);

      const list = pageTimeStore.get(companyId) || [];
      list.push({ page, durationMs, userId, ts: Date.now(), ip, userAgent, deviceType });
      // Keep only the last N events per company to cap memory usage
      const MAX_EVENTS = 5000;
      if (list.length > MAX_EVENTS) {
        list.splice(0, list.length - MAX_EVENTS);
      }
      pageTimeStore.set(companyId, list);

      // Persist to DB if schema is available
      try {
        await prisma.pageTimeEvent.create({
          data: {
            companyId,
            userId,
            page,
            durationMs,
            ip,
            userAgent,
            deviceType,
            timestamp: new Date(),
          },
        });
      } catch (e) {
        // Swallow if model/table not ready; in-memory still tracks
      }

      return res.status(201).json({ msg: "Recorded", count: list.length });
    } catch (error) {
      res.status(500).json({ msg: "Failed to record page time", error: error.message || error });
    }
  },

  // Get average time per page for the admin's company, with optional filters
  async getAverageTimePerPage(req, res) {
    try {
      const userType = req.user.userType;
      const companyId = req.user.companyId;
      if (userType !== "admin") {
        return res.status(403).json({ msg: "Forbidden: admin only" });
      }
      const { userId, deviceType } = req.query || {};

      // Try to read from DB; fallback to in-memory if model doesn't exist
      let list = [];
      try {
        const where = {
          companyId,
          ...(userId ? { userId } : {}),
          ...(deviceType ? { deviceType } : {}),
        };
        const rows = await prisma.pageTimeEvent.findMany({
          where,
          select: { page: true, durationMs: true },
          orderBy: { timestamp: 'desc' },
          take: 5000,
        });
        list = rows.map(r => ({ page: r.page, durationMs: r.durationMs }));
      } catch (e) {
        list = (pageTimeStore.get(companyId) || []).filter(ev => {
          if (userId && ev.userId !== userId) return false;
          if (deviceType && ev.deviceType !== deviceType) return false;
          return true;
        });
      }
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

  // Get device type breakdown (counts) with optional filters
  async getDeviceBreakdown(req, res) {
    try {
      const userType = req.user.userType;
      const companyId = req.user.companyId;
      if (userType !== "admin") {
        return res.status(403).json({ msg: "Forbidden: admin only" });
      }
      const { userId } = req.query || {};
      let counts = { desktop: 0, mobile: 0, tablet: 0 };
      try {
        const where = { companyId, ...(userId ? { userId } : {}) };
        const rows = await prisma.pageTimeEvent.findMany({
          where,
          select: { deviceType: true },
          orderBy: { timestamp: 'desc' },
          take: 5000,
        });
        for (const r of rows) {
          const dt = r.deviceType || 'desktop';
          if (!counts[dt]) counts[dt] = 0;
          counts[dt] += 1;
        }
      } catch (e) {
        const list = (pageTimeStore.get(companyId) || []).filter(ev => {
          if (userId && ev.userId !== userId) return false;
          return true;
        });
        for (const ev of list) {
          const dt = ev.deviceType || 'desktop';
          if (!counts[dt]) counts[dt] = 0;
          counts[dt] += 1;
        }
      }
      return res.status(200).json({ msg: 'Device breakdown', data: counts });
    } catch (error) {
      res.status(500).json({ msg: 'Failed to compute device breakdown', error: error.message || error });
    }
  },

  // List recent page time events (includes ip, deviceType, userAgent)
  async getRecentEvents(req, res) {
    try {
      const userType = req.user.userType;
      const companyId = req.user.companyId;
      if (userType !== "admin") {
        return res.status(403).json({ msg: "Forbidden: admin only" });
      }
      const { userId } = req.query || {};
      const limit = Math.min(parseInt(req.query?.limit || '100', 10) || 100, 500);

      // Try DB first
      try {
        const where = { companyId, ...(userId ? { userId } : {}) };
        const rows = await prisma.pageTimeEvent.findMany({
          where,
          orderBy: { timestamp: 'desc' },
          take: limit,
          select: {
            id: true,
            userId: true,
            page: true,
            durationMs: true,
            deviceType: true,
            ip: true,
            userAgent: true,
            timestamp: true,
          },
        });
        return res.status(200).json({ msg: 'Recent events', data: rows });
      } catch (e) {
        // Fallback to memory
        const list = (pageTimeStore.get(companyId) || [])
          .filter(ev => !userId || ev.userId === userId)
          .sort((a,b) => b.ts - a.ts)
          .slice(0, limit)
          .map((ev, idx) => ({
            id: `${ev.userId || 'anon'}-${ev.ts}-${idx}`,
            userId: ev.userId,
            page: ev.page,
            durationMs: ev.durationMs,
            deviceType: ev.deviceType,
            ip: ev.ip,
            userAgent: ev.userAgent,
            timestamp: new Date(ev.ts).toISOString(),
          }));
        return res.status(200).json({ msg: 'Recent events (memory)', data: list });
      }
    } catch (error) {
      res.status(500).json({ msg: 'Failed to fetch recent events', error: error.message || error });
    }
  },
};

export default analytics;
