import { Router } from "express";
import { createSheet, getAllSheets } from "../controllers/sheets.controllers.js";
import { Authenticated, Authorization } from "../middlewares/auth.middlewares.js";

export const sheetRouter = Router();

sheetRouter.post("/admin/add", Authenticated, Authorization, createSheet);
sheetRouter.get('/all', Authenticated, getAllSheets);