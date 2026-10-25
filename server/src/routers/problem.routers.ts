import { Router } from "express";
import { Authenticated, Authorization } from "../middlewares/auth.middlewares.js";
import { createNewProblem, getAllProblems, saveGeneratedProblems } from "../controllers/problem.controllers.js";

export const problemRouter = Router();

problemRouter.post('/save', Authenticated, saveGeneratedProblems);
problemRouter.post('/admin/add', Authenticated, Authorization, createNewProblem);
problemRouter.get('/all', Authenticated, getAllProblems);