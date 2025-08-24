import express from "express";
import prisma from "../../prisma/prismaClient.js";
import jwtTokenMiddleware from "../../middleware/jwtoken.middleware.js";

const router = express.Router();
router.use(express.json());

router.get("/", jwtTokenMiddleware, async (req, res) => {
  try {
    const companyId = req.user.companyId;

    const users = await prisma.User.findMany({
      where: { companyId },
    });

    const updatedUserDetails = users.filter(
      (user) => user.createdAt.getTime() !== user.updatedAt.getTime()
    );
    const lockedUsers = await prisma.user.findMany({
      where: { locked: true, companyId: companyId },
    });
    const employees = await prisma.employee.findMany({
      where: { companyId: companyId },
      orderBy: { createdAt: "desc" },
      take: 10,
    });
    const totalEmployees = await prisma.employee.count({
      where: { companyId: companyId },
    });
    const leads = await prisma.lead.findMany({
      where: { isCurrentVersion: true, companyId: companyId },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    const userCount = await prisma.user.count({
      where: { companyId: companyId },
    });
    const leadsCount = await prisma.Lead.count({
      where: { isCurrentVersion: true, companyId: companyId },
    });

    res.status(200).json({
      msg: " Got data from mongodb",
      updatedUser: updatedUserDetails,
      lockedUser: lockedUsers,
      userData: users,
      lockedUser: lockedUsers,
      lastCreatedEmployee: employees,
      leads: leads,
      userNumber: userCount,
      leadsNumber: leadsCount,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

export default router;