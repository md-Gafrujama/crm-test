import prisma from '../../prisma/prismaClient.js';
import {sendVerificationMailforRegisteringCompany} from "../../middleware/authenication.middleware.js"
import jwt from "jsonwebtoken";

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

export const sendOtp = async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ message: 'Email, username, and password are required.' });
  }

  try {
    const user = await prisma.superAdmin.findUnique({ where: { email } });

    if (!user || user.username !== username) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    if(user.password !== password){
      return res.status(200).json({
        msg : " sorry wrong password",
      })
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); 

    await prisma.OTP.upsert({
      where: { email },
      update: {
        genOTP: otp,
        attempts: 0,
        statusOfAccount: 'pending',
        expiresAt,
      },
      create: {
        email,
        genOTP: otp,
        givenOTP: [],
        attempts: 0,
        statusOfAccount: 'pending',
        expiresAt,
      },
    });

    sendVerificationMailforRegisteringCompany(email,otp);
    console.log(`OTP for ${email}: ${otp}`);

    return res.status(200).json({ message: 'OTP sent to your email.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required.' });
  }

  try {
    const otpEntry = await prisma.OTP.findUnique({ where: { email } });

    if (!otpEntry) {
      return res.status(404).json({ message: 'No OTP request found for this email.' });
    }

    if (otpEntry.expiresAt < new Date()) {
      return res.status(410).json({ message: 'OTP expired.' });
    }

    if (otpEntry.genOTP !== otp) {
      await prisma.OTP.update({
        where: { email },
        data: {
          attempts: otpEntry.attempts + 1,
          givenOTP: [...otpEntry.givenOTP, otp],
        },
      });
      return res.status(400).json({ message: 'Invalid OTP.' });
    }

    await prisma.OTP.update({
      where: { email },
      data: { statusOfAccount: 'verified' },
    });

    const superAdmin = await prisma.superAdmin.findUnique({
      where: { email },
      select: { id: true, email: true, username: true },
    });

    if (!superAdmin) {
      return res.status(404).json({ message: 'SuperAdmin user not found.' });
    }

    const token = jwt.sign(
      { uid: superAdmin.id, role: "superAdmin" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } 
    );

    return res.status(200).json({
      message: 'OTP verified successfully.',
      token,
      user: {
        uid: superAdmin.id,
        email: superAdmin.email,
        username: superAdmin.username,
        role: "superAdmin",
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
};
