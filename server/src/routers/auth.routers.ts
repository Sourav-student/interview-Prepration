import express from "express";
import { signup, login, getMe, logout, getUserDetail } from "../controllers/auth.controller";
import { isAuthenticated } from "../middlewares/auth.middlewares";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/me", isAuthenticated, getMe);
authRouter.post("/logout", isAuthenticated, logout);
authRouter.post("/user/:id", getUserDetail);

export default authRouter;