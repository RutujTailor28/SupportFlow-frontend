import { OPENROUTER_DRAFT_MAX_TOKENS, OPENROUTER_DRAFT_TEMPERATURE } from '../../config/ai.config';
import { chatCompletion, parseJsonContent } from './openrouter.service';

export interface ReplyKbArticle {
  title: string;
  summary: string;
  content: string;
}

export interface ReplyInput {
  subject: string;
  message: string;
  customerName: string;
  conversation?: string;
  classification?: string;
  kbArticles?: ReplyKbArticle[];
  tone?: 'friendly' | 'formal' | 'concise';
}

export interface ReplyDraftResult {
  friendly: string;
  formal: string;
  concise: string;
}

export async function generateReply(input: ReplyInput): Promise<ReplyDraftResult> {
  const kbBlock =
    input.kbArticles && input.kbArticles.length > 0
      ? input.kbArticles
          .map(
            (article, index) =>
              `Article ${index + 1}: ${article.title}\nSummary: ${article.summary}\nContent:\n${article.content.slice(0, 1800)}`
          )
          .join('\n\n')
      : 'No knowledge base articles matched.';

  const content = await chatCompletion({
    json: true,
    temperature: OPENROUTER_DRAFT_TEMPERATURE,
    maxTokens: OPENROUTER_DRAFT_MAX_TOKENS,
    messages: [
      {
        role: 'system',
        content: `You draft customer support replies for SupportFlow agents.
Ground answers in the provided knowledge base when relevant. Never invent refunds, legal commitments, or policy exceptions.
Return ONLY valid JSON:
{
  "friendly": "...",
  "formal": "...",
  "concise": "..."
}
Each value must be a complete email-style reply ready for an agent to edit and send.`,
      },
      {
        role: 'user',
        content: `Customer name: ${input.customerName}
Subject: ${input.subject}
Preferred tone emphasis: ${input.tone || 'friendly'}
Classification context: ${input.classification || 'n/a'}

Customer message:
${input.message}

${input.conversation ? `Conversation history:\n${input.conversation}` : ''}

Knowledge base context:
${kbBlock}

Generate three tone variants.`,
      },
    ],
  });

  const parsed = parseJsonContent<Record<string, unknown>>(content);
  const friendly = String(parsed.friendly || '').trim();
  const formal = String(parsed.formal || '').trim();
  const concise = String(parsed.concise || '').trim();

  if (!friendly && !formal && !concise) {
    throw new Error('AI returned empty reply drafts.');
  }

  const fallback = `Hi ${input.customerName.split(' ')[0] || 'there'},\n\nThank you for contacting SupportFlow regarding "${input.subject}". We are reviewing your request and will follow up shortly.\n\nBest regards,\nSupport Operations`;

  return {
    friendly: friendly || fallback,
    formal: formal || fallback,
    concise: concise || fallback,
  };
}
