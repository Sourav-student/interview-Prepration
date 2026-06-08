import express from "express";
import { getFeedbacks, reviewInterviewQuestion, getAllFeedbacks, generateQuestion, createInterviewSession, getInterviewQuestion } from "../controllers/user.controllers.js";
import { isAuthenticated } from "../middlewares/auth.middlewares.js";

const userRouter = express.Router();

userRouter.post("/interview", isAuthenticated, createInterviewSession);
userRouter.post("/interview/:sessionId", isAuthenticated, reviewInterviewQuestion);

userRouter.get("/interview/:sessionId", isAuthenticated, getInterviewQuestion);
userRouter.get("/feedbacks/:len", isAuthenticated, getFeedbacks);
userRouter.get("/feedbacks/all", isAuthenticated, getAllFeedbacks);
userRouter.post("/problems", isAuthenticated, generateQuestion);

export default userRouter;