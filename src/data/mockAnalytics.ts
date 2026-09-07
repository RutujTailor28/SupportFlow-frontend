import {
  MetricData,
  VolumeDataPoint,
  SentimentDataPoint,
  CategoryAccuracy,
  DraftPerformance,
  EscalationReasonStat,
} from '../types/analytics';

export const mockDashboardMetrics: Record<string, MetricData[]> = {
  '7d': [
    {
      title: 'Total Tickets',
      value: '614',
      change: '↑ 14.2% vs last week',
      trend: 'up',
      isPositive: true,
      timeframe: 'Last 7 days',
      sparkline: [75, 82, 90, 84, 98, 92, 93],
    },
    {
      title: 'Average Response Time',
      value: '16.4 min',
      change: '↓ 11.5%',
      trend: 'down',
      isPositive: true,
      timeframe: 'Last 7 days',
      sparkline: [22, 20, 19, 18, 17, 17, 16],
    },
    {
      title: 'AI Draft Acceptance',
      value: '81.2%',
      change: '↑ 5.4%',
      trend: 'up',
      isPositive: true,
      timeframe: 'Last 7 days',
      sparkline: [72, 74, 76, 78, 79, 80, 81],
    },
    {
      title: 'Escalation Rate',
      value: '3.8%',
      change: '↓ 1.8%',
      trend: 'down',
      isPositive: true,
      timeframe: 'Last 7 days',
      sparkline: [5.2, 4.8, 4.5, 4.1, 4.0, 3.9, 3.8],
    },
  ],
  '30d': [
    {
      title: 'Total Tickets',
      value: '2,458',
      change: '↑ 12.5% vs last month',
      trend: 'up',
      isPositive: true,
      timeframe: 'Last 30 days',
      sparkline: [65, 70, 68, 75, 80, 85, 90, 95, 88, 92, 98, 104],
    },
    {
      title: 'Average Response Time',
      value: '18 min',
      change: '↓ 8.2%',
      trend: 'down',
      isPositive: true,
      timeframe: 'Last 30 days',
      sparkline: [26, 24, 23, 21, 20, 19, 19, 18, 18, 18, 18, 18],
    },
    {
      title: 'AI Draft Acceptance',
      value: '78.4%',
      change: '↑ 6.1%',
      trend: 'up',
      isPositive: true,
      timeframe: 'Last 30 days',
      sparkline: [68, 70, 71, 73, 75, 76, 76, 77, 78, 78, 78.4, 78.4],
    },
    {
      title: 'Escalation Rate',
      value: '4.2%',
      change: '↓ 1.4%',
      trend: 'down',
      isPositive: true,
      timeframe: 'Last 30 days',
      sparkline: [6.1, 5.8, 5.5, 5.2, 4.9, 4.7, 4.5, 4.4, 4.3, 4.2, 4.2, 4.2],
    },
  ],
  '90d': [
    {
      title: 'Total Tickets',
      value: '7,890',
      change: '↑ 18.0% vs prior quarter',
      trend: 'up',
      isPositive: true,
      timeframe: 'Last 90 days',
      sparkline: [50, 55, 62, 70, 78, 85, 92, 98, 105, 110, 115, 120],
    },
    {
      title: 'Average Response Time',
      value: '21 min',
      change: '↓ 14.5%',
      trend: 'down',
      isPositive: true,
      timeframe: 'Last 90 days',
      sparkline: [32, 30, 28, 26, 24, 23, 22, 21, 21, 21, 21, 21],
    },
    {
      title: 'AI Draft Acceptance',
      value: '74.8%',
      change: '↑ 12.3%',
      trend: 'up',
      isPositive: true,
      timeframe: 'Last 90 days',
      sparkline: [58, 62, 65, 67, 70, 72, 73, 74, 74, 74.5, 74.8, 74.8],
    },
    {
      title: 'Escalation Rate',
      value: '4.8%',
      change: '↓ 2.6%',
      trend: 'down',
      isPositive: true,
      timeframe: 'Last 90 days',
      sparkline: [7.8, 7.2, 6.8, 6.4, 5.9, 5.5, 5.2, 5.0, 4.9, 4.8, 4.8, 4.8],
    },
  ],
};

