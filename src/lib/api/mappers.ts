import {
  AIClassification,
  Customer,
  EscalationDetails,
  Message,
  SupportTeam,
  Ticket,
  TicketCategory,
  TicketPriority,
  TicketSentiment,
  TicketStatus,
} from '../../types/ticket';
import { KBArticle, KBCategory, IndexingStatus } from '../../types/knowledgeBase';
import { RoutingRule, RuleAction, RuleCondition, RuleMatchType } from '../../types/routingRule';
import {
  ClassificationDto,
  CustomerDto,
  EscalationSummaryDto,
  KBArticleDto,
  MessageDto,
  RoutingRuleDto,
  TicketDetailDto,
  TicketSummaryDto,
} from './types';

const CATEGORIES: TicketCategory[] = [
  'Billing',
  'Technical',
  'Account',
  'Feature Request',
  'Shipping',
  'Security',
  'Other',
];

const PRIORITIES: TicketPriority[] = ['critical', 'high', 'normal', 'low'];
const STATUSES: TicketStatus[] = ['new', 'open', 'pending', 'resolved', 'closed'];
const SENTIMENTS: TicketSentiment[] = ['positive', 'neutral', 'negative', 'very_negative'];
const TEAMS: SupportTeam[] = [
  'Finance Team',
  'Engineering',
  'Tier 1 Support',
  'Tier 2 Support',
  'Account Management',
  'Security & Compliance',
  'Product Team',
];

const KB_CATEGORIES: KBCategory[] = [
  'Billing',
  'Technical',
  'Account',
  'Features',
  'Feature Request',
  'Shipping',
  'Security',
];

const INDEX_STATUSES: IndexingStatus[] = ['indexed', 'processing', 'failed', 'draft', 'archived'];

function asCategory(value?: string | null): TicketCategory {
  if (value && CATEGORIES.includes(value as TicketCategory)) return value as TicketCategory;
  return 'Other';
}

function asPriority(value?: string | null): TicketPriority {
  if (value && PRIORITIES.includes(value as TicketPriority)) return value as TicketPriority;
  return 'normal';
}

function asStatus(value?: string | null): TicketStatus {
  if (value && STATUSES.includes(value as TicketStatus)) return value as TicketStatus;
  return 'new';
}

function asSentiment(value?: string | null): TicketSentiment {
  if (value && SENTIMENTS.includes(value as TicketSentiment)) return value as TicketSentiment;
  return 'neutral';
}

function asTeam(value?: string | null): SupportTeam {
  if (value && TEAMS.includes(value as SupportTeam)) return value as SupportTeam;
  return 'Tier 1 Support';
}

function asKbCategory(value?: string | null): KBCategory {
  if (value && KB_CATEGORIES.includes(value as KBCategory)) return value as KBCategory;
  return 'Technical';
}

function asIndexStatus(value?: string | null): IndexingStatus {
  if (value && INDEX_STATUSES.includes(value as IndexingStatus)) return value as IndexingStatus;
  return 'draft';
}

