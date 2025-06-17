import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { DatabaseService } from "../services/database";
import { PersonalInfo } from "../models/PersonalInfo";

// Extend Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      User?: PersonalInfo;
    }
  }
}

interface JWTPayload {
  rollNumber: string;
  name: string;
  email: string;
  iat?: number;
  exp?: number;
}

export const verifyJWT = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token =
    //   req.cookies?.jwtToken ||
      req.header("Authorization")?.replace("Bearer ", "") ||
      req.body?.jwtToken;

    if (!token) {
      res.status(403).json({
        message: "JWT_TOKEN_NOT_FOUND",
        status: 403,
        success: false,
      });
      return;
    }

    // Verify JWT token
    let decoded: JWTPayload | null = null;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecretkey") as JWTPayload;
    } catch (err: any) {
      if (err.name === "TokenExpiredError") {
        res.status(403).json({
          error: err,
          message: "JWT_TOKEN_EXPIRED",
          status: 403,
          success: false,
        });
        return;
      } else if (err.name === "JsonWebTokenError") {
        res.status(403).json({
          error: err,
          message: "JWT_TOKEN_INVALID",
          status: 403,
          success: false,
        });
        return;
      }
    }

    if (!decoded) {
      res.status(403).json({
        message: "JWT_TOKEN_INVALID",
        status: 403,
        success: false,
      });
      return;
    }

    // Find the user associated with the token
    const user = await DatabaseService.findUserByRollNumber(decoded.rollNumber);
    
    if (!user) {
      res.status(403).json({
        message: "JWT_TOKEN_INVALID_USER_NOT_FOUND",
        status: 403,
        success: false,
      });
      return;
    }

    // Exclude sensitive information
    const { password, ...userWithoutPassword } = user;
    req.User = userWithoutPassword as PersonalInfo;

    next();
  } catch (error: any) {
    console.error("Error verifying JWT:", error);
    res.status(403).json({
      message: "GENERAL_ERROR",
      status: 403,
      success: false,
      error: error.message,
    });
  }
};

