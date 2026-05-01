import express from "express";
import { signup, login, getMe, logout, getUserDetail } from "../controllers/auth.controller.js";
import { isAuthenticated } from "../middlewares/auth.middlewares.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/me", isAuthenticated, getMe);
authRouter.post("/logout", isAuthenticated, logout);
authRouter.post("/user/:id", getUserDetail);

export default authRouter;