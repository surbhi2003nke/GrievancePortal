// AdminOTP model
export interface AdminOTP {
  id?: number;
  adminid: string;
  otp: number | null;
  email: string;
  createdat?: Date;
  attempt?: number;
}

export interface CreateAdminOTPData {
  adminid: string;
  otp: number | null;
  email: string;
  attempt?: number;
  createdat?: Date;
}
export interface OTP {
  id?: number;
  rollno: string;
  otp: number | null; // Allow null for expired OTPs
  email: string;
  createdat?: Date;
  attempt?: number;
}

export interface CreateOTPData {
  rollno: string;
  otp: number | null; // Allow null for expired OTPs
  email: string;
  attempt?: number;
  createdat?: Date;
}
