import mongoose from "mongoose";
import { SheetType } from "../types/models_type.js";

const sheetSchema = new mongoose.Schema<SheetType>({
  sheet_link: {
    type: String,
    trim: true,
    required: true
  },

  author: {
    type: String,
    trim: true,
    unique: true,
    required: true
  }
}, { timestamps: true });

export const Sheets = mongoose.model<SheetType>("Sheets", sheetSchema);