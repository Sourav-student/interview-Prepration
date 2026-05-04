import { Response, Request } from "express";
import User from "../models/user.models.js";
import jwt from "jsonwebtoken";
import argon from "argon2";

export async function signup(req: Request, res: Response) {
  try {
    const { username, name, password, email, phone_no } = req.body;

    if (!username || !name || !email || !password) {
      return res.status(400).json({
        message: "fill required fields",
        success: false
      });
    }

    const user = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (user) {
      return res.status(400).json({
        message: "user already exist",
        success: false
      });
    }

    const hashPassword = await argon.hash(password);

    const newUser = await User.create({
      username, email, password: hashPassword, name, phone_no
    })

    return res.status(201).json({
      message: "account created successfully!",
      data: newUser,
      success: true
    })
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong!",
      error,
      success: false
    })
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Provide username and password",
        success: false
      });
    }

    const user = await User.findOne({ username });

    if (!user || !user.password) {
      return res.status(400).json({
        message: "Invalid username or password",
        success: false
      });
    }

    const isMatch = await argon.verify(user.password, password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid username or password",
        success: false
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not defined");
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        username: user.username
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000
    });

    const userData = user.toObject();
    delete userData.password;

    return res.status(200).json({
      message: "Login successful!",
      data: userData,
      success: true
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong!",
      success: false
    });
  }
}

export async function getMe(req: Request, res: Response) {
  try {
    const { id } = (req as any).user;

    const user = await User.findById(id).select(
      "-password -__v -createdAt -updatedAt"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    let diffInDays = -1;

    if (user.streak_data) {
      const lastDate = new Date(user.streak_data);
      lastDate.setHours(0, 0, 0, 0);
      const diffInMilliseconds = currentDate.getTime() - lastDate.getTime();
      diffInDays = Math.round(diffInMilliseconds / (1000 * 60 * 60 * 24));
    }

    if (diffInDays > 1 || diffInDays === -1) {
      user.streak = 0;
    }

    await user.save();

    return res.status(200).json({
      message: "fetch profile information",
      user,
      success: true,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "something went wrong!",
      error,
      success: false,
    });
  }
}

export async function logout(req: Request, res: Response) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true
    });

    return res.json({
      message: "Logged out successfully",
      success: true
    });
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong!",
      error,
      success: false
    })
  }
}

export async function getUserDetail(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(404).json({
        message: "user not found!",
        success: false
      })
    }

    const user = await User.findOne({ _id: id }, { password: 0, phone_no: 0 });

    return res.status(200).json({
      message: `fetch profile information of user : ${user.username}`,
      user,
      success: true
    })
  } catch (error) {
    return res.status(500).json({
      message: 'something went wrong!',
      success: false
    })
  }
}