import { Response, Request } from "express";
import { connGemini } from "../utils/connGemini.js";
import Feedback from "../models/feedback.models.js";
import User from "../models/user.models.js";
import { updateSummary } from "../utils/updateSummary.js";
import Summary from "../models/summary.models.js";
import { buildFeedbackData } from "../utils/feedbackbuilder.js";
import { saveFeedback } from "../services/feedback.service.js";
import { updateUserStreak } from "../services/streak.services.js";
import { buildInterviewPrompt } from "../utils/promptBuilder.js";

const sessionStore: Record<string, { history: Array<{ question?: string; score?: number; suggestion?: string; answer?: string }>; questionCount: number }> = {};

export async function takeInterview(req: Request, res: Response) {
  try {
    const { domain, interview_level, answer, sessionId } = req.body;
    const user_id = (req as any).user.id;

    // 1. INIT SESSION
    if (!sessionStore[sessionId]) {
      sessionStore[sessionId] = {
        history: [],
        questionCount: 0,
      };
    }

    const session = sessionStore[sessionId];

    // 2. ATTACH ANSWER
    if (answer && session.history.length > 0) {
      session.history[session.history.length - 1].answer = answer;
    }

    // 3. GET SUMMARY
    const summaryDoc = await Summary.findOne({ user_id });
    const summary = summaryDoc?.summary || "";

    // 4. DETERMINE STEP
    const isFeedbackStep = session.questionCount >= 3;

    // 5. BUILD PROMPT
    const prompt = buildInterviewPrompt({
      domain,
      interview_level,
      summary,
      history: session.history,
      isFeedbackStep,
    });

    // 6. CALL AI
    const parsed = await connGemini(prompt);

    // 7. UPDATE SESSION
    if (parsed.question && session.history.length < 3) {
      session.history.push({
        question: parsed.question,
        score: parsed.score,
        suggestion: parsed.suggestion,
      });

      session.questionCount++;
    }

    const questionCount = session.questionCount;

    // 8. INTERVIEW COMPLETED
    if (questionCount === 4 || isFeedbackStep) {
      const { filteredData, avg_score } = buildFeedbackData(session.history);

      await saveFeedback({
        feedback: parsed.feedback || "No feedback",
        domain,
        level: interview_level,
        avg_score,
        filteredData,
        user_id,
      });

      const user = await User.findById(user_id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      await updateUserStreak(user);
      await updateSummary(user_id);

      // OPTIONAL: clear session
      delete sessionStore[sessionId];
    }

    return res.status(200).json({
      message: "Success",
      data: {
        response: parsed,
        questionCount,
        isFinished: questionCount >= 3,
      },
      success: true,
    });

  } catch (error) {
    console.error("Error in takeInterview:", error);
    return res.status(500).json({
      message: "Something went wrong!",
      success: false,
    });
  }
}

export async function getFeedbacks(req: Request, res: Response) {
  try {
    const user_id = (req as any).user.id;
    const { len } = req.params;
    // console.log(len);

    const feedbacks = await Feedback.find({ user_id }).sort({ createdAt: -1 }).limit(Number(len));
    return res.status(200).json({
      success: true,
      message: "all feedbacks are loaded",
      feedbacks
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "something went wrong!"
    })
  }
}

export async function getAllFeedbacks(req: Request, res: Response) {
  try {
    const user_id = (req as any).user.id;

    const feedbacks = await Feedback.find({ user_id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "all feedbacks are loaded",
      feedbacks
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "something went wrong!"
    })
  }
}

export async function generateQuestion(req: Request, res: Response) {
  try {
    const user_id = (req as any).user.id;
    const { topic, difficulty, sessionId } = req.body;

    // 1. Basic validation
    if (!topic || !difficulty) {
      return res.status(400).json({
        success: false,
        message: "Topic and difficulty are required",
      });
    }

    // 2. Prompt
    const prompt = `
You are an expert interviewer and educator in computer science.

Generate a set of high-quality questions based on:
- Topic: ${topic}
- Difficulty Level: ${difficulty} (Easy, Medium, Hard)

Requirements:
1. Generate EXACTLY 5 questions
2. Mix theory + problem solving
3. No repetition
4. Strictly follow difficulty

Return STRICT JSON ONLY:
[
  {
    "question": "string",
    "explanation": "string",
    "sample_answer": "string",
    "tags": ["string"]
  }
]
`;

    // 3. Call Gemini
    const parsed = await connGemini(prompt);

    // 4. Validate response
    if (!Array.isArray(parsed)) {
      return res.status(500).json({
        success: false,
        message: "Invalid AI response format",
        raw: parsed,
      });
    }

    // 5. Response
    return res.status(200).json({
      success: true,
      message: "Questions generated successfully",
      data: parsed,
    });

  } catch (error) {
    console.error("Error in generateQuestion:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
}