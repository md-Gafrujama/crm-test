import { sendVerificationMailforRegisteringCompany } from "../../middleware/authenication.middleware.js";
import company from "./companies.controller.js";
import prisma from "../../prisma/prismaClient.js";
import bcrypt from "bcrypt";

const otpStore = new Map();
const OTP_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes

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

        if (Date.now() - storedOTP.createdAt > OTP_EXPIRY_TIME) {
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
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists.",
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStore.set(email, { otp, createdAt: Date.now() });

        await sendVerificationMailforRegisteringCompany(email, otp);

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            otpExpiry: OTP_EXPIRY_TIME / 1000 // in seconds
        });
    } catch (error) {
        console.error("Error sending OTP:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to send OTP. Please try again.",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};

export const verifyOTP = async (req, res) => {
  try {
    // 1. Extract data from request
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
    
    const profileImage = req.cloudinaryUrl || ""; // From upload middleware

    // 2. Validate required fields
    const requiredFields = {
      firstName, lastName, username, companyName,
      email, phone, password, agreeToTerms, otp
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
        missingFields
      });
    }

    // 3. Verify OTP
    const isOTPValid = await verifyOTPFunction(email, otp);
    if (!isOTPValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP. Please request a new one."
      });
    }

    // 4. Prepare registration data
    const registrationData = {
      firstName,
      lastName,
      username,
      companyName,
      email,
      phone,
      password,
      agreeToTerms: agreeToTerms === 'true' || agreeToTerms === true,
      profileImage
    };

    // 5. Process registration
    const result = await registerCompany(registrationData);

    // 6. Return success response
    return res.status(201).json({
      success: true,
      message: "Company registration successful",
      data: {
        company: {
          id: result.company.id,
          name: result.company.companyName,
          email: result.company.email,
          profileImage: result.company.profileImage
        },
        user: {
          id: result.user.id,
          username: result.user.username,
          email: result.user.email,
          role: result.user.role,
          profileImage: result.user.photo
        }
      }
    });

  } catch (error) {
    console.error("Registration error:", error);
    
    // Handle specific error cases
    if (error.code === 'P2002') {
      const conflict = error.meta?.target?.includes('email') ? 'email' :
                     error.meta?.target?.includes('username') ? 'username' :
                     'company name';
      return res.status(409).json({
        success: false,
        message: `${conflict} already exists`,
        conflict
      });
    }

    // Generic error response
    return res.status(500).json({
      success: false,
      message: "Registration failed. Please try again.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

// Helper function for company registration
async function registerCompany(data) {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // Create company
  const company = await prisma.company.create({
    data: {
      companyName: data.companyName,
      owners_firstName: data.firstName,
      owners_lastName: data.lastName,
      username: data.username,
      email: data.email,
      phone: data.phone,
      profileImage: data.profileImage,
      hashedPassword,
      agreeToterms: data.agreeToTerms,
      noOfUsers: 1
    }
  });

  // Create admin user
  const user = await prisma.user.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      email: data.email,
      hashedPassword,
      phoneNumber: data.phone,
      role: "admin",
      userType: "admin",
      skills: [],
      photo: data.profileImage,
      companyId: company.id
    }
  });

  return { company, user };
}