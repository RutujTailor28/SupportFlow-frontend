import { NextRequest, NextResponse } from 'next/server';
import { classifyTicket } from '../../../../services/ai/classification.service';
import { jsonError, readJsonBody } from '../_shared';

export const runtime = 'nodejs';

interface ClassifyBody {
  subject?: string;
  message?: string;
  conversation?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await readJsonBody<ClassifyBody>(request);
    const subject = String(body.subject || '').trim();
    const message = String(body.message || '').trim();

    if (!subject || !message) {
      return NextResponse.json(
        { detail: 'subject and message are required.', code: 'INVALID_REQUEST' },
        { status: 400 }
      );
    }

    const result = await classifyTicket({
      subject,
      message,
      conversation: body.conversation,
    });

    return NextResponse.json(result);
  } catch (err) {
    return jsonError(err);
  }
}
