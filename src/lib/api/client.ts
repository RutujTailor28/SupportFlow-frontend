import { API_BASE_URL, API_V1_PREFIX } from '../config';
import { ApiEnvelope } from './types';

export class ApiError extends Error {
  status: number;
  code?: string;
  fields?: unknown;

  constructor(message: string, status: number, code?: string, fields?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  signal?: AbortSignal;
};

function buildUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (normalized.startsWith('/api/') || normalized === '/health' || normalized === '/') {
    return `${API_BASE_URL}${normalized}`;
  }
  return `${API_BASE_URL}${API_V1_PREFIX}${normalized}`;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, signal } = options;

  let response: Response;
  try {
    response = await fetch(buildUrl(path), {
      method,
      headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (err) {
    const message =
      err instanceof Error && err.name === 'AbortError'
        ? 'Request was cancelled'
        : 'Unable to reach the API. Check that the backend is running and NEXT_PUBLIC_API_URL is correct.';
    throw new ApiError(message, 0, 'NETWORK_ERROR');
  }

  let payload: ApiEnvelope<T> | null = null;
  const text = await response.text();
  if (text) {
    try {
      payload = JSON.parse(text) as ApiEnvelope<T>;
    } catch {
      throw new ApiError('Received an invalid JSON response from the API.', response.status, 'INVALID_JSON');
    }
  }

  if (!response.ok) {
    const message =
      payload?.error?.message ||
      payload?.detail ||
      payload?.message ||
      `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status, payload?.error?.code, payload?.error?.fields);
  }

  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload.data as T) ?? (null as T);
  }

  return (payload as unknown as T) ?? (null as T);
}

export async function apiRequestRaw<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, signal } = options;

  let response: Response;
  try {
    response = await fetch(buildUrl(path), {
      method,
      headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch {
    throw new ApiError(
      'Unable to reach the API. Check that the backend is running and NEXT_PUBLIC_API_URL is correct.',
      0,
      'NETWORK_ERROR'
    );
  }

  const text = await response.text();
  let payload: T | null = null;
  if (text) {
    try {
      payload = JSON.parse(text) as T;
    } catch {
      throw new ApiError('Received an invalid JSON response from the API.', response.status, 'INVALID_JSON');
    }
  }

  if (!response.ok) {
    const envelope = payload as ApiEnvelope<unknown> | null;
    const message =
      envelope?.error?.message ||
      envelope?.detail ||
      envelope?.message ||
      `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status, envelope?.error?.code, envelope?.error?.fields);
  }

  return payload as T;
}
