import prisma from "../../prisma/prismaClient.js";

const allUsersDetail = {
  async allData(req, res) {
    try {
      const companyId = req.user.companyId;
      const users = await prisma.user.findMany({
        where: {
          companyId: companyId,
        },
      });
      if (!users || users.length === 0) {
        return res.status(404).json({
          message: "No users found.",
        });
      } else {
        return res.status(200).json(users);
      }
    } catch (error) {
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  },

  async onlyAdmin(req, res) {
    try {
      const companyId = req.user.companyId;
      const userType = req.user.userType;
      if (userType != "admin") {
        res.status(200).json({
          msg: "Sorry , you are unauthorized to get the data",
        });
        return;
      }
      const data = await prisma.User.findMany({
        where: {
          userType: "admin",
          companyId: companyId,
        },
      });
      const dataCount = await prisma.User.count({
        where: {
          userType: "admin",
          companyId: companyId,
        },
      });

      res.status(200).json({
        msg: "Data is extracted properly",
        data: data,
        dataCount: dataCount,
      });
    } catch (error) {
      res.status(500).json({
        msg: "Cannot retirve the data",
        error: error.message || error,
      });
    }
  },

  async onlyUser(req, res) {
    try {
      const companyId = req.user.companyId;
      const userType = req.user.userType;
      if (userType != "admin") {
        res.status(200).json({
          msg: "Sorry , you are unauthorized to get the data",
        });
        return;
      }
      const data = await prisma.User.findMany({
        where: {
          role: "user",
          companyId: companyId,
        },
      });
      const dataCount = await prisma.User.count({
        where: {
          role: "user",
          companyId: companyId,
        },
      });

      res.status(200).json({
        msg: "Data is extracted properly",
        data: data,
        dataCount: dataCount,
      });
    } catch (error) {
      res.status(500).json({
        msg: "Cannot retirve the data",
        error: error.message || error,
      });
    }
  },
};

export default allUsersDetail;