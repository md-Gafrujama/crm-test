import { sendVerificationMailforRegisteringCompany } from "../../middleware/authenication.middleware.js";

const otpStore = new Map();
const OTP_EXPIRY_TIME = 5 * 60 * 1000;

export const sendOTP = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: "Email is required.",
        });
    }

    try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        otpStore.set(email, { otp, createdAt: Date.now() });

        const response = await sendVerificationMailforRegisteringCompany(email, otp);

        return res.status(response.status).json({
            success: response.success,
            message: response.message,
        });

    } catch (error) {
        console.error("Error sending OTP:", error);
        return res.status(500).json({
            success: false,
            message: "Can't send OTP right now.",
            error: error.message,
        });
    }
};

export const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    console.log(email,otp);
    if (!email || !otp) {
        return res.status(400).json({
            success: false,
            message: "Email and OTP are required.",
        });
    }

    const record = otpStore.get(email);

    if (!record) {
        return res.status(404).json({
            success: false,
            message: "No OTP found for this email.",
        });
    }

    const { otp: storedOtp, createdAt } = record;

    if (Date.now() - createdAt > OTP_EXPIRY_TIME) {
        otpStore.delete(email);
        return res.status(410).json({
            success: false,
            message: "OTP has expired.",
        });
    }

    if (storedOtp !== otp) {
        return res.status(401).json({
            success: false,
            message: "Invalid OTP.",
        });
    }

    otpStore.delete(email);

    return res.status(200).json({
        success: true,
        message: "OTP verified successfully.",
    });
    console.log("correct otp",otp);
};