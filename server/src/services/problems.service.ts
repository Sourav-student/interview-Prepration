import { Problems } from "../models/problem.models.js";
import { ProblemType } from "../types/models_type.js";

export type CreateProblemInput = Pick<
  ProblemType,
  "problem_title" | "problem_desc" | "problem_level" | "problem_link" | "problem_platform_name"
>;

export function createProblem(data: CreateProblemInput) {
  return Problems.create(data);
}

export async function insertProblems(data: CreateProblemInput[]) {
  if (data.length === 0) {
    return 0;
  }

  const result = await Problems.bulkWrite(
    data.map((problem) => ({
      updateOne: {
        filter: { problem_link: problem.problem_link },
        update: { $setOnInsert: problem },
        upsert: true,
      },
    })),
  );

  return result.upsertedCount;
}

export function listProblems() {
  return Problems.find().lean();
}