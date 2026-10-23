import { Router } from "express";
import { createSheet, getAllSheets } from "../controllers/sheets.controllers.js";
import { isAuthenticated } from "../middlewares/auth.middlewares.js";

export const sheetRouter = Router();

sheetRouter.post("/", isAuthenticated, createSheet);
sheetRouter.get('/all', isAuthenticated, getAllSheets);