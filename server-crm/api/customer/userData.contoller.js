import prisma from "../../prisma/prismaClient.js";
// import client from "../../middleware/redis.middleware.js";

const data = {
  async getData(req, res) {
    try {
      const companyId = req.user.companyId;
      const userId = req.user.uid;

      const userData = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          username: true,
          phoneNumber: true,
          role: true,
          userType: true,
          createdAt: true,
          updatedAt: true,
          assignedWork: true,
          statusOfWork: true,
          statusOfAccount: true,
          companyId: true,
          skills:true,
          about:true
        },
      });

      if (!userData) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // const cacheKey = `userLeadsData:${userId}:${companyId}`;
      // const cachedData = await client.get(cacheKey);

      // if (cachedData) {
      //   return res.status(200).json({
      //     success: true,
      //     message: "User and leads data fetched from cache.",
      //     data: JSON.parse(cachedData),
      //   });
      // }

      const allLeads = await prisma.Lead.count({
        where: {
          uid: userId,
          isCurrentVersion: true,
          companyId: companyId,
        },
      });

      const leadStatuses = [
        "New",
        "Contacted",
        "Engaged",
        "Qualified",
        "Proposal Sent",
        "Negotiation",
        "Closed Won",
        "Closed Lost",
        "On Hold",
        "Do Not Contact",
      ];

      const leadData = {};
      for (let status of leadStatuses) {
        leadData[`all${status.replace(" ", "")}`] = await prisma.Lead.findMany({
          where: {
            uid: userId,
            status: status,
            isCurrentVersion: true,
            companyId: companyId,
          },
        });
      }

      const responseData = {
        user: userData,
        allLeads: allLeads,
        totalLeads: allLeads,
        ...Object.keys(leadData).reduce((acc, status) => {
          acc[status] = leadData[status];
          acc[`${status.toLowerCase()}Count`] = leadData[status].length;
          return acc;
        }, {}),
      };

      // await client.set(cacheKey, JSON.stringify(responseData), "EX", 600);

      return res.status(200).json({
        success: true,
        message: "User and leads data retrieved successfully from DB.",
        data: responseData,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  },
};

export default data;