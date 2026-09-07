import { apiRequest } from './client';
import { KBArticleDto, KBArticleWritePayload } from './types';
import { mapKbArticle } from './mappers';
import { KBArticle } from '../../types/knowledgeBase';

export async function listKbArticles(params?: {
  category?: string;
  status?: string;
  search?: string;
}): Promise<KBArticle[]> {
  const query = new URLSearchParams();
  if (params?.category) query.set('category', params.category);
  if (params?.status) query.set('status', params.status);
  if (params?.search) query.set('search', params.search);
  const qs = query.toString();
  const data = await apiRequest<KBArticleDto[]>(`/kb-articles${qs ? `?${qs}` : ''}`);
  return (Array.isArray(data) ? data : []).map(mapKbArticle);
}

export async function getKbArticle(articleId: string): Promise<KBArticle> {
  const data = await apiRequest<KBArticleDto>(`/kb-articles/${articleId}`);
  return mapKbArticle(data);
}

export async function createKbArticle(payload: KBArticleWritePayload): Promise<KBArticle> {
  const data = await apiRequest<KBArticleDto>('/kb-articles', { method: 'POST', body: payload });
  return mapKbArticle(data);
}

export async function updateKbArticle(
  articleId: string,
  payload: Partial<KBArticleWritePayload>
): Promise<KBArticle> {
  const data = await apiRequest<KBArticleDto>(`/kb-articles/${articleId}`, {
    method: 'PUT',
    body: payload,
  });
  return mapKbArticle(data);
}

export async function deleteKbArticle(articleId: string): Promise<void> {
  await apiRequest(`/kb-articles/${articleId}`, { method: 'DELETE' });
}
