import express from "express";
import prisma from "../../prisma/prismaClient.js";
import bcrypt from "bcrypt";

function checkSuperAdmin(userType) {
  if (userType !== "superAdmin") {
    return res.status(403).json({ message: "Access denied." });
  }
}

const superAdmin = {
  //if we keep this system then anyone can become super admin
  // async createSuperAdmin(req, res) {
  //   try {
  //     const { firstName, lastName, userName, email, phone, password } =
  //       req.body;
  //     const hashedPassword = await bcrypt.hash(password, 10);

  //     const existingUser = await prisma.superAdmin.findUnique({
  //       where: { email },
  //     });

  //     if (existingUser) {
  //       return res
  //         .status(409)
  //         .json({ msg: "User with this email already exists." });
  //     }

  //     const newUser = await prisma.superAdmin.create({
  //       data: {
  //         firstName,
  //         lastName,
  //         userName,
  //         email,
  //         phone,
  //         password: hashedPassword,
  //       },
  //     });

  //     res.status(201).json({
  //       message: "Super Admin created successfully",
  //       user: newUser,
  //     });
  //   } catch (error) {
  //     res.status(500).json({
  //       msg: " Something went wrong.",
  //       error: error.message || error,
  //     });
  //   }
  // },

  async getAllData(req, res) {
    const userType = req.user.userType;
    checkSuperAdmin(userType);

    try {
      const companies = await prisma.company.findMany({
        select: {
          id: true,
          companyName: true,
          companyType: true,
          owners_firstName: true,
          owners_lastName: true,
          email: true,
          phone: true,
          createdAt: true,
          status: true,
        },
      });

      const companyStats = await Promise.all(
        companies.map(async (company) => {
          const [adminCount, employeeCount, leadCount, alertCount] =
            await Promise.all([
              prisma.user.count({
                where: {
                  userType: "admin",
                  companyId: company.id,
                },
              }),

              prisma.employee.count({
                where: {
                  companyId: company.id,
                },
              }),

              prisma.lead.count({
                where: {
                  companyId: company.id,
                  isCurrentVersion: true,
                },
              }),

              prisma.alertsandremainder.count({
                where: {
                  companyId: company.id,
                },
              }),
            ]);

          return {
            companyId: company.id,
            companyName: company.companyName,
            companyType: company.companyType,
            owners_firstName: company.owners_firstName,
            owners_lastName: company.owners_lastName,
            email: company.email,
            phone: company.phone,
            createdAt: company.createdAt,
            status: company.status,
            adminCount,
            employeeCount,
            leadCount,
            alertCount,
          };
        })
      );

      const formatted = {};
      companyStats.forEach((entry) => {
        formatted[entry.companyId] = {
          companyName: entry.companyName,
          companyType: entry.companyType,
          owners_firstName: entry.owners_firstName,
          owners_lastName: entry.owners_lastName,
          email: entry.email,
          phone: entry.phone,
          createdAt: entry.createdAt,
          status: entry.status,
          adminCount: entry.adminCount,
          employeeCount: entry.employeeCount,
          leadCount: entry.leadCount,
          alertCount: entry.alertCount,
        };
      });

      res.status(200).json(formatted);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while fetching company data" });
    }

    // try {
    //   const companies = await prisma.company.findMany({
    //     select: {
    //       id: true,
    //       companyName: true,
    //       companyType: true,
    //       owners_firstName: true,
    //       owners_lastName: true,
    //       email: true,
    //       phone: true,
    //       createdAt: true,
    //       status: true,
    //     },
    //   });

    //   const companyStats = await Promise.all(
    //     companies.map(async (company) => {
    //       const [adminCount, employeeCount, leadCount, alertCount] =
    //         await Promise.all([
    //           prisma.user.count({
    //             where: {
    //               userType: "admin",
    //               companyId: company.id,
    //             },
    //           }),

    //           prisma.employee.count({
    //             where: {
    //               companyId: company.id,
    //             },
    //           }),

    //           prisma.lead.count({
    //             where: {
    //               companyId: company.id,
    //               isCurrentVersion: true,
    //             },
    //           }),

    //           prisma.alertsandremainder.count({
    //             where: {
    //               companyId: company.id,
    //             },
    //           }),
    //         ]);

    //       return {
    //         companyId: company.id,
    //         companyName: company.companyName,
    //         adminCount,
    //         employeeCount,
    //         leadCount,
    //         alertCount,
    //       };
    //     })
    //   );

    //   const formatted = {};
    //   companyStats.forEach((entry) => {
    //     formatted[entry.companyId] = {
    //       companyName: entry.companyName,
    //       companyType: entry.companyType,
    //       owners_firstName: entry.owners_firstName,
    //       owners_lastName: entry.owners_lastName,
    //       email: entry.email,
    //       phone: entry.phone,
    //       createdAt: entry.createdAt,
    //       status: entry.status,
    //       adminCount: entry.adminCount,
    //       employeeCount: entry.employeeCount,
    //       leadCount: entry.leadCount,
    //       alertCount: entry.alertCount,
    //     };
    //   });

    //   res.status(200).json(formatted);
    // } catch (error) {
    //   console.error(error);
    //   res.status(500).json({ message: "Internal Server Error" });
    // }

    // try {
    //   const { uid, userType } = req.user;

    //   if (userType === "superAdmin") {
    //     const adminCount = await prisma.user.count({
    //       where: {
    //         userType: "admin",
    //       },
    //     });

    //     const companycount = await prisma.company.count();
    //     const companDetail = await prisma.company.findMany();

    //     const employeeCount = await prisma.employee.count();

    //     const companyCount = await prisma.company.count();

    //     const leadCount = await prisma.lead.count({
    //       where: {
    //         isCurrentVersion: true,
    //       },
    //     });

    //     const alertCount = await prisma.alertsandremainder.count();

    //     res.status(200).json({
    //       adminCount,
    //       employeeCount,
    //       companyCount,
    //       leadCount,
    //       alertCount,
    //     });
    //   } else {
    //     return res.status(200).json({
    //       msg: "Sorry you are not super admin and that's why you cannot get the data.",
    //     });
    //   }
    // } catch (error) {
    //   res.status(500).json({
    //     msg: "Soemthing went wrong. We will fix it soon.",
    //     error: error,
    //   });
    // }
  },

  async updateCompanyStatus(req, res) {
    const { userType, uid } = req.user;
    const companyId = req.parasms.id;
    const updateCompany = req.body;

    checkSuperAdmin(userType);
    try {
      const company = await prisma.company.findUnique({
        where: { id: companyId },
      });

      if (!company) {
        return res.status(404).json({
          success: false,
          message: "Company not found",
        });
      }
    } catch (error) {
      res.status(500).json({
        msg: "Something went wrong . We will try to fix this issue soon.",
      });
    }
  },

  async deleteCompany(req, res) {
    const { userType, uid } = req.user;
    const companyId = req.parasms.id;
    checkSuperAdmin(userType);
    try {
      await prisma.user.delete({
        where: { id: req.params.id },
      });
      res.json({ message: "Company has been deleted successfully" });
    } catch (error) {
      res.status(500).json({
        msg: "Something went wrong in server",
        error: error,
      });
    }
  },

  async count(req, res) {
    try {
      const userType = req.user.userType;
      checkSuperAdmin(userType);
      const approvedCount = await prisma.company.count({
        where: {
          status: "Approved",
        },
      });
      const pendingCount = await prisma.company.count({
        where: {
          status: "Pending",
        },
      });
      const rejectedCount = await prisma.company.count({
        where: {
          status: "Rejected",
        },
      });
      const total = approvedCount + rejectedCount + pendingCount;
      return res.status(200).json({
        total,
        approvedCount,
        pendingCount,
        rejectedCount,
      });
    } catch (error) {
      res.status(500).json({
        msg: "Something is not working well in backend, We will fix it soon.",
        error: error.msg || error,
      });
    }
  },

  async approved(req, res) {
    try {
      const userType = req.user.userType;
      checkSuperAdmin(userType);

      const approve = await prisma.company.findMany({
        where: {
          status: "Approved",
        },
      });

      const approvedCount = await prisma.company.count({
        where: {
          status: "Approved",
        },
      });

      return res.status(200).json({
        data: approve,
        count: approvedCount,
      });
    } catch (error) {
      res.status(500).json({
        msg: "Something went wrong in server. We will fix it soon",
        error: error.msg || error,
      });
    }
  },

  async pending(req, res) {
    try {
      const userType = req.user.userType;
      checkSuperAdmin(userType);

      const pending = await prisma.company.findMany({
        where: {
          status: "Pending",
        },
      });

      const pendingCount = await prisma.company.count({
        where: {
          status: "Pending",
        },
      });

      return res.status(200).json({
        pending: pending,
        count: pendingCount,
      });
    } catch (error) {
      res.status(500).json({
        msg: "Something went wrong in server. We will fix it soon",
        error: error.msg || error,
      });
    }
  },

  async rejected(req, res) {
    try {
      const userType = req.user.userType;
      checkSuperAdmin(userType);

      const rejected = await prisma.company.findMany({
        where: {
          status: "Rejected",
        },
      });

      const rejectedCount = await prisma.company.count({
        where: {
          status: "Rejected",
        },
      });

      return res.status(200).json({
        rejected: rejected,
        count: rejectedCount,
      });
    } catch (error) {
      res.status(500).json({
        msg: "Something went wrong in server. We will fix it soon",
        error: error.msg || error,
      });
    }
  },

  async companyType(req, res) {
    try {
      const userType = req.user.userType;
      checkSuperAdmin(userType);
      const allCompanyData = [];

      const companyLabels = [
        "Technology",
        "Marketing",
        "Sales",
        "Healthcare",
        "Finance",
        "Education",
        "Manufacturing",
        "Retail",
        "Consulting",
        "Real Estate",
        "Hospitality",
        "Non-Profit",
        "Government",
        "Startup",
        "Other",
      ];

      for (const label of companyLabels) {
        const companyData = await prisma.company.findMany({
          where: { companyType: label },
        });

        allCompanyData.push({ companyType: label, companies: companyData });
      }

      return res.status(200).json({
        msg: "All data according to company type",
        companyData: allCompanyData,
      });
    } catch (error) {
      res.status(500).json({
        msg: "Sorry somthing went wrong in server",
        error: error.msg || error,
      });
    }
  },
};
export default superAdmin;
