
export function buildFeedbackData(history: any[]) {
  const filteredData = history
    .filter((item) => item.answer && item.answer.trim() !== "")
    .map((item) => ({
      question: item.question,
      answer: item.answer,
      improved_answer: item.suggestion || "",
      score: item.score || 0
    }));

  const scores = filteredData.map((item) => item.score);

  const avg_score =
    scores.length > 0
      ? scores.reduce((a, b) => a + b, 0) / scores.length
      : 0;

  return { filteredData, avg_score };
}