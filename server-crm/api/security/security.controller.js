import prisma from "../../prisma/prismaClient.js";

export const lockAccount = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    await prisma.user.update({
      where: { id },
      data: { locked: true },
    });

    return res.status(200).json({ message: "Account locked by admin." });
  } catch (error) {
    return res.status(500).json({ message: "Lock failed.", error: error.message });
  }
};

export const unlockAccount = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    await prisma.user.update({
      where: { id },
      data: { locked: false },
    });

    return res.status(200).json({ message: "Account unlocked by admin." });
  } catch (error) {
    return res.status(500).json({ message: "Unlock failed.", error: error.message });
  }
};

export const getLockedAccounts = async (req, res) => {
  try {
    const lockedUsers = await prisma.user.findMany({
      where: { locked: true },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        statusOfWork: true,
        locked: true,
      },
    });

    return res.status(200).json({ lockedAccounts: lockedUsers });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch locked accounts.", error: error.message });
  }
};
