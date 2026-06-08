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
import { getError } from "../utils/getError.js";
import { getSuccess } from "../utils/getSuccess.js";
import InterviewSession, { IHistory } from "../models/interviewSession.models.js";
import { connGroq } from "../utils/connGroq.js";


export async function createInterviewSession(req: Request, res: Response) {
  try {
    const { domain, interview_level, sessionId } = req.body;
    const user_id = (req as any).user.id;

    if (!domain || !interview_level) {
      return getError(res, "fill the required fields", 404);
    }

    if (!user_id || !sessionId) {
      return getError(res, "there is currently no session available", 401);
    }

    const session = await InterviewSession.create({
      user_id, domain, interview_level, sessionId
    })

    if (!session) {
      return getError(res, "there is currently no session available", 422);
    }

    return res.status(201).json({
      message: "session create successfully",
      success: true,
      status: 201,
      data: session
    });
  } catch (error) {
    return getError(res, "something went wrong", 500);
  }
}

export async function reviewInterviewQuestion(req: Request, res: Response) {
  try {
    const { answer, question } = req.body;
    const user_id = (req as any).user.id;
    const { sessionId } = req.params;

    if (!sessionId) {
      return getError(res, "session is not created", 400);
    }

    const session = await InterviewSession.findOne({ user_id, sessionId });
    if (!session) {
      return getError(res, "session not found", 404);
    }

    const prompt = `You are a senior FAANG interviewer evaluating candidate responses.

Analyze the interview question and candidate answer carefully.

Return a score between 0 and 10 based on:
- Correctness
- Completeness
- Communication quality
- Technical depth
- Relevance to the question

Rules:
- Score must be an integer only.
- Suggestion must be at most 50 words.
- If the answer is nearly perfect, return "BEST ANSWER".
- Never return null.
- Never return markdown.
- Never return text outside the JSON object.

Output Format:

{
  "score": 8,
  "suggestion": "Mention React's virtual DOM reconciliation process for a more complete answer."
}

Question:
${question}

Answer:
${answer}`;

    const parsed = await connGroq(prompt);

    session.history.push({
      question,
      answer,
      score: parsed.score,
      suggestion: parsed.suggestion
    })

    session.questionCount++;

    await session.save({ validateBeforeSave: false });

    const questionCount = session.questionCount;
     
    const isFinished = questionCount >= 7;

    if (questionCount === 7 || isFinished) {
      const { filteredData, avg_score } = buildFeedbackData(session.history);

      await saveFeedback({
        feedback: parsed.feedback || "No feedback",
        domain: session.domain,
        level: session.interview_level,
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
    }

    return res.status(200).json({
      message: "Success",
      data: {
        response: session.history,
        questionCount,
        isFinished: questionCount >= 3,
      },
      success: true,
    });

  } catch (error) {
    console.error("Error in takeInterview:", error);
    return getError(res, "something went wrong", 500);
  }
}

export async function getInterviewQuestion(req: Request, res: Response) {
  try {
    const user_id = (req as any).user.id;
    const { sessionId } = req.params;

    if (!sessionId) {
      return getError(res, "session is not created", 400);
    }

    const session = await InterviewSession.findOne({ user_id, sessionId });
    if (!session) {
      return getError(res, "session not found", 404);
    }

    const domain = session.domain;
    const interview_level = session.interview_level;
    const summary = (await Summary.findOne({ user_id }))?.summary || "";
    const history = (session.history || []) as IHistory[];

    const prompt = buildInterviewPrompt({
      domain,
      interview_level,
      summary,
      history
    });

    const parsed = await connGroq(prompt);
    return res.status(201).json({
      message: "Success",
      question: parsed,
      success: true,
    });
  } catch (error) {
    console.error("Error in takeInterview:", error);
    return getError(res, "something went wrong", 500);
  }
}


export async function getFeedbacks(req: Request, res: Response) {
  try {
    const user_id = (req as any).user.id;
    const { len } = req.params;

    const feedbacks = await Feedback.find({ user_id }).sort({ createdAt: -1 }).limit(Number(len));
    return getSuccess(res, "fetch data successfully", 200, feedbacks);
  } catch (error) {
    return getError(res, "something went wrong", 500);
  }
}

export async function getAllFeedbacks(req: Request, res: Response) {
  try {
    const user_id = (req as any).user.id;
    const feedbacks = await Feedback.find({ user_id }).sort({ createdAt: -1 });

    return getSuccess(res, "fetch successfully", 200, feedbacks)
  } catch (error) {
    return getError(res, "something went wrong", 500)
  }
}

export async function generateQuestion(req: Request, res: Response) {
  try {
    const { topic, difficulty, sessionId } = req.body;

    // 1. Basic validation
    if (!topic || !difficulty) {
      return getError(res, "Topic and difficulty are required", 400);
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
      return getError(res, "Invalid AI response format", 404);
    }

    // 5. Response
    return getSuccess(res, "Questions generated successfully", 201, parsed);
  } catch (error) {
    return getError(res, "something went wrong", 500);
  }
}