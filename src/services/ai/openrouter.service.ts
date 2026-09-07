import {
  getOpenRouterApiKey,
  OPENROUTER_BASE_URL,
  OPENROUTER_MAX_TOKENS,
  OPENROUTER_MODEL,
  OPENROUTER_TEMPERATURE,
  OPENROUTER_FALLBACK_MODELS,
} from '../../config/ai.config';

export class OpenRouterError extends Error {
  code: string;
  status: number;

  constructor(message: string, code: string, status = 500) {
    super(message);
    this.name = 'OpenRouterError';
    this.code = code;
    this.status = status;
  }
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionOptions {
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  json?: boolean;
  model?: string;
}

interface OpenRouterChoice {
  finish_reason?: string | null;
  native_finish_reason?: string | null;
  text?: string | null;
  message?: {
    content?: string | Array<{ type?: string; text?: string }> | null;
    reasoning?: string | null;
    reasoning_content?: string | null;
    refusal?: string | null;
  };
}

interface OpenRouterResponse {
  id?: string;
  model?: string;
  choices?: OpenRouterChoice[];
  error?: { message?: string; code?: string | number };
}

function extractTextParts(
  content: string | Array<{ type?: string; text?: string }> | null | undefined
): string {
  if (typeof content === 'string') return content.trim();
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (!part) return '';
        if (typeof part === 'string') return part;
        if (typeof part.text === 'string') return part.text;
        return '';
      })
      .join('\n')
      .trim();
  }
  return '';
}

/**
 * Free / reasoning models sometimes put usable text outside `message.content`.
 */
function extractMessageContent(data: OpenRouterResponse): string {
  const choice = data.choices?.[0];
  if (!choice) return '';

  const message = choice.message;
  const direct = extractTextParts(message?.content ?? null);
  if (direct) return direct;

  if (typeof choice.text === 'string' && choice.text.trim()) {
    return choice.text.trim();
  }

  // Some routed free models only return reasoning text.
  const reasoning =
    (typeof message?.reasoning === 'string' && message.reasoning.trim()) ||
    (typeof message?.reasoning_content === 'string' && message.reasoning_content.trim()) ||
    '';
  if (reasoning) {
    // Prefer a JSON object embedded in reasoning if present.
    const jsonMatch = reasoning.match(/\{[\s\S]*\}/);
    if (jsonMatch?.[0]) return jsonMatch[0].trim();
    return reasoning;
  }

  if (typeof message?.refusal === 'string' && message.refusal.trim()) {
    return message.refusal.trim();
  }

  return '';
}

/**
 * Low-level OpenRouter chat completion. Server-side only.
 */
export async function chatCompletion(options: ChatCompletionOptions): Promise<string> {
  const apiKey = getOpenRouterApiKey();
  if (!apiKey) {
    throw new OpenRouterError(
      'OpenRouter API key is missing. Set OPENROUTER_API_KEY in .env.local.',
      'MISSING_API_KEY',
      503
    );
  }

  const primaryModel = options.model || OPENROUTER_MODEL;
  const modelCandidates = [
    primaryModel,
    ...OPENROUTER_FALLBACK_MODELS.filter((model) => model !== primaryModel),
  ];

  const requestOnce = async (payload: Record<string, unknown>) => {
    let response: Response;
    try {
      response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
          'X-Title': 'SupportFlow',
        },
        body: JSON.stringify(payload),
      });
    } catch {
      throw new OpenRouterError(
        'Unable to reach OpenRouter. Check your network connection and try again.',
        'NETWORK_ERROR',
        502
      );
    }

    const rawText = await response.text();
    let data: OpenRouterResponse = {};
    try {
      data = rawText ? (JSON.parse(rawText) as OpenRouterResponse) : {};
    } catch {
      data = {};
    }

    return { response, data, rawText };
  };

  let lastEmptyDetail = '';

  for (const model of modelCandidates) {
    const baseBody: Record<string, unknown> = {
      model,
      messages: options.messages,
      temperature: options.temperature ?? OPENROUTER_TEMPERATURE,
      max_tokens: options.maxTokens ?? OPENROUTER_MAX_TOKENS,
    };

    // Attempt order:
    // 1) with JSON mode (if requested)
    // 2) without JSON mode (many free models return empty/reject JSON mode)
    const attempts: Array<Record<string, unknown>> = [];
    if (options.json) {
      attempts.push({ ...baseBody, response_format: { type: 'json_object' } });
    }
    attempts.push({ ...baseBody });

    for (const payload of attempts) {
      const { response, data } = await requestOnce(payload);

      if (!response.ok) {
        const message =
          data.error?.message ||
          (response.status === 429
            ? 'OpenRouter rate limit reached. Please retry in a moment.'
            : response.status === 404
              ? `OpenRouter model unavailable: ${model}. Set OPENROUTER_MODEL in .env.local.`
              : `OpenRouter request failed (${response.status}).`);

        // Try next model on not-found / unavailable; surface rate limits immediately.
        if (response.status === 429) {
          throw new OpenRouterError(message, 'RATE_LIMIT', 429);
        }
        if (response.status === 404 || /unavailable|not found|no endpoints/i.test(message)) {
          lastEmptyDetail = message;
          break;
        }

        // For other provider errors on this attempt, try next attempt/model.
        lastEmptyDetail = message;
        continue;
      }

      const content = extractMessageContent(data);
      if (content) return content;

      const finish =
        data.choices?.[0]?.finish_reason ||
        data.choices?.[0]?.native_finish_reason ||
        'unknown';
      lastEmptyDetail = `Empty content from ${data.model || model} (finish_reason=${finish}).`;
    }
  }

  throw new OpenRouterError(
    lastEmptyDetail
      ? `OpenRouter returned an empty response. ${lastEmptyDetail}`
      : 'OpenRouter returned an empty response. Try again or set OPENROUTER_MODEL to another free model.',
    'EMPTY_RESPONSE',
    502
  );
}

/**
 * Parse model JSON safely, stripping optional markdown fences.
 */
export function parseJsonContent<T>(content: string): T {
  const cleaned = content
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  // If the model wrapped JSON in prose, extract the first object/array.
  const objectMatch = cleaned.match(/\{[\s\S]*\}/);
  const arrayMatch = cleaned.match(/\[[\s\S]*\]/);
  const candidate =
    objectMatch?.[0] && (!arrayMatch?.[0] || (objectMatch.index ?? 0) <= (arrayMatch.index ?? 0))
      ? objectMatch[0]
      : arrayMatch?.[0] || cleaned;

  try {
    return JSON.parse(candidate) as T;
  } catch {
    throw new OpenRouterError(
      'AI returned invalid JSON. Please retry the analysis.',
      'INVALID_JSON',
      502
    );
  }
}
