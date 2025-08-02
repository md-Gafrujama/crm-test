import prisma from "../../prisma/prismaClient.js";
import bcrypt from "bcrypt";


function getPlanDetails(plan) {
  const trialDays = 14; 

  switch (plan) {
    case "Basic":
      return {
        planName: "Basic",
        price: "$0.00",
        users: 2,
        trialDays,
        remainingDays: trialDays,
      };
    case "Silver":
      return {
        planName: "Silver",
        price: "¥1000.00",
        users: 2,
        trialDays,
        remainingDays: trialDays,
      };
    case "Gold":
      return {
        planName: "Gold",
        price: "¥1500.00",
        users: 3,
        trialDays,
        remainingDays: trialDays,
      };
    case "Platinum":
      return {
        planName: "Platinum",
        price: "¥2000.00",
        users: 4,
        trialDays,
        remainingDays: trialDays,
      };
    case "Diamond":
      return {
        planName: "Diamond",
        price: "¥2500.00",
        users: 6,
        trialDays,
        remainingDays: trialDays,
      };
    case "Diamond Pro":
      return {
        planName: "Diamond Pro",
        price: "¥3950.00",
        users: 6,
        trialDays,
        remainingDays: trialDays,
      };
    default:
      return null; 
  }
}



const company = {
  async fillCompany(req, res) {
    try {
      const {
        firstName,
        lastName,
        email,
        phone,
        password,
        companyName,
        gstNumber,
        plan,
        agreeToterms,
        timezone,
        couponCode,
      } = req.body;

      if (!companyName || !email || !password || !gstNumber || !firstName || !lastName || !phone || !timezone) {
        return res.status(400).json({ message: "All required fields must be provided." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const altTimeZone = timezone.altName;
      const agreeToTermsBool = agreeToterms === "true";

      const existingCompany = await prisma.company.findFirst({
        where: {
          OR: [{ companyName }, { GSTNumber: gstNumber }, { email }],
        },
      });

      if (existingCompany) {
        return res.status(409).json({
          message: "A company with this name, GST number, or email already exists.",
        });
      }

      const planDetails = getPlanDetails(plan);
      if (!planDetails) {
        return res.status(400).json({ message: "Invalid plan selected" });
      }

      const companyData = {
        companyName,
        GSTNumber: gstNumber,
        firstName,
        lastName,
        email,
        hashedPassword,
        phone,
        timeZone: altTimeZone,
        couponCode: couponCode || "0",
        agreeToterms: agreeToTermsBool,
        plan: JSON.stringify(planDetails),
        remainingDays: planDetails.remainingDays,
        paidStatus: false,
        role: "admin",
      };

      const createdCompany = await prisma.company.create({ data: companyData });

      await prisma.user.create({
        data: {
          firstName,
          lastName,
          username: companyName,
          email,
          hashedPassword,
          phoneNumber: phone,
          role: "admin",
          photo: null,
        },
      });

      return res.status(201).json({
        message: "User created successfully",
        user: {
          id: createdCompany.id,
          companyName: createdCompany.companyName,
          email: createdCompany.email,
          createdAt: createdCompany.createdAt,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({
        message: "Something went wrong on the server. Please try again.",
      });
    }
  },
};

export default company;