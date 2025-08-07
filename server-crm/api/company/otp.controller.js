import { sendVerificationMailforRegisteringCompany } from "../../middleware/authenication.middleware.js";
import company from "./companies.controller.js";
import prisma from "../../prisma/prismaClient.js";

const otpStore = new Map();
const OTP_EXPIRY_TIME = 5 * 60 * 1000; 

const verifyOTPFunction = async (email, otp) => {
    try {
        const storedOTP = otpStore.get(email);

        if (!storedOTP) {
            console.log(`No OTP found for email: ${email}`);
            return false;
        }

        if (storedOTP.otp !== otp) {
            console.log(`OTP mismatch for email: ${email}`);
            return false;
        }

        const currentTime = Date.now();
        if (currentTime - storedOTP.createdAt > OTP_EXPIRY_TIME) {
            console.log(`OTP expired for email: ${email}`);
            otpStore.delete(email);
            return false;
        }

        otpStore.delete(email);
        return true;

    } catch (error) {
        console.error("Error verifying OTP:", error);
        return false;
    }
};

export const sendOTP = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: "Email is required.",
        });
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists.",
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStore.set(email, {
            otp,
            createdAt: Date.now(),
            attempts: 0 
        });

        const response = await sendVerificationMailforRegisteringCompany(email, otp);

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            otpExpiry: OTP_EXPIRY_TIME / 1000 
        });

    } catch (error) {
        console.error("Error sending OTP:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to send OTP. Please try again.",
            error: error.message,
        });
    }
};

export const verifyOTP = async (req, res) => {
  try {
    const {
      firstName, 
      lastName, 
      username, 
      companyName, 
      email, 
      phone, 
      password, 
      agreeToTerms, 
      otp
    } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ 
        success: false, 
        message: "Email and OTP are required." 
      });
    }

    const isOTPValid = await verifyOTPFunction(email, otp);
    if (!isOTPValid) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid or expired OTP. Please request a new one." 
      });
    }

    const companyReq = {
      body: {
        firstName, 
        lastName, 
        username, 
        companyName, 
        email, 
        phone, 
        password, 
        agreeToTerms
      }
    };

    const companyRes = {
      status: (code) => ({
        json: (data) => {
          return res.status(code).json({
            success: true,
            message: "Company registration successful",
            company: {
              id: data.company.id,
              name: data.company.companyName,
              email: data.company.email
            },
            user: {
              id: data.user.id,
              username: data.user.username,
              email: data.user.email,
              role: data.user.role
            }
          });
        }
      })
    };

    await company.fillCompany(companyReq, companyRes);
    
  } catch (error) {
    console.error("OTP verification error:", error);
    
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: "User or company with these details already exists."
      });
    }

    return res.status(500).json({
      success: false,
      message: "Registration failed. Please try again.",
      error: error.message
    });
  }
};