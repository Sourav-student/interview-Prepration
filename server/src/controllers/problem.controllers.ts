import { Request, Response } from "express";
import { createProblem, insertProblems, listProblems, type CreateProblemInput } from "../services/problems.service.js";

const supportedPlatforms: Record<string, string[]> = {
  LeetCode: ["leetcode.com"],
  HackerRank: ["hackerrank.com"],
  Codeforces: ["codeforces.com"],
  CodeChef: ["codechef.com"],
  GeeksforGeeks: ["geeksforgeeks.org"],
  AtCoder: ["atcoder.jp"],
  InterviewBit: ["interviewbit.com"],
  "Coding Ninjas": ["naukri.com", "codingninjas.com"],
  SPOJ: ["spoj.com"],
};

function isProblemInput(value: unknown): value is CreateProblemInput {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const problem = value as Record<string, unknown>;
  if (
    typeof problem.problem_title !== "string" ||
    typeof problem.problem_desc !== "string" ||
    typeof problem.problem_level !== "string" ||
    typeof problem.problem_link !== "string" ||
    typeof problem.problem_platform_name !== "string" ||
    !problem.problem_title.trim() ||
    !problem.problem_desc.trim() ||
    !["Easy", "Medium", "Hard"].includes(problem.problem_level) ||
    problem.problem_title.trim().length > 160 ||
    problem.problem_desc.trim().length > 3000
  ) {
    return false;
  }

  try {
    const url = new URL(problem.problem_link);
    const domains = supportedPlatforms[problem.problem_platform_name];
    return Boolean(
      domains &&
      url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      (!url.port || url.port === "443") &&
      domains.some((domain) => url.hostname === domain || url.hostname.endsWith(`.${domain}`)),
    );
  } catch {
    return false;
  }
}

export async function saveGeneratedProblems(req: Request, res: Response) {
  const candidates: unknown = req.body?.problems;
  if (!Array.isArray(candidates) || candidates.length < 1 || candidates.length > 5) {
    return res.status(400).json({
      message: "Provide between one and five problems to save.",
      success: false,
      data: [],
    });
  }

  if (!candidates.every(isProblemInput)) {
    return res.status(400).json({
      message: "One or more problems have invalid fields or links.",
      success: false,
      data: [],
    });
  }

  const problems = candidates.map((problem) => ({
    problem_title: problem.problem_title.trim(),
    problem_desc: problem.problem_desc.trim(),
    problem_level: problem.problem_level,
    problem_link: new URL(problem.problem_link).href,
    problem_platform_name: problem.problem_platform_name,
  }));

  try {
    const insertedCount = await insertProblems(problems);
    return res.status(200).json({
      message: `${insertedCount} new problem${insertedCount === 1 ? "" : "s"} saved.`,
      success: true,
      data: { insertedCount },
    });
  } catch (error) {
    console.error("Saving generated problems failed:", error);
    return res.status(500).json({
      message: "Could not save problems right now. Please try again.",
      success: false,
      data: [],
    });
  }
}

export async function createNewProblem(req: Request, res: Response) {
  try {
    const { problem_title, problem_desc, problem_level, problem_link, problem_platform_name } = req.body;

    if (!problem_title || !problem_level || !problem_link || !problem_platform_name) {
      return res.status(400).json({
        message: "require fields are not fill!",
        success: false,
        data: []
      })
    }

    const data = { problem_desc, problem_title, problem_level, problem_link, problem_platform_name }

    const problem = await createProblem(data);

    if (!problem) {
      return res.status(400).json({
        message: "problem not created!",
        success: false,
        data: []
      });
    }

    return res.status(201).json({
      message : "new problem created!",
      success : true,
      data : problem
    })
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong!",
      success: false,
      data: []
    });
  }
}

export async function getAllProblems(req : Request, res : Response) {
  try {
    const problems = await listProblems();

    if (!problems) {
      return res.status(400).json({
        message: "problems not found",
        success: false,
        data: []
      });
    }

    return res.status(201).json({
      message : "new problem created!",
      success : true,
      data : problems
    })
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong!",
      success: false,
      data: []
    });
  }
}