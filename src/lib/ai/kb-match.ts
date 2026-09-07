import type { KBArticle } from '../../types/knowledgeBase';
import type { KBSourceRef } from '../../types/ticket';

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 2);
}

/**
 * Lightweight local relevance matching over mock/local KB articles.
 * No embeddings / backend RAG required.
 */
export function findRelevantKbArticles(
  query: string,
  articles: KBArticle[],
  limit = 3
): Array<KBArticle & { relevance: number }> {
  const queryTokens = new Set(tokenize(query));
  if (queryTokens.size === 0) {
    return articles
      .filter((article) => article.status === 'indexed')
      .slice(0, limit)
      .map((article, index) => ({ ...article, relevance: Math.max(0.55, 0.8 - index * 0.08) }));
  }

  const ranked = articles
    .filter((article) => article.status === 'indexed' || article.status === 'draft')
    .map((article) => {
      const haystack = tokenize(
        `${article.title} ${article.summary} ${article.category} ${article.tags.join(' ')} ${article.content.slice(0, 1200)}`
      );
      let hits = 0;
      for (const token of haystack) {
        if (queryTokens.has(token)) hits += 1;
      }
      const relevance = Math.min(0.99, hits / Math.max(queryTokens.size, 1));
      return { ...article, relevance };
    })
    .filter((article) => article.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance);

  if (ranked.length === 0) {
    return articles
      .filter((article) => article.status === 'indexed')
      .slice(0, limit)
      .map((article, index) => ({ ...article, relevance: Math.max(0.4, 0.65 - index * 0.08) }));
  }

  return ranked.slice(0, limit);
}

export function toKbSourceRefs(
  articles: Array<KBArticle & { relevance: number }>
): KBSourceRef[] {
  return articles.map((article) => ({
    id: article.id,
    title: article.title,
    snippet: article.summary,
    relevance: article.relevance,
    category: article.category,
  }));
}
