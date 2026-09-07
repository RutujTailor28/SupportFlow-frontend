import { NextRequest, NextResponse } from 'next/server';
import { OpenRouterError } from '../../../services/ai/openrouter.service';

export function jsonError(err: unknown) {
  if (err instanceof OpenRouterError) {
    return NextResponse.json(
      { detail: err.message, code: err.code },
      { status: err.status }
    );
  }

  const message = err instanceof Error ? err.message : 'Unexpected AI error.';
  return NextResponse.json({ detail: message, code: 'AI_ERROR' }, { status: 500 });
}

export async function readJsonBody<T>(request: NextRequest): Promise<T> {
  try {
    return (await request.json()) as T;
  } catch {
    throw new OpenRouterError('Invalid JSON request body.', 'INVALID_REQUEST', 400);
  }
}
