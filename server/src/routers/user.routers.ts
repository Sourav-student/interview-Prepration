import express from "express";
import { getFeedbacks, takeInterview, getAllFeedbacks, generateQuestion } from "../controllers/user.controllers";
import { isAuthenticated } from "../middlewares/auth.middlewares";

const userRouter = express.Router();

userRouter.post("/interview", isAuthenticated, takeInterview);
userRouter.get("/feedbacks/:len", isAuthenticated, getFeedbacks);
userRouter.get("/feedbacks/all", isAuthenticated, getAllFeedbacks);

userRouter.post("/problems", isAuthenticated, generateQuestion);

export default userRouter;