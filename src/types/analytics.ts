export interface MetricData {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  isPositive: boolean;
  timeframe: string;
  sparkline: number[];
  subtext?: string;
}

export interface VolumeDataPoint {
  date: string;
  Billing: number;
  Technical: number;
  Account: number;
  'Feature Request': number;
  Shipping: number;
  Other: number;
  Total: number;
}

export interface SentimentDataPoint {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export interface CategoryAccuracy {
  category: string;
  accuracy: number;
  totalTickets: number;
  misclassifications: number;
  status: 'good' | 'warning' | 'critical';
}

export interface DraftPerformance {
  status: string;
  count: number;
  percentage: number;
  color: string;
}

export interface EscalationReasonStat {
  reason: string;
  count: number;
  percentage: number;
}