function formatRelativeTimestamp(value?: string | null): string {
  if (!value) return 'Just now';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const diffMs = Date.now() - date.getTime();
  if (diffMs < 60_000) return 'Just now';
  if (diffMs < 3_600_000) return `${Math.floor(diffMs / 60_000)}m ago`;
  if (diffMs < 86_400_000) return `${Math.floor(diffMs / 3_600_000)}h ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function formatSlaDueIn(slaDueAt?: string | null): string | undefined {
  if (!slaDueAt) return undefined;
  const due = new Date(slaDueAt);
  if (Number.isNaN(due.getTime())) return undefined;
  const diffMs = due.getTime() - Date.now();
  if (diffMs <= 0) return 'Overdue';
  if (diffMs < 3_600_000) return `${Math.max(1, Math.round(diffMs / 60_000))} min`;
  if (diffMs < 86_400_000) return `${Math.round(diffMs / 3_600_000)} hours`;
  return `${Math.round(diffMs / 86_400_000)} days`;
}

function mapEntities(
  entities: unknown
): { key: string; value: string }[] {
  if (!entities) return [];
  if (Array.isArray(entities)) {
    return entities
      .map((item) => {
        if (item && typeof item === 'object') {
          const record = item as Record<string, unknown>;
          const key = String(record.key ?? record.name ?? 'Entity');
          const value = String(record.value ?? '');
          return { key, value };
        }
        return { key: 'Entity', value: String(item) };
      })
      .filter((e) => e.value);
  }
  if (typeof entities === 'object') {
    return Object.entries(entities as Record<string, unknown>).map(([key, value]) => ({
      key,
      value: String(value),
    }));
  }
  return [];
}

export function mapCustomer(dto: CustomerDto | undefined, fallback?: Partial<Customer>): Customer {
  const planRaw = dto?.plan || fallback?.plan || 'Free';
  const plan: Customer['plan'] =
    planRaw === 'Pro' || planRaw === 'Enterprise' || planRaw === 'Free' ? planRaw : 'Free';

  return {
    id: dto?.id || fallback?.id || 'unknown-customer',
    name: dto?.name || fallback?.name || 'Unknown Customer',
    email: dto?.email || fallback?.email || 'unknown@example.com',
    avatar: dto?.avatar || fallback?.avatar,
    company: dto?.company || fallback?.company,
    plan,
    isVip: dto?.isVip ?? fallback?.isVip,
    totalTickets: dto?.totalTickets ?? fallback?.totalTickets ?? 1,
    joinedDate: dto?.joinedDate || fallback?.joinedDate || new Date().toISOString().split('T')[0],
  };
}

export function mapMessage(dto: MessageDto): Message {
  return {
    id: dto.id,
    senderType: (dto.senderType as Message['senderType']) || 'customer',
    senderName: dto.senderName || 'Unknown',
    senderAvatar: dto.senderAvatar || undefined,
    content: dto.content || '',
    timestamp: formatRelativeTimestamp(dto.timestamp),
    isAiGenerated: dto.isAiGenerated,
    aiConfidence: dto.aiConfidence ?? undefined,
  };
}

export function mapEscalation(dto?: EscalationSummaryDto | null): EscalationDetails {
  if (!dto) {
    return { isEscalated: false, triggerPhrases: [], acknowledged: false };
  }
  return {
    isEscalated: Boolean(dto.isEscalated),
    reason: (dto.reason as EscalationDetails['reason']) || undefined,
    triggerPhrases: dto.triggerPhrases || [],
    acknowledged: Boolean(dto.acknowledged),
    escalatedAt: dto.escalatedAt || undefined,
  };
}

export function mapClassification(
  dto?: ClassificationDto | null,
  ticket?: { category?: string | null; priority?: string | null; sentiment?: string | null }
): AIClassification {
  return {
    category: asCategory(dto?.category || ticket?.category),
    subcategory: dto?.subcategory || `${asCategory(dto?.category || ticket?.category)} Inquiry`,
    urgency: asPriority(dto?.urgency || ticket?.priority),
    sentiment: asSentiment(dto?.sentiment || ticket?.sentiment),
    language: dto?.language || 'English',
    confidence: typeof dto?.confidence === 'number' ? dto.confidence : 0.85,
    humanCorrected: Boolean(dto?.humanCorrected),
  };
}

export function mapTicketSummaryToTicket(dto: TicketSummaryDto): Ticket {
  const category = asCategory(dto.category);
  const priority = asPriority(dto.priority);
  const sentiment = asSentiment(dto.sentiment);

  return {
    id: dto.id,
    ticketNumber: dto.ticketNumber || `#TK-${dto.id.slice(0, 5)}`,
    subject: dto.subject || 'Untitled ticket',
    customer: mapCustomer(undefined, {
      name: dto.customerName,
      email: dto.customerEmail,
    }),
    status: asStatus(dto.status),
    priority,
    category,
    sentiment,
    assignedTeam: asTeam(dto.assignedTeam),
    createdAt: dto.createdAt || new Date().toISOString(),
    updatedAt: dto.updatedAt || dto.createdAt || new Date().toISOString(),
    slaDueIn: formatSlaDueIn(dto.slaDueAt),
    escalation: { isEscalated: false, triggerPhrases: [], acknowledged: false },
    aiClassification: {
      category,
      subcategory: `${category} Inquiry`,
      urgency: priority,
      sentiment,
      language: 'English',
      confidence: 0.85,
    },
    customerIntent: dto.body ? dto.body.slice(0, 180) : `Customer inquiry about ${dto.subject || 'support'}.`,
    extractedEntities: [
      ...(dto.customerEmail ? [{ key: 'Email', value: dto.customerEmail }] : []),
      ...(dto.channel ? [{ key: 'Channel', value: dto.channel }] : []),
    ],
    kbSources: [],
    similarTickets: [],
    messages: dto.body
      ? [
          {
            id: `seed-${dto.id}`,
            senderType: 'customer',
            senderName: dto.customerName || 'Customer',
            content: dto.body,
            timestamp: formatRelativeTimestamp(dto.createdAt),
          },
        ]
      : [],
  };
}

