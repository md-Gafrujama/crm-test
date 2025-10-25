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
        companyType,
        email,
        phone,
        password,
        agreeToTerms,
      } = req.body;

      // uncomment the section if data is not verififed in frontend only
      // const requiredFields = {
      //   firstName: "First name",
      //   lastName: "Last name",
      //   username: "Username",
      //   companyName: "Company name",
      //   compAnyType :"Company TYpe",
      //   email: "Email",
      //   phone: "Phone",
      //   password: "Password",
      //   agreeToTerms: "Terms agreement"
      // };

      // const missingFields = Object.entries(requiredFields)
      //   .filter(([key]) => !req.body[key])
      //   .map(([_, value]) => value);

      // if (missingFields.length > 0) {
      //   return res.status(400).json({
      //     success: false,
      //     message: `Missing required fields: ${missingFields.join(', ')}`
      //   });
      // }

      const existingCompany = await prisma.company.findFirst({
        where: {
          OR: [
            { companyName },
            { email },
            { username },
          ]
        }
      });

      if (existingCompany) {
        return res.status(409).json({
          success: false,
          message: "Company with these details already exists",
          conflict: existingCompany.companyName === companyName 
            ? "companyName" 
            : existingCompany.email === email 
              ? "email" 
              : "username"
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const createdCompany = await prisma.company.create({
        data: {
          companyName,
          companyType,
          owners_firstName: firstName,
          owners_lastName: lastName,
          username,
          email,
          phone,
          profileImage: req.cloudinaryUrl || "", 
          hashedPassword,
          agreeToterms: agreeToTerms === true || agreeToTerms === "true",
          noOfUsers: 1
        }
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
          photo: req.cloudinaryUrl || "", 
          companyId: createdCompany.id
        }
      });

      return res.status(201).json({
      success: true,
      message: "Company and admin user created successfully",
      data: {
        company: {
          id: createdCompany.id,
          companyName: createdCompany.companyName,
          email: createdCompany.email,
          profileImage: createdCompany.profileImage
        },
        user: {
          id: createdUser.id,
          username: createdUser.username,
          email: createdUser.email,
          role: createdUser.role,
          photo: createdUser.photo
        }
      }
    });

    } catch (error) {
      console.error("Company registration error:", error);
      
      if (error.code === 'P2002') {
        return res.status(409).json({
          success: false,
          message: "Database conflict: Unique constraint violation"
        });
      }

      return res.status(500).json({
        success: false,
        message: "Internal server error during registration",
        error: process.env.NODE_ENV === "development" ? error.message : undefined
      });
    }
  },

  async getDetail(req, res) {
    try {
      const companyId = req.user.companyId;
      const userType = req.user.userType;

      if (userType !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Unauthorized: Only admins can access company details"
        });
      }

      const companyDetail = await prisma.company.findUnique({
        where: { id: companyId },
        select: {
          id: true,
          companyName: true,
          profileImage: true,
          email: true,
          phone: true,
        }
      });

      if (!companyDetail) {
        return res.status(404).json({
          success: false,
          message: "Company not found"
        });
      }

      return res.status(200).json({
        success: true,
        data: companyDetail
      });

    } catch (error) {
      console.error("Error fetching company details:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch company details"
      });
    }
  },

  async updateCompany(req,res){
      try {
    const id  = req.user.companyId; 
    const {
      gaPropertyId,
      gaAccessToken,
      gaRefreshToken,
      gaTokenExpiry,
      keyFile
    } = req.body;

    const updatedCompany = await prisma.company.update({
      where: { id },
      data: {
        gaPropertyId,
        gaAccessToken,
        gaRefreshToken,
        gaTokenExpiry: gaTokenExpiry ? new Date(gaTokenExpiry) : null,
       keyFile:  typeof keyFile === "string"    ? JSON.parse(keyFile)    : keyFile,
      },
    });

    res.status(200).json({
      message: "Company updated successfully",
      company: updatedCompany,
    });
  } 
    catch(error){
      console.error("Error updating company details:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to update company details"
      });
    }
  }
};

export default company;