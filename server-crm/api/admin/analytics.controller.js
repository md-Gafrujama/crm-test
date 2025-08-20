import express from "express";
import prisma from "../../prisma/prismaClient.js";

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

      // const qualifiedLeads = await prisma.Lead.count({
      //   where: {
      //     companyId: companyId,
      //     isCurrentVersion: true,
      //     status: {
      //       in : ["Qualified","Closed Won"]
      //   }},
      // });

      const pendingLeads = await prisma.Lead.count({
        where: {
          companyId: companyId,
          isCurrentVersion: true,
          status: {
            in: [ "Contacted", "Engaged", "On Hold", "Proposal Sent", "Negotiation"],
          },
        },
      });

      // const lossLeads = await prisma.Lead.count({
      //   where: {
      //     companyId: companyId,
      //     isCurrentVersion: true,
      //     status: {
      //       in : ["Closed Lost","Do Not Contact"]
      //     }},
      // });

      const qualifiedLeads = await prisma.Lead.count({where:{companyId:companyId,isCurrentVersion:true,status:"Qualified"}});
      const lossLeads = await prisma.Lead.count({where:{companyId:companyId,isCurrentVersion:true,status:"Do Not Contact"}});

      const totalLeads = qualifiedLeads + pendingLeads + lossLeads;

      res.status(200).json({
        msg: "Successfully fetched leads data fro analytics.",
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
     
      const conversionRateFromTotal = totalUser > 0 ? (totalEmployee / totalUser) * 100 : 0;
      const conversionRateFromActive = activeUser > 0? (totalEmployee / activeUser) * 100: 0;
      const detail = conversionRateFromActive > 100 ? "You should have more employee than user" : "Good";

      res.status(200).json({
        msg: "Successfully fetched user's data for analytics.",
        totalUser: totalUser,
        activeUser: activeUser,
        totalEmployee: totalEmployee,
        conversionRateFromActive: conversionRateFromActive,
        conversionRateFromTotal : conversionRateFromTotal,
        detail
      });
    } catch (error) {
      res.status(500).json({
        msg: "Somthing went wrong in the server. It will be solved sortly.",
        error: error.message || error,
      });
    }
  },
};

export default analytics;
