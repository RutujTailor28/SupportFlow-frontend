import { NextRequest, NextResponse } from 'next/server';
import { generateReply } from '../../../../services/ai/reply.service';
import { jsonError, readJsonBody } from '../_shared';

export const runtime = 'nodejs';

interface DraftBody {
  subject?: string;
  message?: string;
  customerName?: string;
  conversation?: string;
  classification?: string;
  tone?: 'friendly' | 'formal' | 'concise';
  kbArticles?: Array<{ title?: string; summary?: string; content?: string }>;
}

export async function POST(request: NextRequest) {
  try {
    const body = await readJsonBody<DraftBody>(request);
    const subject = String(body.subject || '').trim();
    const message = String(body.message || '').trim();
    const customerName = String(body.customerName || 'Customer').trim();

    if (!subject || !message) {
      return NextResponse.json(
        { detail: 'subject and message are required.', code: 'INVALID_REQUEST' },
        { status: 400 }
      );
    }

    const result = await generateReply({
      subject,
      message,
      customerName,
      conversation: body.conversation,
      classification: body.classification,
      tone: body.tone,
      kbArticles: (body.kbArticles || [])
        .filter((article) => article.title && (article.content || article.summary))
        .map((article) => ({
          title: String(article.title),
          summary: String(article.summary || ''),
          content: String(article.content || article.summary || ''),
        })),
    });

    return NextResponse.json(result);
  } catch (err) {
    return jsonError(err);
  }
}
