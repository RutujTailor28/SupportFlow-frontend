import type { TicketCategory, TicketPriority, TicketSentiment } from '../../types/ticket';
import { chatCompletion, parseJsonContent } from './openrouter.service';

export interface ClassificationInput {
  subject: string;
  message: string;
  conversation?: string;
}

export interface ClassificationResult {
  category: TicketCategory;
  subcategory: string;
  urgency: TicketPriority;
  sentiment: TicketSentiment;
  language: string;
  intent_summary: string;
  entities: { key: string; value: string }[];
  confidence: number;
}

const CATEGORIES: TicketCategory[] = [
  'Billing',
  'Technical',
  'Account',
  'Feature Request',
  'Shipping',
  'Security',
  'Other',
];

const URGENCIES: TicketPriority[] = ['critical', 'high', 'normal', 'low'];
const SENTIMENTS: TicketSentiment[] = ['positive', 'neutral', 'negative', 'very_negative'];

function normalizeCategory(value: unknown): TicketCategory {
  const raw = String(value || 'Other').trim().toLowerCase().replace(/[_-]+/g, ' ');
  const match = CATEGORIES.find((c) => c.toLowerCase() === raw);
  if (match) return match;
  if (raw.includes('bill') || raw.includes('refund') || raw.includes('invoice')) return 'Billing';
  if (raw.includes('tech') || raw.includes('bug') || raw.includes('api')) return 'Technical';
  if (raw.includes('account') || raw.includes('login') || raw.includes('password')) return 'Account';
  if (raw.includes('feature')) return 'Feature Request';
  if (raw.includes('ship') || raw.includes('delivery')) return 'Shipping';
  if (raw.includes('secur') || raw.includes('breach')) return 'Security';
  return 'Other';
}

function normalizeUrgency(value: unknown): TicketPriority {
  const raw = String(value || 'normal').trim().toLowerCase();
  return (URGENCIES.find((u) => u === raw) || 'normal') as TicketPriority;
}

function normalizeSentiment(value: unknown): TicketSentiment {
  const raw = String(value || 'neutral').trim().toLowerCase().replace(/\s+/g, '_');
  return (SENTIMENTS.find((s) => s === raw) || 'neutral') as TicketSentiment;
}

function normalizeEntities(value: unknown): { key: string; value: string }[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const record = item as Record<string, unknown>;
      const key = String(record.key ?? record.name ?? '').trim();
      const val = String(record.value ?? '').trim();
      if (!key || !val) return null;
      return { key, value: val };
    })
    .filter((item): item is { key: string; value: string } => Boolean(item))
    .slice(0, 12);
}

export async function classifyTicket(input: ClassificationInput): Promise<ClassificationResult> {
  const content = await chatCompletion({
    json: true,
    messages: [
      {
        role: 'system',
        content: `You are a customer support triage engine for SupportFlow.
Return ONLY valid JSON with this exact shape:
{
  "category": "Billing|Technical|Account|Feature Request|Shipping|Security|Other",
  "subcategory": "snake_case_label",
  "urgency": "critical|high|normal|low",
  "sentiment": "positive|neutral|negative|very_negative",
  "language": "en or language code/name",
  "intent_summary": "one sentence customer intent",
  "entities": [{"key":"...", "value":"..."}],
  "confidence": 0.0
}
confidence must be between 0 and 1.`,
      },
      {
        role: 'user',
        content: `Subject: ${input.subject}

Customer message:
${input.message}

${input.conversation ? `Conversation history:\n${input.conversation}` : ''}

Classify this support ticket.`,
      },
    ],
  });

  const parsed = parseJsonContent<Record<string, unknown>>(content);
  const confidenceRaw = Number(parsed.confidence);
  const confidence = Number.isFinite(confidenceRaw)
    ? Math.min(1, Math.max(0, confidenceRaw))
    : 0.75;

  return {
    category: normalizeCategory(parsed.category),
    subcategory: String(parsed.subcategory || 'general_inquiry').trim() || 'general_inquiry',
    urgency: normalizeUrgency(parsed.urgency),
    sentiment: normalizeSentiment(parsed.sentiment),
    language: String(parsed.language || 'en').trim() || 'en',
    intent_summary:
      String(parsed.intent_summary || parsed.intentSummary || 'Customer needs support assistance.').trim(),
    entities: normalizeEntities(parsed.entities),
    confidence,
  };
}
