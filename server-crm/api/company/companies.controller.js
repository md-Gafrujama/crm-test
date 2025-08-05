import prisma from "../../prisma/prismaClient.js";
import bcrypt from "bcrypt";

const company = {
  async fillCompany(req, res) {
    try {
      const {
        firstName,
        lastName,
        username,
        companyName,
        email,
        phone,
        password,
        agreeToterms,
      } = req.body;

      console.log(firstName,lastName,username, companyName, email, phone,password, agreeToterms);

      if (!firstName||!lastName||!username || !companyName || !email || !phone || !password || !agreeToterms) {
        return res.status(400).json({
          message: "All required fields must be provided.",
        });
      }

      const agreeToTermsBool = agreeToterms === true || agreeToterms === "true";

      const existingCompany = await prisma.company.findFirst({
        where: {
          OR: [{ companyName }, { email }],
        },
      });

      if (existingCompany) {
        return res.status(409).json({
          message: "A company with this name or email already exists.",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const createdCompany = await prisma.company.create({
        data: {
          companyName,
          owners_firstName : firstName,
          owners_lastName : lastName,  
          username,
          email,
          phone,
          hashedPassword,
          agreeToterms: agreeToTermsBool,
          noOfUsers: 1, 
        },
      });

      const createdUser = await prisma.user.create({
        data: {
          firstName,
          lastName,
          username,
          email,
          hashedPassword,
          phoneNumber: phone,
          role: "admin",
          userType: "admin",
          skills: [],
          photo: null,
          companyId: createdCompany.id,
        },
      });

      return res.status(201).json({
        message: "Company and admin user created successfully",
        user: {
          id: createdUser.id,
          username: createdUser.username,
          email: createdUser.email,
          role: createdUser.role,
        },
        company: {
          id: createdCompany.id,
          companyName: createdCompany.companyName,
          email: createdCompany.email,
        },
      });

    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({
        message: "Something went wrong on the server. Please try again.",
      });
    }
  }
};

export default company;
