import { Ticket } from '../types/ticket';
import { KBArticle, ContentGap } from '../types/knowledgeBase';
import {
  MetricData,
  VolumeDataPoint,
  SentimentDataPoint,
  CategoryAccuracy,
  DraftPerformance,
  EscalationReasonStat,
} from '../types/analytics';

export type AnalyticsTimeframe = '7d' | '30d' | '90d';

const DAY_MS = 86_400_000;

function timeframeDays(timeframe: AnalyticsTimeframe): number {
  if (timeframe === '7d') return 7;
  if (timeframe === '90d') return 90;
  return 30;
}

function timeframeLabel(timeframe: AnalyticsTimeframe): string {
  if (timeframe === '7d') return 'Last 7 days';
  if (timeframe === '90d') return 'Last 90 days';
  return 'Last 30 days';
}

function inWindow(iso: string, days: number): boolean {
  const ts = new Date(iso).getTime();
  if (Number.isNaN(ts)) return true;
  return ts >= Date.now() - days * DAY_MS;
}

function filterTickets(tickets: Ticket[], timeframe: AnalyticsTimeframe): Ticket[] {
  const days = timeframeDays(timeframe);
  return tickets.filter((t) => inWindow(t.createdAt, days));
}

function pct(part: number, whole: number): number {
  if (whole <= 0) return 0;
  return Math.round((part / whole) * 1000) / 10;
}

function buildSparkline(values: number[]): number[] {
  if (values.length === 0) return [0, 0, 0, 0, 0, 0, 0];
  return values;
}

function dayKey(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 'Unknown';
  return d.toLocaleDateString(undefined, { month: 'short', day: '2-digit' });
}

export function deriveDashboardMetrics(
  tickets: Ticket[],
  timeframe: AnalyticsTimeframe
): MetricData[] {
  const scoped = filterTickets(tickets, timeframe);
  const total = scoped.length;
  const escalated = scoped.filter((t) => t.escalation.isEscalated).length;
  const corrected = scoped.filter((t) => t.aiClassification.humanCorrected).length;
  const withConfidence = scoped.filter((t) => typeof t.aiClassification.confidence === 'number');
  const avgConfidence =
    withConfidence.length > 0
      ? withConfidence.reduce((sum, t) => sum + t.aiClassification.confidence, 0) /
        withConfidence.length
      : 0;

  // Approximate "draft acceptance" from non-discarded AI confidence / non-corrected ratio
  const draftAcceptance = total > 0 ? Math.max(0, 100 - pct(corrected, total) * 0.6) : 0;
  const escalationRate = pct(escalated, total);
  const label = timeframeLabel(timeframe);

  // Simple sparkline: tickets per day for the window (up to 12 buckets)
  const days = timeframeDays(timeframe);
  const bucketCount = Math.min(days, 12);
  const sparkTickets: number[] = [];
  for (let i = bucketCount - 1; i >= 0; i -= 1) {
    const start = Date.now() - (i + 1) * (days / bucketCount) * DAY_MS;
    const end = Date.now() - i * (days / bucketCount) * DAY_MS;
    sparkTickets.push(
      scoped.filter((t) => {
        const ts = new Date(t.createdAt).getTime();
        return ts >= start && ts < end;
      }).length
    );
  }

  return [
    {
      title: 'Total Tickets',
      value: String(total),
      change: total === 0 ? 'No tickets in range' : `From live API data`,
      trend: total > 0 ? 'up' : 'neutral',
      isPositive: true,
      timeframe: label,
      sparkline: buildSparkline(sparkTickets),
    },
    {
      title: 'Average AI Confidence',
      value: total === 0 ? '—' : `${(avgConfidence * 100).toFixed(1)}%`,
      change: `${withConfidence.length} classified`,
      trend: avgConfidence >= 0.8 ? 'up' : 'neutral',
      isPositive: avgConfidence >= 0.7,
      timeframe: label,
      sparkline: buildSparkline(sparkTickets.map((n) => Math.round(avgConfidence * 100) || n)),
    },
    {
      title: 'AI Draft Acceptance',
      value: total === 0 ? '—' : `${draftAcceptance.toFixed(1)}%`,
      change: `${corrected} human corrections`,
      trend: draftAcceptance >= 70 ? 'up' : 'down',
      isPositive: draftAcceptance >= 70,
      timeframe: label,
      sparkline: buildSparkline(sparkTickets.map(() => Math.round(draftAcceptance))),
    },
    {
      title: 'Escalation Rate',
      value: total === 0 ? '—' : `${escalationRate}%`,
      change: `${escalated} escalated`,
      trend: escalationRate <= 10 ? 'down' : 'up',
      isPositive: escalationRate <= 10,
      timeframe: label,
      sparkline: buildSparkline(
        sparkTickets.map((n, idx) => {
          const sliceStart = Date.now() - (bucketCount - idx) * (days / bucketCount) * DAY_MS;
          const sliceEnd = Date.now() - (bucketCount - idx - 1) * (days / bucketCount) * DAY_MS;
          const slice = scoped.filter((t) => {
            const ts = new Date(t.createdAt).getTime();
            return ts >= sliceStart && ts < sliceEnd;
          });
          return pct(slice.filter((t) => t.escalation.isEscalated).length, slice.length || 1);
        })
      ),
    },
  ];
}

