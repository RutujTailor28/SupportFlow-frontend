export type IndexingStatus = 'indexed' | 'processing' | 'failed' | 'draft' | 'archived';
export type KBCategory = 'Billing' | 'Technical' | 'Account' | 'Features' | 'Feature Request' | 'Shipping' | 'Security';

export interface KBArticle {
  id: string;
  title: string;
  slug: string;
  category: KBCategory;
  tags: string[];
  content: string;
  summary: string;
  status: IndexingStatus;
  lastIndexed: string;
  lastUpdated: string;
  chunksCount: number;
  embeddingModel: string;
  viewCount: number;
  helpfulVotes: number;
  aiUsageCount: number;
}

export interface ContentGap {
  id: string;
  topic: string;
  ticketCount: number;
  priority: 'Critical' | 'High' | 'Medium';
  sampleQueries: string[];
  suggestedCategory: string;
  description: string;
}
