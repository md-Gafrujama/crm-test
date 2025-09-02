import express from "express";
import prisma from "../../prisma/prismaClient.js";
import bcrypt from "bcrypt";

const superAdminSecond = {

  async getLeadsData(req, res) {
    try {
      const userType = req.user.userType;

      if (userType !== "superAdmin") {
        res.status(200).json({
          msg: "You are not the SUPER ADMIN so we cannot fetch the request data.",
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
          isCurrentVersion: true,
          status: {
            in: ["Qualified", "Closed Won"],
          },
        },
      });

      const pendingLeads = await prisma.lead.count({
        where: {
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

}

export default superAdminSecond