import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';

dotenv.config()

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

function cleanJSON(text: string) {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}

export async function connGemini(prompt: string) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: prompt,
  });

  const rawText = response.text || "";

  try {
    const cleaned = cleanJSON(rawText);
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Parse Error:", rawText);
    return { error: "Invalid JSON", raw: rawText };
  }
}