import { NextRequest, NextResponse } from 'next/server';
import { summarizeTicket } from '../../../../services/ai/summary.service';
import { jsonError, readJsonBody } from '../_shared';

export const runtime = 'nodejs';

interface SummarizeBody {
  subject?: string;
  message?: string;
  conversation?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await readJsonBody<SummarizeBody>(request);
    const subject = String(body.subject || '').trim();
    const message = String(body.message || '').trim();

    if (!subject || !message) {
      return NextResponse.json(
        { detail: 'subject and message are required.', code: 'INVALID_REQUEST' },
        { status: 400 }
      );
    }

    const result = await summarizeTicket({
      subject,
      message,
      conversation: body.conversation,
    });

    return NextResponse.json(result);
  } catch (err) {
    return jsonError(err);
  }
}
