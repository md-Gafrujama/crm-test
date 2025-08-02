import prisma from '../../prisma/prismaClient.js';

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const { email, phoneNumber, about, skills } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        email,
        phoneNumber,
        about,
        skills,
      },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({ message: 'Failed to update user profile' });
  }
};
