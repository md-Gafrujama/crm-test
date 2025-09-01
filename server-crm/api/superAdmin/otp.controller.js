import prisma from '../../prisma/prismaClient.js';
import {sendVerificationMailforRegisteringCompany} from "../../middleware/authenication.middleware.js"
import jwt from "jsonwebtoken";

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const otpAttempts = new Map();


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

    if (user.password !== password) {
      return res.status(200).json({ msg: 'Sorry, wrong password.' });
    }

    otpAttempts.delete(email);

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); 

    await prisma.OTP.create({
      data: {
        email,
        genOTP: otp,
        expiresAt,
        attempts: 0,
      },
    });

    otpAttempts.set(email, {
      attempts: 0,
      currentOTP: otp,
      resendCount: 0,
      expiresAt,
    });

    await sendVerificationMailforRegisteringCompany(email, otp);
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
    const user = await prisma.superAdmin.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'SuperAdmin user not found.' });
    }

    const attemptData = otpAttempts.get(email);

    if (!attemptData || !attemptData.currentOTP) {
      return res.status(404).json({ message: 'No OTP request found for this email.' });
    }

    if (attemptData.expiresAt < new Date()) {
      otpAttempts.delete(email);
      return res.status(410).json({ message: 'OTP expired.' });
    }

    if (attemptData.currentOTP !== otp) {
      attemptData.attempts += 1;
      const remainingAttempts = 5 - attemptData.attempts;

      if (attemptData.attempts % 2 === 0 && attemptData.resendCount < 2) {
        const newOtp = generateOtp();
        const newExpiry = new Date(Date.now() + 5 * 60 * 1000);

        await prisma.OTP.create({
          data: {
            email,
            genOTP: newOtp,
            expiresAt: newExpiry,
            attempts: attemptData.attempts,
          },
        });

        attemptData.currentOTP = newOtp;
        attemptData.resendCount += 1;
        attemptData.expiresAt = newExpiry;

        await sendVerificationMailforRegisteringCompany(email, newOtp);
      }

      if (attemptData.attempts >= 5) {
        await prisma.superAdmin.update({
          where: { email },
          data: {
            statusOfAccount: 'locked',
            lockedAt: new Date(),
          },
        });

        otpAttempts.delete(email);
        await prisma.OTP.deleteMany({ where: { email } });

        return res.status(403).json({ message: 'Account locked after 5 failed attempts.' });
      }

      otpAttempts.set(email, attemptData);

      return res.status(401).json({
        message: `Invalid OTP. ${remainingAttempts} attempts remaining.`,
        newOTPSent: attemptData.attempts % 2 === 0 && attemptData.resendCount < 2,
      });
    }

    otpAttempts.delete(email);
    await prisma.OTP.deleteMany({ where: { email } });

    const token = jwt.sign(
      { uid: user.id, role: 'superAdmin',username:user.username,email:user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      message: 'OTP verified successfully.',
      token,
      user: {
        uid: user.id,
        email: user.email,
        username: user.username,
        role: 'superAdmin',
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
};
