export function buildInterviewPrompt({
  domain,
  interview_level,
  summary,
  history
}: {
  domain: string;
  interview_level: string;
  summary: string;
  history: any[];
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
  As you see all the previous performance of the user and overall summary about the user now provide a question according to the given data.
`;

}