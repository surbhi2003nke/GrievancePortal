import { DatabaseService } from "./database";
import { sendEmail } from "./email";
import generateOtp from "./OtpGenerator";
import {
  getCurrentISTTime,
  getTimeDifferenceInMinutes,
  getTimeDifferenceInHours,
} from "../utils/timeUtils";
import {
  OTP_EXPIRY_MINUTES,
  OTP_REQUEST_THRESHOLD_MINUTES,
  OTP_FREEZE_DURATION_HOURS,
  OTP_MAX_ATTEMPTS,
  OTP_EMAIL_SUBJECT,
  OTP_EMAIL_SENDER_NAME,
  OTP_LENGTH,
  OTP_NUMERIC_ONLY,
  OTP_INCLUDE_SYMBOLS,
} from "../constants/otpConstants";

export interface OTPResult {
  success: boolean;
  message: string;
  shouldSendOTP?: boolean;
  attemptCount?: number;
}

/**
 * OTP Service Implementation
 * Handles OTP generation and sending for both Users and Admins
 * User OTP: Has restrictions based on attempt count and timing
 * Admin OTP: No restrictions, simpler logic for admin authentication
 */
export class OTPService {
  // ===== USER OTP METHODS (With Restrictions) =====
  
  /**
   * Handle User OTP request with restrictions (renamed from handleOTPRequest)
   * @param rollNumber - User's roll number
   * @param email - User's email
   * @param userName - User's name for email
   * @returns OTPResult indicating success/failure and next steps
   */
  static async handleUserOTPRequest(
    rollNumber: string,
    email: string,
    userName: string
  ): Promise<OTPResult> {
    try {
      // Find existing OTP record
      const existingOTP = await DatabaseService.findLatestOTP(
        rollNumber,
        email
      );
      const currentTime = getCurrentISTTime();

      // Case 1: No existing OTP (first time trying to verify)
      if (!existingOTP || !existingOTP.createdat) {
        return await this.sendUpdatedOTP(
          rollNumber,
          email,
          userName,
          3,
          currentTime
        );
      }

      const otpCreatedAt = new Date(existingOTP.createdat);
      const timeDifferenceMinutes = getTimeDifferenceInMinutes(
        otpCreatedAt,
        currentTime
      );
      const timeDifferenceHours = getTimeDifferenceInHours(
        otpCreatedAt,
        currentTime
      );
      const currentAttempt = existingOTP.attempt || 0;

      // Case 2: attempt == 0 (frozen state)
      if (currentAttempt === 0) {        // Check if 1 hour has passed since freeze
        if (timeDifferenceHours >= OTP_FREEZE_DURATION_HOURS) {
          // Reset attempts and send OTP
          return await this.sendUpdatedOTP(
            rollNumber,
            email,
            userName,
            3,
            currentTime
          );
        } else {
          // Still frozen
          return {
            success: false,
            message: "Too many attempts. Please try after some time.",
          };
        }
      }

      // Case 3: Less than 5 minutes since last OTP
      if (timeDifferenceMinutes < OTP_REQUEST_THRESHOLD_MINUTES) {
        // Decrease attempt count and send new OTP
        return await this.sendUpdatedOTP(
          rollNumber,
          email,
          userName,
          currentAttempt,
          currentTime
        );
      }

      // Case 4: 5 minutes or more have passed
      if (timeDifferenceMinutes >= OTP_REQUEST_THRESHOLD_MINUTES) {
        // Reset attempts to 3 and send new OTP
        return await this.sendUpdatedOTP(
          rollNumber,
          email,
          userName,
          3,
          currentTime
        );
      }

      // Fallback case
      return {
        success: false,
        message: "Unable to process OTP request. Please try again.",
      };
    } catch (error) {
      console.error("Error in OTP handling:", error);
      return {
        success: false,
        message: "Internal server error while processing OTP request",
      };
    }
  }
  /**
   * Send a new OTP (create new record or update existing)
   */
  private static async sendUpdatedOTP(
    rollNumber: string,
    email: string,
    userName: string,
    attemptCount: number,
    currentTime: Date
  ): Promise<OTPResult> {
    try {
      const otp = parseInt(generateOtp(6, true, false));

      // Create or update OTP record (preserves time records)
      await DatabaseService.createOrUpdateOTP({
        rollno: rollNumber,
        otp,
        createdat: currentTime,
        email: email,
        attempt: attemptCount-1,
      });      // Send email
      await sendEmail(
        userName,
        email,
        OTP_EMAIL_SUBJECT,
        `Hello ${userName},\n\nYour OTP for email verification is: ${otp}\n\nThis OTP will expire in ${OTP_EXPIRY_MINUTES} minutes.\nRemaining attempts: ${
          attemptCount - 1
        }\n\nIf you did not request this, please ignore this email.\n\nThanks,\n${OTP_EMAIL_SENDER_NAME}`
      );

      return {
        success: true,
        message: `OTP sent to your registered email address. Remaining attempts: ${
          attemptCount - 1
        }`,
        shouldSendOTP: true,
      };
    } catch (error) {
      console.error("Error sending new OTP:", error);
      throw error;
    }
  }  /**
   * Resend User OTP with same attempt count (renamed from resendOtp)
   * @param rollNumber - User's roll number
   * @param email - User's email
   * @param userName - User's name for email
   * @returns OTPResult indicating success/failure
   */
  static async resendUserOtp(
    rollNumber: string,
    email: string,
    userName: string
  ): Promise<OTPResult> {
    try {
      // Find existing OTP record
      const existingOTP = await DatabaseService.findLatestOTP(
        rollNumber,
        email
      );

      if (!existingOTP) {
        return {
          success: false,
          message: "No OTP found. Please request a new OTP first.",
        };
      }

      const currentTime = getCurrentISTTime();
      const currentAttempt = existingOTP.attempt || 0;

      // Generate new OTP and send email with same attempt count
      const otp = parseInt(generateOtp(OTP_LENGTH, OTP_NUMERIC_ONLY, OTP_INCLUDE_SYMBOLS));

      // Update OTP record with new OTP but keep same attempt count
      await DatabaseService.createOrUpdateOTP({
        rollno: rollNumber,
        otp,
        createdat: currentTime,
        email: email,
        attempt: currentAttempt, // Keep the same attempt count
      });

      // Send email
      await sendEmail(
        userName,
        email,
        OTP_EMAIL_SUBJECT,
        `Hello ${userName},\n\nYour OTP for email verification is: ${otp}\n\nThis OTP will expire in ${OTP_EXPIRY_MINUTES} minutes.\nRemaining attempts: ${currentAttempt}\n\nIf you did not request this, please ignore this email.\n\nThanks,\n${OTP_EMAIL_SENDER_NAME}`
      );      return {
        success: true,
        message: `OTP resent to your registered email address. Remaining attempts: ${currentAttempt}`,
      };
    } catch (error) {
      console.error("Error resending OTP:", error);
      return {
        success: false,
        message: "Internal server error while resending OTP",
      };
    }
  }