export function mapTicketDetailToTicket(dto: TicketDetailDto): Ticket {
  const ticket = dto.ticket;
  const category = asCategory(ticket.category || dto.aiClassification?.category);
  const priority = asPriority(ticket.priority || dto.aiClassification?.urgency);
  const sentiment = asSentiment(ticket.sentiment || dto.aiClassification?.sentiment);
  const classification = mapClassification(dto.aiClassification, ticket);
  const entities = mapEntities(dto.aiClassification?.entities);

  return {
    id: ticket.id,
    ticketNumber: ticket.ticketNumber || `#TK-${ticket.id.slice(0, 5)}`,
    subject: ticket.subject || 'Untitled ticket',
    customer: mapCustomer(dto.customer),
    status: asStatus(ticket.status),
    priority,
    category,
    sentiment,
    assignedTeam: asTeam(ticket.assignedTeam),
    createdAt: ticket.createdAt || new Date().toISOString(),
    updatedAt: ticket.updatedAt || ticket.createdAt || new Date().toISOString(),
    slaDueIn: formatSlaDueIn(ticket.slaDueAt),
    escalation: mapEscalation(dto.escalation),
    aiClassification: classification,
    customerIntent:
      dto.aiClassification?.intentSummary ||
      ticket.body?.slice(0, 180) ||
      `Customer inquiry about ${ticket.subject || 'support'}.`,
    extractedEntities:
      entities.length > 0
        ? entities
        : [
            ...(dto.customer?.email ? [{ key: 'Email', value: dto.customer.email }] : []),
            ...(ticket.channel ? [{ key: 'Channel', value: ticket.channel }] : []),
          ],
    kbSources: [],
    similarTickets: [],
    messages: (dto.messages || []).map(mapMessage),
  };
}

export function mapKbArticle(dto: KBArticleDto): KBArticle {
  return {
    id: dto.id,
    title: dto.title || 'Untitled article',
    slug: dto.slug || dto.id,
    category: asKbCategory(typeof dto.category === 'string' ? dto.category : undefined),
    tags: Array.isArray(dto.tags) ? dto.tags : [],
    content: dto.content || '',
    summary: dto.summary || '',
    status: asIndexStatus(typeof dto.status === 'string' ? dto.status : undefined),
    lastIndexed: dto.lastIndexed || '',
    lastUpdated: dto.lastUpdated || new Date().toISOString(),
    chunksCount: dto.chunksCount ?? 0,
    embeddingModel: dto.embeddingModel || 'text-embedding-004',
    viewCount: dto.viewCount ?? 0,
    helpfulVotes: dto.helpfulVotes ?? 0,
    aiUsageCount: dto.aiUsageCount ?? 0,
  };
}

export function mapRoutingRule(dto: RoutingRuleDto): RoutingRule {
  const actions = (dto.actions || {}) as Partial<RuleAction> & Record<string, unknown>;
  const conditions = Array.isArray(dto.conditions) ? (dto.conditions as RuleCondition[]) : [];

  return {
    id: dto.id,
    name: dto.name || 'Untitled rule',
    description: dto.description || '',
    order: typeof dto.order === 'number' ? dto.order : 1,
    enabled: dto.enabled !== false,
    matchType: (dto.matchType as RuleMatchType) === 'ANY' ? 'ANY' : 'ALL',
    conditions,
    actions: {
      assignToTeam: asTeam(typeof actions.assignToTeam === 'string' ? actions.assignToTeam : undefined),
      setPriority: asPriority(typeof actions.setPriority === 'string' ? actions.setPriority : undefined),
      autoTag: typeof actions.autoTag === 'string' ? actions.autoTag : undefined,
      notifyEscalationManager: Boolean(actions.notifyEscalationManager),
      flagEscalation: Boolean(actions.flagEscalation),
      escalationReason: typeof actions.escalationReason === 'string' ? actions.escalationReason : undefined,
      slaTargetMinutes:
        typeof actions.slaTargetMinutes === 'number' ? actions.slaTargetMinutes : undefined,
    },
    matchesLast30Days: dto.matchesLast30Days ?? 0,
    lastTriggered: dto.lastTriggered ? formatRelativeTimestamp(dto.lastTriggered) : undefined,
  };
}
