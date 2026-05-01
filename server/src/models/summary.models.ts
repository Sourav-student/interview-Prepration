import mongoose, { Schema, Document } from "mongoose";

interface SummaryType extends Document {
  summary: string,
  user_id: mongoose.Schema.Types.ObjectId
}

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