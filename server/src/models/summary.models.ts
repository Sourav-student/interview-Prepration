import mongoose, { Schema } from "mongoose";
import { SummaryType } from "../types/models_type.js";

const summarySchema = new Schema<SummaryType>({
  summary: {
    type: String,
    required: true
  },

  user_id: {
    type: Schema.Types.ObjectId,
    required: true
  }
}, { timestamps: true });

const Summary = mongoose.models.Summary || mongoose.model("Summary", summarySchema);

export default Summary;