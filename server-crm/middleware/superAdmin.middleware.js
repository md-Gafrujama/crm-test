import jwt from "jsonwebtoken";
import prisma from "../prisma/prismaClient.js";

 const superAdminAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Missing or invalid authorization header" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.uid || !decoded.role) {
      return res
        .status(400)
        .json({ message: "Token payload missing uid or role" });
    }

    if (decoded.role !== "superAdmin") {
      return res
        .status(403)
        .json({ message: "Access denied: not a superAdmin" });
    }

    const superAdmin = await prisma.superAdmin.findUnique({
      where: { id: decoded.uid },
      select: { id: true, email: true, username: true },
    });

    if (!superAdmin) {
      return res.status(404).json({ message: "SuperAdmin not found" });
    }

    req.user = {
      uid: superAdmin.id,
      email: superAdmin.email,
      username: superAdmin.username,
      userType: decoded.role,
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Logged out sucessfully" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(400).json({ message: "Invalid token" });
    }
    res.status(500).json({ message: "Authentication failed" });
  }
};

export default  superAdminAuthMiddleware;