import { Request, Response, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { sendEmail } from "../services/email";
import generateOtp from "../services/OtpGenerator";
import { DatabaseService } from "../services/database";
import { OTPService } from "../services/otpService";
import {
  getCurrentISTTime,
  getTimeDifferenceInMinutes,
} from "../utils/timeUtils";
import { OTP_EXPIRY_MINUTES } from "../constants/otpConstants";

// Check if roll number exists
const rollNumberExist: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { rollNumber } = req.params;

    const user = await DatabaseService.findUserByRollNumber(rollNumber);
    console.log(user);
    if (user) {
      // Create partial email

      if (!user.email) {
        res
          .status(400)
          .json({ message: "Email not found, Contact your campus incharge" });
        return;
      }

      const email = user.email;
      const [local, domain] = email.split("@");
      let partialEmail = email;

      if (local.length > 6) {
        partialEmail =
          local.substring(0, 2) +
          "*".repeat(local.length - 4) +
          local.substring(local.length - 2) +
          "@" +
          domain;
      }

      const isVerified = user.isverified;

      const data = {
        rollNumber: user.rollno,
        email: partialEmail,
        isVerified,
      };

      res.status(200).json(data);
    } else {
      res.status(400).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error checking roll number:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error while checking roll number",
    });
  }
};

// Verify partial email and send OTP
const verifyPartialEmail: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { rollNumber, email } = req.params;

    const user = await DatabaseService.findUserByRollNumber(rollNumber);

    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    if (email !== user.email) {
      res.status(400).json({
        message: "Email does not match our records",
        verified: false,
      });
      return;
    }    // Use the new OTP service to handle OTP logic
    const otpResult = await OTPService.handleUserOTPRequest(
      rollNumber,
      user.email,
      user.name
    );
    if (otpResult.success) {
      res.status(200).json({
        verified: true,
        message: otpResult.message,
      });
    } else {
      res.status(400).json({
        verified: false,
        message: otpResult.message,
      });
    }
  } catch (error) {
    console.error("Error verifying partial email:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error while verifying email",
    });
  }
};

// Verify OTP
const verifyOtp: RequestHandler = async (req :Request, res: Response) => {
  try {
    const { otp, rollNumber } = req.body;

    if (!rollNumber || !otp) {
      res.status(400).json({
        success: false,
        message: "rollNumber and otp are required",
      });
      return;
    }

    const user = await DatabaseService.findUserByRollNumber(rollNumber);

    if (!user) {
      res.status(400).json({
        success: false,
        message: "User not found",
      });
      return;
    }
    const storedOTP = await DatabaseService.findLatestOTP(
      rollNumber,
      user.email
    );

    if (!storedOTP) {
      res.status(400).json({
        success: false,
        message: "OTP not found. Please request a new one.",
      });
      return;
    }

    // Check if OTP is null (expired)
    if (storedOTP.otp === null) {
      res.status(400).json({
        success: false,
        message: "OTP expired. Please request a new one.",
      });
      return;
    } // Check if OTP is expired using IST time
    const currentTime = getCurrentISTTime();
    const otpCreatedAt = new Date(storedOTP.createdat!);
    const timeDifferenceMinutes = getTimeDifferenceInMinutes(
      otpCreatedAt,
      currentTime
    );

    if (timeDifferenceMinutes > OTP_EXPIRY_MINUTES) {
      await DatabaseService.expireOTP(rollNumber, user.email);
      res.status(400).json({
        success: false,
        message: "OTP expired. Please request a new one.",
      });
      return;
    }

    if (storedOTP.otp !== parseInt(otp)) {
      res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
      return;
    }

    // OTP is valid, expire it (set to null)
    await DatabaseService.expireOTP(rollNumber, user.email);

    res.status(200).json({
      success: true,
      message: "OTP verified successfully.",
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Set password
const setPassword: RequestHandler = async (req :Request, res: Response) => {
  try {
    const { rollNumber, password } = req.body;

    if (!rollNumber || !password) {
      res.status(400).json({
        success: false,
        message: "rollNumber and password are required",
      });
      return;
    }

    const user = await DatabaseService.findUserByRollNumber(rollNumber);

    if (!user) {
      res.status(400).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user with new password and set as verified
    await DatabaseService.updateUser(rollNumber, {
      password: hashedPassword,
      isverified: true,
    });

    res.status(200).json({
      success: true,
      message: "Password set successfully",
    });
  } catch (error) {
    console.error("Set password error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Login
const login: RequestHandler = async (req :Request, res :Response) => {
  try {
    const { rollNumber, password } = req.body;

    if (!rollNumber || !password) {
      res.status(400).json({
        success: false,
        message: "rollNumber and password are required",
      });
      return;
    }

    const user = await DatabaseService.findUserByRollNumber(rollNumber);

    if (!user || !user.password) {
      res.status(401).json({
        success: false,
        message: "Invalid rollNumber or password",
      });
      return;
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: "Invalid rollNumber or password",
      });
      return;
    }

    // Create JWT
    const token = jwt.sign(
      {
        rollNumber: user.rollno,
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET || "supersecretkey",
      { expiresIn: "24h" }
    );

    const options = {
      httpOnly: false, // can be accessed by frontend too
      secure: false, // Set to true only in production (for HTTPS)
      sameSite: "none" as const, // Allows cross-origin cookie transmission (important for cross-origin requests)
    };

    res
      .status(200)
      .cookie("jwtToken", token, options) // Set JWT in cookie
      .json({
        success: true,
        token,
        user: {
          rollNumber: user.rollno,
          name: user.name,
          email: user.email,
        },
      });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Resend OTP with same attempt count
const resendOtp: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { rollNumber } = req.body;

    if (!rollNumber) {
      res.status(400).json({
        success: false,
        message: "rollNumber is required",
      });
      return;
    }

    const user = await DatabaseService.findUserByRollNumber(rollNumber);

    if (!user) {
      res.status(400).json({
        success: false,
        message: "User not found",
      });
      return;
    }    // Use OTPService to handle resend logic
    const otpResult = await OTPService.resendUserOtp(
      rollNumber,
      user.email,
      user.name
    );

    if (otpResult.success) {
      res.status(200).json({
        success: true,
        message: otpResult.message,
      });
    } else {
      res.status(400).json({
        success: false,
        message: otpResult.message,
      });
    }
  } catch (error) {
    console.error("Error resending OTP:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while resending OTP",
    });
  }
};

export {
  rollNumberExist,
  verifyPartialEmail,
  login,
  setPassword,
  verifyOtp,
  resendOtp,
};
