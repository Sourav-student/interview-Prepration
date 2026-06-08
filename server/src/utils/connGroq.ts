import { Groq } from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

const groq = new Groq();

function cleanJSON(text: string) {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}

export async function connGroq(prompt : string) {
  try {
    const chatCompletion = await groq.chat.completions.create({
      "messages": [
        {
          "role": "user",
          "content": prompt
        }
      ],
      "model": "llama-3.3-70b-versatile",
      "temperature": 1,
      // "max_completion_tokens": 1,
      "top_p": 1,
      "stream": false,
      "stop": null
    });

    const rawText = chatCompletion.choices[0].message.content;
    const cleaned = cleanJSON(rawText!);
    return JSON.parse(cleaned);
  } catch (error) {
    console.log(error);
  }
}