export const mockTicketVolumeData: VolumeDataPoint[] = [
  { date: 'Aug 24', Billing: 28, Technical: 42, Account: 24, 'Feature Request': 14, Shipping: 8, Other: 4, Total: 120 },
  { date: 'Aug 25', Billing: 32, Technical: 46, Account: 28, 'Feature Request': 16, Shipping: 10, Other: 6, Total: 138 },
  { date: 'Aug 26', Billing: 36, Technical: 50, Account: 30, 'Feature Request': 15, Shipping: 9, Other: 5, Total: 145 },
  { date: 'Aug 27', Billing: 30, Technical: 44, Account: 26, 'Feature Request': 18, Shipping: 12, Other: 6, Total: 136 },
  { date: 'Aug 28', Billing: 40, Technical: 58, Account: 34, 'Feature Request': 20, Shipping: 11, Other: 7, Total: 170 },
  { date: 'Aug 29', Billing: 44, Technical: 62, Account: 38, 'Feature Request': 22, Shipping: 14, Other: 8, Total: 188 },
  { date: 'Aug 30', Billing: 22, Technical: 30, Account: 18, 'Feature Request': 10, Shipping: 6, Other: 4, Total: 90 },
  { date: 'Aug 31', Billing: 24, Technical: 32, Account: 20, 'Feature Request': 12, Shipping: 7, Other: 3, Total: 98 },
  { date: 'Sep 01', Billing: 48, Technical: 68, Account: 40, 'Feature Request': 25, Shipping: 15, Other: 9, Total: 205 },
];

export const mockSentimentDistribution: SentimentDataPoint[] = [
  { name: 'Positive', value: 442, percentage: 18, color: '#10B981' },
  { name: 'Neutral', value: 1032, percentage: 42, color: '#64748B' },
  { name: 'Negative', value: 688, percentage: 28, color: '#F59E0B' },
  { name: 'Very Negative', value: 296, percentage: 12, color: '#EF4444' },
];

export const mockCategoryAccuracies: CategoryAccuracy[] = [
  { category: 'Billing', accuracy: 96.4, totalTickets: 680, misclassifications: 24, status: 'good' },
  { category: 'Shipping', accuracy: 94.2, totalTickets: 210, misclassifications: 12, status: 'good' },
  { category: 'Account', accuracy: 91.8, totalTickets: 540, misclassifications: 44, status: 'good' },
  { category: 'Security', accuracy: 98.0, totalTickets: 95, misclassifications: 2, status: 'good' },
  { category: 'Feature Request', accuracy: 88.5, totalTickets: 290, misclassifications: 33, status: 'warning' },
  { category: 'Technical', accuracy: 82.1, totalTickets: 820, misclassifications: 146, status: 'critical' },
];

export const mockDraftPerformances: DraftPerformance[] = [
  { status: 'Accepted As-Is', count: 1598, percentage: 65, color: '#6366F1' },
  { status: 'Edited by Agent', count: 614, percentage: 25, color: '#0EA5E9' },
  { status: 'Discarded', count: 246, percentage: 10, color: '#94A3B8' },
];

export const mockEscalationReasons: EscalationReasonStat[] = [
  { reason: 'Churn Risk Detected', count: 48, percentage: 46 },
  { reason: 'Legal / Compliance Language', count: 24, percentage: 23 },
  { reason: 'SLA Breach Threat', count: 18, percentage: 17 },
  { reason: 'Repeat Contact (>3 attempts)', count: 14, percentage: 14 },
];

export const mockSentimentTrend = [
  { date: 'Week 1', positive: 20, neutral: 45, negative: 25, very_negative: 10 },
  { date: 'Week 2', positive: 22, neutral: 43, negative: 24, very_negative: 11 },
  { date: 'Week 3', positive: 19, neutral: 42, negative: 27, very_negative: 12 },
  { date: 'Week 4', positive: 24, neutral: 44, negative: 22, very_negative: 10 },
];

export const mockAIUsageStats = {
  averageCostPerTicket: '$0.024',
  totalAiCostMonthly: '$58.92',
  totalTokensProcessed: '14.2M tokens',
  costSavedEstimated: '$4,120 / mo',
  avgLatencyMs: 420,
};
