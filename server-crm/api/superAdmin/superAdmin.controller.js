import express from "express";
import prisma from "../../prisma/prismaClient.js";
import bcrypt from "bcrypt";

const superAdmin = {
  //if we keep this system then anyone can become super admin 
  async createSuperAdmin(req, res) {
    try {
      const { firstName, lastName, userName, email, phone, password } =  req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      const existingUser = await prisma.superAdmin.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(409).json({ msg: "User with this email already exists." });
      }

      const newUser = await prisma.superAdmin.create({
        data: {
          firstName,
          lastName,
          userName,
          email,
          phone,
          password: hashedPassword,
        },
      });

      res.status(201).json({
        message: "Super Admin created successfully",
        user: newUser,
      });
    } catch (error) {
      res.status(500).json({
        msg: " Something went wrong.",
        error: error.message || error,
      });
    }
  },

  async getAllData(req, res) {
    try {
      const { uid, userType } = req.user;

      if (userType === "superAdmin") {
        const adminCount = await prisma.user.count({
          where: {
            userType: "admin",
          },
        });

        const employeeCount = await prisma.employee.count();

        const companyCount = await prisma.company.count();

        const leadCount = await prisma.lead.count({
          where: {
            isCurrentVersion: true,
          },
        });

        const alertCount = await prisma.alertsandremainder.count();

        res.status(200).json({
          adminCount,
          employeeCount,
          companyCount,
          leadCount,
          alertCount,
        });
      } else {
        res.status(200).json({
          msg: "Sorry you are not super admin and that's why you cannot get the data.",
        });
      }
    } catch (error) {
      res.status(500).json({
        msg: "Soemthing went wrong. We will fix it soon.",
        error: error,
      });
    }
  },

  async updateCompanyStatus(req, res) {
    const { userType, uid } = req.user;
    const companyId = req.parasms.id;
    const updateCompany = req.body;

    if (userType !== "superAdmin") {
      res.status(200).json({
        msg: "You cannot modify the company's detail as you are not the superAdmin.",
      });
    }

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

    if (userType === "superAdmin") {
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
    } else {
      res.status(200).json({
        msg: "You cannot delete this company as you are not super-admin",
      });
    }
  },
};

export default superAdmin;
