import mongoose, { Document, Schema } from "mongoose";

export interface IHistory {
  question?: string;
  answer?: string;
  score?: number;
  suggestion?: string;
}

export interface IInterviewSession extends Document {
  user_id: mongoose.Types.ObjectId;
  sessionId: string;
  domain: string;
  interview_level: string;
  questionCount: number;
  history: IHistory[];
  completed: boolean;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const InterviewSessionSchema = new Schema<IInterviewSession>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    domain: {
      type: String,
      required: true,
      trim: true,
    },

    interview_level: {
      type: String,
      required: true,
      trim: true,
    },

    questionCount: {
      type: Number,
      default: 0,
    },

    history: [
      {
        question: String,
        answer: String,
        score: Number,
        suggestion: String,
      },
    ],

    completed: {
      type: Boolean,
      default: false,
    },

    expiresAt: {
      type: Date,
      default: () =>
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      expires: 0,
    },
  },
  {
    timestamps: true,
  }
);

const InterviewSession = mongoose.model<IInterviewSession>(
  "InterviewSession",
  InterviewSessionSchema
);

export default InterviewSession;