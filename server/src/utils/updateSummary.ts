import mongoose from "mongoose";
import Feedback from "../models/feedback.models.js";
import Summary from "../models/summary.models.js";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function updateSummary(user_id: mongoose.Schema.Types.ObjectId) {
  try {
    const feedbacks = await Feedback.find({ user_id });

    if (!feedbacks.length) {
      console.log("No feedback found");
      return;
    }

    const formattedFeedback = feedbacks
      .map((f, index) => `${index + 1}. ${f.comment || JSON.stringify(f)}`)
      .join("\n");

    const prompt = `
You are an evaluator.

Based on the feedback below, write a concise and professional performance summary of the user in 3-4 lines.

Feedback:
${formattedFeedback}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    const rawText = response.text?.trim() || "";

    await Summary.findOneAndUpdate(
      { user_id },
      { summary: rawText },
      { upsert: true, new: true }
    );

    // console.log("Summary updated successfully");

  } catch (error) {
    // console.error("Error updating summary:", error);
  }
}