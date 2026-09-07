import { TicketCategory, TicketPriority, TicketSentiment, TicketStatus } from '../../types/ticket';
import { IndexingStatus, KBCategory } from '../../types/knowledgeBase';
import { RuleAction, RuleCondition, RuleMatchType } from '../../types/routingRule';

export interface ApiErrorBody {
  code?: string;
  message?: string;
  fields?: unknown;
}

export interface ApiEnvelope<T> {
  success?: boolean;
  message?: string;
  count?: number;
  data?: T;
  detail?: string;
  error?: ApiErrorBody;
}

export interface TicketSummaryDto {
  id: string;
  ticketNumber?: string;
  customerName?: string;
  customerEmail?: string;
  subject?: string;
  body?: string;
  status?: string;
  priority?: string;
  channel?: string;
  category?: string | null;
  sentiment?: string | null;
  assignedTeam?: string | null;
  createdAt?: string;
  updatedAt?: string | null;
  slaDueAt?: string | null;
}

export interface CustomerDto {
  id: string;
  name?: string;
  email?: string;
  avatar?: string | null;
  company?: string | null;
  plan?: string;
  isVip?: boolean;
  joinedDate?: string | null;
  totalTickets?: number;
}

export interface MessageDto {
  id: string;
  senderType?: string;
  senderName?: string;
  senderAvatar?: string | null;
  content?: string;
  timestamp?: string;
  direction?: string;
  isAiGenerated?: boolean;
  aiConfidence?: number | null;
}

export interface ClassificationDto {
  id?: string;
  category?: string | null;
  subcategory?: string | null;
  urgency?: string | null;
  sentiment?: string | null;
  language?: string | null;
  intentSummary?: string | null;
  entities?: unknown;
  confidence?: number | null;
  humanCorrected?: boolean;
}

export interface EscalationRecordDto {
  id: string;
  ticketId?: string;
  reason?: string;
  triggerPhrases?: string[];
  acknowledged?: boolean;
  source?: string;
  notes?: string | null;
  escalatedAt?: string | null;
  acknowledgedAt?: string | null;
}

export interface EscalationSummaryDto {
  isEscalated?: boolean;
  reason?: string | null;
  triggerPhrases?: string[];
  acknowledged?: boolean;
  escalatedAt?: string | null;
}

export interface TicketDetailDto {
  ticket: {
    id: string;
    ticketNumber?: string;
    subject?: string;
    body?: string;
    status?: string;
    priority?: string;
    channel?: string;
    category?: string | null;
    sentiment?: string | null;
    assignedTeam?: string | null;
    assignedAgentId?: string | null;
    createdAt?: string;
    updatedAt?: string | null;
    slaDueAt?: string | null;
  };
  customer: CustomerDto;
  messages?: MessageDto[];
  aiClassification?: ClassificationDto | null;
  escalation?: EscalationSummaryDto | null;
  escalations?: EscalationRecordDto[];
}

export interface TicketCreatePayload {
  customerName: string;
  customerEmail: string;
  subject: string;
  body: string;
  channel?: 'web' | 'email' | 'chat' | 'phone' | 'api';
}

export interface TicketUpdatePayload {
  status?: TicketStatus;
  priority?: TicketPriority;
  assignedTeam?: string;
}

export interface MessageCreatePayload {
  direction: 'in' | 'out';
  author: string;
  body: string;
  senderType?: 'customer' | 'agent' | 'system' | 'ai';
  senderAvatar?: string;
  isAiGenerated?: boolean;
  aiConfidence?: number;
}

export interface ClassificationUpdatePayload {
  category?: TicketCategory;
  subcategory?: string;
  urgency?: TicketPriority;
  sentiment?: TicketSentiment;
  language?: string;
  intentSummary?: string;
  entities?: { key: string; value: string }[];
  confidence?: number;
  humanCorrected?: boolean;
  notes?: string;
}

export interface EscalationCreatePayload {
  reason: string;
  triggerPhrases?: string[];
  notes?: string;
  source?: 'manual' | 'ai' | 'rule' | 'detection';
}

export interface KBArticleDto {
  id: string;
  title?: string;
  slug?: string;
  category?: KBCategory | string;
  tags?: string[];
  content?: string;
  summary?: string;
  status?: IndexingStatus | string;
  lastIndexed?: string | null;
  lastUpdated?: string | null;
  chunksCount?: number;
  embeddingModel?: string;
  viewCount?: number;
  helpfulVotes?: number;
  aiUsageCount?: number;
}

export interface KBArticleWritePayload {
  title: string;
  slug?: string;
  category: KBCategory;
  tags?: string[];
  content: string;
  summary?: string;
  status?: IndexingStatus;
}

export interface RoutingRuleDto {
  id: string;
  name?: string;
  description?: string;
  order?: number;
  enabled?: boolean;
  matchType?: RuleMatchType | string;
  conditions?: RuleCondition[];
  actions?: Partial<RuleAction> & Record<string, unknown>;
  matchesLast30Days?: number;
  lastTriggered?: string | null;
}

export interface RoutingRuleWritePayload {
  name: string;
  description?: string;
  order?: number;
  enabled?: boolean;
  matchType?: RuleMatchType;
  conditions: RuleCondition[];
  actions: RuleAction;
}

export interface DatabaseTestDto {
  success?: boolean;
  database?: string;
  error?: ApiErrorBody;
}

export interface SchemaTestDto {
  success?: boolean;
  schema?: string;
  tables?: Record<string, boolean>;
  message?: string;
  hint?: string;
}

export interface HealthDto {
  success?: boolean;
  status?: string;
  service?: string;
  message?: string;
}
