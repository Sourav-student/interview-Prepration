import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.models.js";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        [key: string]: any;
      };
    }
  }
}

export const Authenticated = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
        data: []
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded as { id: string;[key: string]: any };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
      success: false,
      data: []
    });
  }
};

export const Authorization = async (req: Request, res: Response) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
        data: []
      });
    }

    const user = await User.findById(user_id);

    if (user.user_role === 'user') {
      return res.status(401).json({
        message: "You have not access to add/update/delete events",
        success: true,
        data: [
          {
            user_id, user_role: user.user_role
          }
        ]
      });
    }
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
      success: false,
      data: []
    });
  }
};