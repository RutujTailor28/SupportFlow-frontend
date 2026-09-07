import type { EscalationDetails } from '../../types/ticket';
import { chatCompletion, parseJsonContent } from './openrouter.service';

export interface EscalationInput {
  subject: string;
  message: string;
  conversation?: string;
  sentiment?: string;
  urgency?: string;
}

export interface EscalationResult {
  escalated: boolean;
  reasons: string[];
  triggerPhrases: string[];
  reason?: EscalationDetails['reason'];
}

const REASON_MAP: Array<{ match: RegExp; reason: NonNullable<EscalationDetails['reason']> }> = [
  { match: /churn|cancel|switch|competitor/i, reason: 'Churn Risk Detected' },
  { match: /legal|lawyer|attorney|sue|lawsuit/i, reason: 'Legal Language' },
  { match: /sla|downtime|outage/i, reason: 'SLA Risk' },
  { match: /repeat|again|multiple times|second time/i, reason: 'Repeat Contact' },
  { match: /executive|ceo|manager|vp\b/i, reason: 'Executive Escalation' },
  { match: /security|breach|hack|unauthorized/i, reason: 'Security Threat' },
];

function mapPrimaryReason(reasons: string[]): EscalationDetails['reason'] | undefined {
  for (const reason of reasons) {
    const hit = REASON_MAP.find((entry) => entry.match.test(reason));
    if (hit) return hit.reason;
  }
  return reasons.length > 0 ? 'Churn Risk Detected' : undefined;
}

export async function detectEscalation(input: EscalationInput): Promise<EscalationResult> {
  const content = await chatCompletion({
    json: true,
    messages: [
      {
        role: 'system',
        content: `You detect support ticket escalation risk for SupportFlow.
Escalate when you detect cancellation/churn, legal threats, chargebacks, compliance demands, extreme negativity, or critical urgency.
Return ONLY valid JSON:
{
  "escalated": true|false,
  "reasons": ["..."],
  "trigger_phrases": ["exact phrases from the ticket"]
}`,
      },
      {
        role: 'user',
        content: `Subject: ${input.subject}
Current sentiment hint: ${input.sentiment || 'unknown'}
Current urgency hint: ${input.urgency || 'unknown'}

Customer message:
${input.message}

${input.conversation ? `Conversation history:\n${input.conversation}` : ''}

Should this ticket be escalated?`,
      },
    ],
  });

  const parsed = parseJsonContent<Record<string, unknown>>(content);
  const reasons = Array.isArray(parsed.reasons)
    ? parsed.reasons.map((r) => String(r).trim()).filter(Boolean).slice(0, 8)
    : [];
  const triggerPhrases = Array.isArray(parsed.trigger_phrases)
    ? parsed.trigger_phrases.map((p) => String(p).trim()).filter(Boolean).slice(0, 8)
    : Array.isArray(parsed.triggerPhrases)
      ? parsed.triggerPhrases.map((p) => String(p).trim()).filter(Boolean).slice(0, 8)
      : [];

  const escalated = Boolean(parsed.escalated) && (reasons.length > 0 || triggerPhrases.length > 0);

  return {
    escalated,
    reasons: escalated ? reasons : [],
    triggerPhrases: escalated ? triggerPhrases : [],
    reason: escalated ? mapPrimaryReason(reasons) : undefined,
  };
}
