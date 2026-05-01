import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
      success: false
    });
  }
};