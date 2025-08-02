import prisma from "../../prisma/prismaClient.js";

const userProfile = {
  async getUser(req, res) {
    try {
      const userId = req.params.id;
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  },

  async updateUser(req, res) {
    try {
      const userId = req.params.id;
      const dataToUpdate = req.body;

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: dataToUpdate,
      });

      res.status(200).json(updatedUser);
    } catch (error) {
      if (error.code === 'P2025') {
        return res.status(404).json({ message: "User not found." });
      }
      res.status(500).json({ message: "Update failed", error: error.message });
    }
  },

  async deleteUser(req, res) {
    try {
      const userId = req.params.id;

      await prisma.user.delete({
        where: { id: userId },
      });

      res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
      if (error.code === 'P2025') {
        return res.status(404).json({ message: "User not found." });
      }
      res.status(500).json({ message: "Delete failed", error: error.message });
    }
  },
};

export default userProfile;
