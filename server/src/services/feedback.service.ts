import Feedback from "../models/feedback.models.js";

export async function saveFeedback({
  feedback,
  domain,
  level,
  avg_score,
  filteredData,
  user_id
}: any) {
  return await Feedback.create({
    feedback,
    domain,
    level,
    avg_score,
    user_res_data: filteredData,
    user_id
  });
}