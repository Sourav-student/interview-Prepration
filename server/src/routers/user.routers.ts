import express from "express";
import { getFeedbacks, reviewInterviewQuestion, getAllFeedbacks, generateQuestion, createInterviewSession, getInterviewQuestion } from "../controllers/user.controllers.js";
import { Authenticated } from "../middlewares/auth.middlewares.js";

const userRouter = express.Router();

userRouter.post("/interview", Authenticated, createInterviewSession);
userRouter.post("/interview/:sessionId", Authenticated, reviewInterviewQuestion);

userRouter.get("/interview/:sessionId", Authenticated, getInterviewQuestion);
userRouter.get("/feedbacks/:len", Authenticated, getFeedbacks);
userRouter.get("/feedbacks/all", Authenticated, getAllFeedbacks);
userRouter.post("/problems", Authenticated, generateQuestion);

export default userRouter;