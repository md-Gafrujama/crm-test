import prisma from "../../prisma/prismaClient.js";
import bcrypt from "bcrypt";

export const updatePassword = async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      message: "Passwords do not match",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await prisma.user.update({
      where: { email: email },
      data: { hashedPassword: hashedPassword },
    });

    return res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({
      message: error.message || "Server error while updating in DB.",
    });
  }
};
