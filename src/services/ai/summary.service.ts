import { chatCompletion, parseJsonContent } from './openrouter.service';

export interface SummaryInput {
  subject: string;
  message: string;
  conversation?: string;
}

export interface SummaryResult {
  summary: string;
}

export async function summarizeTicket(input: SummaryInput): Promise<SummaryResult> {
  const content = await chatCompletion({
    json: true,
    messages: [
      {
        role: 'system',
        content: `You summarize support tickets for agents.
Return ONLY valid JSON: { "summary": "2-4 sentences covering issue, customer emotion, and risk signals" }`,
      },
      {
        role: 'user',
        content: `Subject: ${input.subject}

Customer message:
${input.message}

${input.conversation ? `Conversation history:\n${input.conversation}` : ''}

Summarize this ticket for a support agent.`,
      },
    ],
  });

  const parsed = parseJsonContent<Record<string, unknown>>(content);
  const summary = String(parsed.summary || '').trim();
  if (!summary) {
    throw new Error('AI returned an empty summary.');
  }
  return { summary };
}
