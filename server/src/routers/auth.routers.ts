import express from "express";
import { signup, login, getMe, logout, getUserDetail } from "../controllers/auth.controller.js";
import { Authenticated } from "../middlewares/auth.middlewares.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/me", Authenticated, getMe);
authRouter.post("/logout", Authenticated, logout);
authRouter.post("/user/:id", Authenticated, getUserDetail);

export default authRouter;