export function deriveTicketVolume(tickets: Ticket[], timeframe: AnalyticsTimeframe): VolumeDataPoint[] {
  const scoped = filterTickets(tickets, timeframe);
  const days = Math.min(timeframeDays(timeframe), 14);
  const points: VolumeDataPoint[] = [];

  for (let i = days - 1; i >= 0; i -= 1) {
    const dayStart = new Date();
    dayStart.setHours(0, 0, 0, 0);
    dayStart.setDate(dayStart.getDate() - i);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const dayTickets = scoped.filter((t) => {
      const ts = new Date(t.createdAt).getTime();
      return ts >= dayStart.getTime() && ts < dayEnd.getTime();
    });

    const point: VolumeDataPoint = {
      date: dayKey(dayStart.toISOString()),
      Billing: 0,
      Technical: 0,
      Account: 0,
      'Feature Request': 0,
      Shipping: 0,
      Other: 0,
      Total: dayTickets.length,
    };

    dayTickets.forEach((t) => {
      if (t.category === 'Billing') point.Billing += 1;
      else if (t.category === 'Technical') point.Technical += 1;
      else if (t.category === 'Account') point.Account += 1;
      else if (t.category === 'Feature Request') point['Feature Request'] += 1;
      else if (t.category === 'Shipping') point.Shipping += 1;
      else point.Other += 1;
    });

    points.push(point);
  }

  return points;
}

export function deriveSentimentDistribution(tickets: Ticket[]): SentimentDataPoint[] {
  const counts = {
    Positive: 0,
    Neutral: 0,
    Negative: 0,
    'Very Negative': 0,
  };

  tickets.forEach((t) => {
    if (t.sentiment === 'positive') counts.Positive += 1;
    else if (t.sentiment === 'negative') counts.Negative += 1;
    else if (t.sentiment === 'very_negative') counts['Very Negative'] += 1;
    else counts.Neutral += 1;
  });

  const total = tickets.length || 1;
  return [
    { name: 'Positive', value: counts.Positive, percentage: pct(counts.Positive, total), color: '#10B981' },
    { name: 'Neutral', value: counts.Neutral, percentage: pct(counts.Neutral, total), color: '#64748B' },
    { name: 'Negative', value: counts.Negative, percentage: pct(counts.Negative, total), color: '#F59E0B' },
    {
      name: 'Very Negative',
      value: counts['Very Negative'],
      percentage: pct(counts['Very Negative'], total),
      color: '#EF4444',
    },
  ];
}

export function deriveCategoryAccuracies(tickets: Ticket[]): CategoryAccuracy[] {
  const groups = new Map<string, { total: number; corrected: number }>();

  tickets.forEach((t) => {
    const key = t.category || 'Other';
    const current = groups.get(key) || { total: 0, corrected: 0 };
    current.total += 1;
    if (t.aiClassification.humanCorrected) current.corrected += 1;
    groups.set(key, current);
  });

  return Array.from(groups.entries())
    .map(([category, stats]) => {
      const accuracy = Math.max(0, 100 - pct(stats.corrected, stats.total));
      return {
        category,
        accuracy,
        totalTickets: stats.total,
        misclassifications: stats.corrected,
        status: (accuracy >= 90 ? 'good' : accuracy >= 80 ? 'warning' : 'critical') as
          | 'good'
          | 'warning'
          | 'critical',
      };
    })
    .sort((a, b) => b.totalTickets - a.totalTickets);
}

