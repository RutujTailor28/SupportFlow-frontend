import { NextRequest, NextResponse } from 'next/server';
import { detectEscalation } from '../../../../services/ai/escalation.service';
import { jsonError, readJsonBody } from '../_shared';

export const runtime = 'nodejs';

interface EscalateBody {
  subject?: string;
  message?: string;
  conversation?: string;
  sentiment?: string;
  urgency?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await readJsonBody<EscalateBody>(request);
    const subject = String(body.subject || '').trim();
    const message = String(body.message || '').trim();

    if (!subject || !message) {
      return NextResponse.json(
        { detail: 'subject and message are required.', code: 'INVALID_REQUEST' },
        { status: 400 }
      );
    }

    const result = await detectEscalation({
      subject,
      message,
      conversation: body.conversation,
      sentiment: body.sentiment,
      urgency: body.urgency,
    });

    return NextResponse.json(result);
  } catch (err) {
    return jsonError(err);
  }
}
