import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "../../prisma/prismaClient.js";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const NODE_ENV = process.env.NODE_ENV;
const JWT_OPTIONS = { expiresIn: "1h" };

const validateInput = (email, username, password) => {
  return (email || username) && password;
};

const getUserByCredentials = async (email, username) => {
  return await prisma.user.findFirst({
    where: {
      OR: [
        email ? { email } : undefined,
        username ? { username } : undefined
      ].filter(Boolean)
    },
    select: {
      id: true,
      username: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      hashedPassword: true,
      locked:true
    }
  });
};

export const loginUser = async (req, res) => {
  const { email, username, password } = req.body;

  if (!validateInput(email, username, password)) {
    return res.status(400).json({
      message: "Email/username and password are required"
    });
  }

  try {
    const user = await getUserByCredentials(email, username);

    if (!user) {
      return res.status(404).json({ message: "No such user exists" });
    }

    if (user.locked) {
      return res.status(403).json({
        message: "You are locked. Please contact admin to unlock your account."
      });
    }

    const validPassword = await bcrypt.compare(password, user.hashedPassword);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        uid: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      JWT_OPTIONS
    );

    const { hashedPassword, ...userResponse } = user;

    return res.status(200).json({
      message: "Login successful",
      user: userResponse,
      token,
      userType: user.role
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: NODE_ENV === "development" ? error.message : undefined
    });
  }
};