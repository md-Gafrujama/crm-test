import prisma from "../../prisma/prismaClient.js";
import bcrypt from "bcrypt";
import { uploadToCloudinary } from "../../utilis/fileUpload.js";

const User = {
  async addUser(req, res) {
    try {
      const companyId = req.user.companyId;
      const userType = req.user.userType;

      if (userType !== "admin") {
        return res.status(403).json({
          message: "Forbidden: Only admins can create users",
        });
      }

      const { firstName, lastName, username, email, password, phone, role } =
        req.body;

      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ username }, { email }],
        },
      });

      if (existingUser) {
        return res.status(409).json({
          message: "User already exists",
          conflict:
            existingUser.username === username
              ? "username"
              : existingUser.email === email
              ? "email"
              : "phone",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      let photoUrl = req.cloudinaryUrl || null;

      const userData = {
        firstName,
        lastName,
        username,
        email,
        hashedPassword: hashedPassword,
        phoneNumber: phone,
        role,
        photo: photoUrl || null,
        companyId: companyId,
      };

      const user = await prisma.user.create({
        data: userData,
      });

      return res.status(201).json({
        message: "User created successfully",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          photo: user.photo,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      console.error("Signup error:", error);
      return res.status(500).json({
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }
};

export default User;