export function deriveDraftPerformance(tickets: Ticket[]): DraftPerformance[] {
  const corrected = tickets.filter((t) => t.aiClassification.humanCorrected).length;
  const highConfidence = tickets.filter(
    (t) => !t.aiClassification.humanCorrected && t.aiClassification.confidence >= 0.85
  ).length;
  const edited = Math.max(0, tickets.length - corrected - highConfidence);
  const total = tickets.length || 1;

  return [
    {
      status: 'Accepted As-Is',
      count: highConfidence,
      percentage: pct(highConfidence, total),
      color: '#6366F1',
    },
    {
      status: 'Edited by Agent',
      count: edited,
      percentage: pct(edited, total),
      color: '#0EA5E9',
    },
    {
      status: 'Discarded',
      count: corrected,
      percentage: pct(corrected, total),
      color: '#94A3B8',
    },
  ];
}

export function deriveEscalationReasons(tickets: Ticket[]): EscalationReasonStat[] {
  const escalated = tickets.filter((t) => t.escalation.isEscalated);
  const counts = new Map<string, number>();

  escalated.forEach((t) => {
    const reason = t.escalation.reason || 'Executive Escalation';
    counts.set(reason, (counts.get(reason) || 0) + 1);
  });

  const total = escalated.length || 1;
  return Array.from(counts.entries())
    .map(([reason, count]) => ({
      reason,
      count,
      percentage: pct(count, total),
    }))
    .sort((a, b) => b.count - a.count);
}

export function deriveAiPerformance(tickets: Ticket[]): {
  classificationAccuracy: number;
  draftAcceptance: number;
  averageConfidence: number;
} {
  if (tickets.length === 0) {
    return { classificationAccuracy: 0, draftAcceptance: 0, averageConfidence: 0 };
  }

  const corrected = tickets.filter((t) => t.aiClassification.humanCorrected).length;
  const classificationAccuracy = Math.max(0, 100 - pct(corrected, tickets.length));
  const draftAcceptance = Math.max(0, 100 - pct(corrected, tickets.length) * 0.6);
  const averageConfidence =
    (tickets.reduce((sum, t) => sum + (t.aiClassification.confidence || 0), 0) / tickets.length) *
    100;

  return {
    classificationAccuracy: Math.round(classificationAccuracy * 10) / 10,
    draftAcceptance: Math.round(draftAcceptance * 10) / 10,
    averageConfidence: Math.round(averageConfidence * 10) / 10,
  };
}

/** Infer KB gaps from ticket volume vs article coverage when no gaps API exists. */
export function deriveContentGaps(tickets: Ticket[], articles: KBArticle[]): ContentGap[] {
  const articleCategories = new Set(articles.map((a) => a.category));
  const byCategory = new Map<string, Ticket[]>();

  tickets.forEach((t) => {
    const list = byCategory.get(t.category) || [];
    list.push(t);
    byCategory.set(t.category, list);
  });

  const gaps: ContentGap[] = [];

  byCategory.forEach((categoryTickets, category) => {
    const hasCoverage = articleCategories.has(category as KBArticle['category']) ||
      articles.some((a) => a.tags.some((tag) => tag.toLowerCase().includes(category.toLowerCase())));

    // Gap if many tickets and weak/no article coverage
    if (categoryTickets.length < 2 && hasCoverage) return;
    if (hasCoverage && categoryTickets.length < 5) return;

    const sampleQueries = categoryTickets
      .slice(0, 3)
      .map((t) => t.subject)
      .filter(Boolean);

    const priority: ContentGap['priority'] =
      categoryTickets.length >= 8 ? 'Critical' : categoryTickets.length >= 4 ? 'High' : 'Medium';

    gaps.push({
      id: `gap-api-${category.toLowerCase().replace(/\s+/g, '-')}`,
      topic: `${category} support guidance`,
      ticketCount: categoryTickets.length,
      priority,
      sampleQueries:
        sampleQueries.length > 0 ? sampleQueries : [`How do I resolve ${category.toLowerCase()} issues?`],
      suggestedCategory: category,
      description: hasCoverage
        ? `High inbound volume in ${category} suggests expanding existing documentation.`
        : `No strong knowledge-base coverage found for ${category} tickets.`,
    });
  });

  return gaps.sort((a, b) => b.ticketCount - a.ticketCount).slice(0, 8);
}
