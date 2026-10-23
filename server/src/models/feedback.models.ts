import mongoose, { Schema } from "mongoose";
import { feedbackType, userDataType } from "../types/models_type.js";

const userResDataSchema = new Schema<userDataType>({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  improved_answer: { type: String, default: "" },
  score: {
    type: Number,
    min: 0,
    max: 10,
    required: true
  }
});

const feedbackSchema = new Schema<feedbackType>(
  {
    feedback: {
      type: String,
      trim: true,
      required: true
    },

    domain: {
      type: String,
      trim: true,
      required: true,
      index: true
    },

    level: {
      type: String,
      required: true,
      index: true
    },

    avg_score: {
      type: Number,
      default: 0
    },

    user_res_data: {
      type: [userResDataSchema],
      required: true
    },

    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    }
  },
  { timestamps: true }
);

feedbackSchema.index({ user_id: 1, domain: 1 });
feedbackSchema.index({ createdAt: -1 });

const Feedback =
  mongoose.models.Feedback ||
  mongoose.model<feedbackType>("Feedback", feedbackSchema);

export default Feedback;