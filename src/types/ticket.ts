export type TicketStatus = 'new' | 'open' | 'pending' | 'resolved' | 'closed';

export type TicketPriority = 'critical' | 'high' | 'normal' | 'low';

export type TicketCategory = 
  | 'Billing'
  | 'Technical'
  | 'Account'
  | 'Feature Request'
  | 'Shipping'
  | 'Security'
  | 'Other';

export type TicketSentiment = 'positive' | 'neutral' | 'negative' | 'very_negative';

export type SupportTeam = 
  | 'Finance Team'
  | 'Engineering'
  | 'Tier 1 Support'
  | 'Tier 2 Support'
  | 'Account Management'
  | 'Security & Compliance'
  | 'Product Team';

export interface Customer {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  company?: string;
  plan: 'Free' | 'Pro' | 'Enterprise';
  isVip?: boolean;
  totalTickets: number;
  joinedDate: string;
}

export interface Message {
  id: string;
  senderType: 'customer' | 'agent' | 'system' | 'ai';
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  attachments?: { name: string; size: string; url?: string }[];
  isAiGenerated?: boolean;
  aiConfidence?: number;
}

export interface EscalationDetails {
  isEscalated: boolean;
  reason?: 'Churn Risk Detected' | 'Legal Language' | 'SLA Risk' | 'Repeat Contact' | 'Executive Escalation' | 'Security Threat';
  triggerPhrases?: string[];
  acknowledged?: boolean;
  escalatedAt?: string;
}

export interface AIClassification {
  category: TicketCategory;
  subcategory: string;
  urgency: TicketPriority;
  sentiment: TicketSentiment;
  language: string;
  confidence: number;
  humanCorrected?: boolean;
}

export interface KBSourceRef {
  id: string;
  title: string;
  snippet: string;
  relevance: number;
  category: string;
}

export interface SimilarTicket {
  id: string;
  ticketNumber: string;
  title: string;
  similarity: number;
  resolution: string;
  resolvedDate: string;
}

export interface Ticket {
  id: string;
  ticketNumber: string; // e.g. #TK-48291
  subject: string;
  customer: Customer;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  sentiment: TicketSentiment;
  assignedTeam: SupportTeam;
  assignedAgent?: {
    name: string;
    avatar: string;
  };
  createdAt: string;
  updatedAt: string;
  slaDueIn?: string;
  escalation: EscalationDetails;
  aiClassification: AIClassification;
  customerIntent: string;
  /** Optional AI-generated agent-facing summary of the ticket thread. */
  aiSummary?: string;
  extractedEntities: {
    key: string;
    value: string;
  }[];
  kbSources: KBSourceRef[];
  similarTickets: SimilarTicket[];
  messages: Message[];
  suggestedDrafts?: {
    friendly: string;
    formal: string;
    concise: string;
  };
}
