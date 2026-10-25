import mongoose, { Document } from "mongoose";

export interface userType extends Document {
  username: string;
  name: string;
  email: string;
  phone_no: string;
  streak: number;
  streak_data: Date | null;
  password: string;
  problems_solved: number;
  mock_interviews: number;
}

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

export interface SummaryType extends Document {
  summary: string,
  user_id: mongoose.Schema.Types.ObjectId
}

export interface userDataType {
  question: string;
  answer: string;
  improved_answer?: string;
  score: number,
}

export interface feedbackType extends Document {
  feedback: string;
  domain: string;
  level: string;
  avg_score: number;
  user_res_data: userDataType[];
  user_id: mongoose.Schema.Types.ObjectId;
}

export interface SheetType extends Document{
  author : string,
  sheet_link : string,
}

export interface ProblemType extends Document{
  problem_title : string,
  problem_desc : string,
  problem_level : string,
  problem_link : string,
  problem_platform_name : string
}