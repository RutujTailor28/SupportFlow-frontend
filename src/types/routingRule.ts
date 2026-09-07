import { SupportTeam, TicketCategory, TicketPriority } from './ticket';

export type RuleField = 'Category' | 'Urgency' | 'Sentiment' | 'CustomerPlan' | 'Subject' | 'Language';

export type RuleOperator = 'equals' | 'not_equals' | 'contains' | 'contains_any' | 'greater_than_or_equal' | 'in';

export interface RuleCondition {
  id: string;
  field: RuleField;
  operator: RuleOperator;
  value: string | string[];
}

export interface RuleAction {
  assignToTeam: SupportTeam;
  setPriority: TicketPriority;
  autoTag?: string;
  notifyEscalationManager?: boolean;
  flagEscalation?: boolean;
  escalationReason?: string;
  slaTargetMinutes?: number;
}

export type RuleMatchType = 'ALL' | 'ANY';

export interface RoutingRule {
  id: string;
  name: string;
  description: string;
  order: number;
  enabled: boolean;
  matchType: RuleMatchType;
  conditions: RuleCondition[];
  actions: RuleAction;
  matchesLast30Days: number;
  lastTriggered?: string;
}
