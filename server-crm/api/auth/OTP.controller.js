import prisma from "../../prisma/prismaClient.js";
import { sendVerificationMail } from "../../middleware/authenication.middleware.js";

const otpAttempts = new Map();

export const sendOTP = async (req, res) => {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({ 
            success: false,
            message: "Email is required." 
        });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found with this email."
            });
        }

        otpAttempts.delete(email);

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 1 * 60 * 1000); 

        await prisma.OTP.create({
            data: {
                email,
                genOTP: otp,
                expiresAt,
                attempts: 0,
            }
        });

        otpAttempts.set(email, {
            attempts: 0,
            currentOTP: otp,
            resendCount: 0
        });

        await sendVerificationMail(email, otp);

        return res.status(200).json({ 
            success: true,
            message: "OTP sent to email successfully." 
        });

    } catch (error) {
        console.error("Error in sendOTP:", error);
        return res.status(500).json({ 
            success: false,
            message: "Failed to send OTP.",
            error: error.message 
        });
    }
};

export const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ 
            success: false,
            message: "Both email and OTP are required." 
        });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        if (user.locked) {
            return res.status(403).json({
                success: false,
                message: "Account is locked. Please contact support."
            });
        }

        const attemptData = otpAttempts.get(email) || {
            attempts: 0,
            currentOTP: null,
            resendCount: 0
        };

        const validOTP = await prisma.OTP.findFirst({
            where: {
                email,
                expiresAt: { gte: new Date() },
                genOTP: otp
            }
        });

        if (validOTP) {
            otpAttempts.delete(email);
            await prisma.OTP.deleteMany({ where: { email } });

            return res.status(200).json({
                success: true,
                message: "OTP verified successfully."
            });
        } else {
            attemptData.attempts += 1;
            otpAttempts.set(email, attemptData);

            if (attemptData.attempts % 2 === 0 && attemptData.resendCount < 2) {
                const newOTP = Math.floor(100000 + Math.random() * 900000).toString();
                
                await prisma.OTP.create({
                    data: {
                        email,
                        genOTP: newOTP,
                        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
                        attempts: attemptData.attempts
                    }
                });

                attemptData.currentOTP = newOTP;
                attemptData.resendCount += 1;
                otpAttempts.set(email, attemptData);

                await sendVerificationMail(email, newOTP);
            }

            const remainingAttempts = 5 - attemptData.attempts;

            if (attemptData.attempts >= 5) {
                await prisma.user.update({
                    where: { email },
                    data: {
                        locked: true,
                        statusOfWork: "lock",
                        lockedAt: new Date()
                    }
                });

                otpAttempts.delete(email);
                await prisma.OTP.deleteMany({ where: { email } });

                return res.status(403).json({
                    success: false,
                    message: "Account locked after 5 failed attempts."
                });
            }

            return res.status(401).json({
                success: false,
                message: `OTP didn't match. ${remainingAttempts} attempts remaining.`,
                attemptsLeft: remainingAttempts,
                newOTPSent: attemptData.attempts % 2 === 0 && attemptData.resendCount < 2
            });
        }

    } catch (error) {
        console.error("Error in verifyOTP:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to verify OTP.",
            error: error.message
        });
    }
};