export function buildInterviewPrompt({
  domain,
  interview_level,
  summary,
  history,
  isFeedbackStep,
}: {
  domain: string;
  interview_level: string;
  summary: string;
  history: any[];
  isFeedbackStep: boolean;
}) {
  return `
You are a professional interviewer.

IMPORTANT:
- Return ONLY valid JSON
- No markdown, no backticks

Rules:
- Total questions allowed: 3
- Ask ONE question at a time
- Evaluate previous answer strictly
- Domain: ${domain}
- Difficulty: ${interview_level}
- Last performance: ${summary}

Previous:
${history
  .map((q, i) => `Q${i + 1}: ${q.question}\nA: ${q.answer || ""}`)
  .join("\n")}

${
  !isFeedbackStep
    ? `{
  "question": "string",
  "score": number,
  "suggestion": "string"
}`
    : `{
  "feedback": "string"
}`
}
`;
}