  // ===== ADMIN OTP METHODS (No Restrictions) =====

  /**
   * Handle Admin OTP request - simple logic with no restrictions
   * @param adminId - Admin's ID
   * @param email - Admin's email
   * @param adminName - Admin's name for email
   * @returns OTPResult indicating success/failure
   */  static async handleAdminOTPRequest(
    adminId: string,
    email: string,
    adminName: string
  ): Promise<OTPResult> {
    try {
      const currentTime = getCurrentISTTime();
      const otp = parseInt(generateOtp(OTP_LENGTH, OTP_NUMERIC_ONLY, OTP_INCLUDE_SYMBOLS));
      
      // Check if existing admin OTP record exists
      const existingOTP = await DatabaseService.findLatestAdminOTP(adminId, email);
      
      if (existingOTP) {
        // Update existing record instead of creating new one
        await DatabaseService.updateAdminOTPAttempt(
          adminId, 
          email, 
          OTP_MAX_ATTEMPTS, 
          currentTime, 
          otp
        );
      } else {
        // Create new admin OTP only if none exists
        await DatabaseService.createAdminOTP({
          adminid: adminId,
          otp,
          email,
          attempt: OTP_MAX_ATTEMPTS,
          createdat: currentTime
        });
      }

      // Send email
      await sendEmail(
        adminName,
        email,
        OTP_EMAIL_SUBJECT,
        `Hello ${adminName},\n\nYour OTP for admin login is: ${otp}\n\nThis OTP will expire in ${OTP_EXPIRY_MINUTES} minutes.\n\nIf you did not request this, please ignore this email.\n\nThanks,\n${OTP_EMAIL_SENDER_NAME}`
      );

      return {
        success: true,
        message: `OTP sent to your registered email address.`,
        shouldSendOTP: true,
        attemptCount: OTP_MAX_ATTEMPTS
      };
    } catch (error) {
      console.error("Error sending admin OTP:", error);
      return {
        success: false,
        message: "Internal server error while sending admin OTP",
      };
    }
  }

  /**
   * Resend Admin OTP - simple resend with no restrictions
   * @param adminId - Admin's ID
   * @param email - Admin's email
   * @param adminName - Admin's name for email
   * @returns OTPResult indicating success/failure
   */  static async resendAdminOtp(
    adminId: string,
    email: string,
    adminName: string
  ): Promise<OTPResult> {
    try {
      const currentTime = getCurrentISTTime();
      const otp = parseInt(generateOtp(OTP_LENGTH, OTP_NUMERIC_ONLY, OTP_INCLUDE_SYMBOLS));
      
      // Check if existing admin OTP record exists
      const existingOTP = await DatabaseService.findLatestAdminOTP(adminId, email);
      
      if (existingOTP) {
        // Update existing record instead of creating new one
        await DatabaseService.updateAdminOTPAttempt(
          adminId, 
          email, 
          OTP_MAX_ATTEMPTS, 
          currentTime, 
          otp
        );
      } else {
        // Create new admin OTP only if none exists
        await DatabaseService.createAdminOTP({
          adminid: adminId,
          otp,
          email,
          attempt: OTP_MAX_ATTEMPTS,
          createdat: currentTime
        });
      }

      // Send email
      await sendEmail(
        adminName,
        email,
        OTP_EMAIL_SUBJECT,
        `Hello ${adminName},\n\nYour OTP for admin login is: ${otp}\n\nThis OTP will expire in ${OTP_EXPIRY_MINUTES} minutes.\n\nIf you did not request this, please ignore this email.\n\nThanks,\n${OTP_EMAIL_SENDER_NAME}`
      );

      return {
        success: true,
        message: `OTP resent to your registered email address.`,
        shouldSendOTP: true,
        attemptCount: OTP_MAX_ATTEMPTS
      };
    } catch (error) {
      console.error("Error resending admin OTP:", error);
      return {
        success: false,
        message: "Internal server error while resending admin OTP",
      };
    }
  }
}
