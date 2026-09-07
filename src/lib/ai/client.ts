import type { TicketCategory, TicketPriority, TicketSentiment } from '../../types/ticket';

export class AiClientError extends Error {
  code: string;
  status: number;

  constructor(message: string, code: string, status = 500) {
    super(message);
    this.name = 'AiClientError';
    this.code = code;
    this.status = status;
  }
}

async function postAi<T>(path: string, body: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new AiClientError(
      'Network error while contacting AI service. Please try again.',
      'NETWORK_ERROR',
      502
    );
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new AiClientError(
      String((data as { detail?: string }).detail || 'AI request failed.'),
      String((data as { code?: string }).code || 'AI_ERROR'),
      response.status
    );
  }

  return data as T;
}

export interface ClassifyResponse {
  category: TicketCategory;
  subcategory: string;
  urgency: TicketPriority;
  sentiment: TicketSentiment;
  language: string;
  intent_summary: string;
  entities: { key: string; value: string }[];
  confidence: number;
}

export interface EscalateResponse {
  escalated: boolean;
  reasons: string[];
  triggerPhrases: string[];
  reason?: string;
}

export interface DraftResponse {
  friendly: string;
  formal: string;
  concise: string;
}

export interface SummarizeResponse {
  summary: string;
}

export function classifyTicketAi(payload: {
  subject: string;
  message: string;
  conversation?: string;
}) {
  return postAi<ClassifyResponse>('/api/ai/classify', payload);
}

export function escalateTicketAi(payload: {
  subject: string;
  message: string;
  conversation?: string;
  sentiment?: string;
  urgency?: string;
}) {
  return postAi<EscalateResponse>('/api/ai/escalate', payload);
}

export function draftReplyAi(payload: {
  subject: string;
  message: string;
  customerName: string;
  conversation?: string;
  classification?: string;
  tone?: 'friendly' | 'formal' | 'concise';
  kbArticles?: Array<{ title: string; summary: string; content: string }>;
}) {
  return postAi<DraftResponse>('/api/ai/draft', payload);
}

export function summarizeTicketAi(payload: {
  subject: string;
  message: string;
  conversation?: string;
}) {
  return postAi<SummarizeResponse>('/api/ai/summarize', payload);
}

export function buildConversationText(
  messages: Array<{ senderName: string; senderType: string; content: string }>
): string {
  return messages
    .map((message) => `[${message.senderType}] ${message.senderName}: ${message.content}`)
    .join('\n');
}

export function getPrimaryCustomerMessage(
  messages: Array<{ senderType: string; content: string }>,
  fallback = ''
): string {
  const customer = [...messages].reverse().find((message) => message.senderType === 'customer');
  return customer?.content || fallback;
}
