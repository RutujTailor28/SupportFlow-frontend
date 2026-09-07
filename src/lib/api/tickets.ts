import { apiRequest, apiRequestRaw } from './client';
import {
  ClassificationUpdatePayload,
  EscalationCreatePayload,
  EscalationRecordDto,
  EscalationSummaryDto,
  MessageCreatePayload,
  MessageDto,
  TicketCreatePayload,
  TicketDetailDto,
  TicketSummaryDto,
  TicketUpdatePayload,
} from './types';
import { mapTicketDetailToTicket, mapTicketSummaryToTicket } from './mappers';
import { Ticket } from '../../types/ticket';

export async function listTickets(params?: {
  status?: string;
  category?: string;
  urgency?: string;
  sentiment?: string;
  assignedTeam?: string;
  search?: string;
}): Promise<TicketSummaryDto[]> {
  const query = new URLSearchParams();
  if (params?.status) query.set('status', params.status);
  if (params?.category) query.set('category', params.category);
  if (params?.urgency) query.set('urgency', params.urgency);
  if (params?.sentiment) query.set('sentiment', params.sentiment);
  if (params?.assignedTeam) query.set('assignedTeam', params.assignedTeam);
  if (params?.search) query.set('search', params.search);
  const qs = query.toString();
  const data = await apiRequest<TicketSummaryDto[]>(`/tickets${qs ? `?${qs}` : ''}`);
  return Array.isArray(data) ? data : [];
}

export async function getTicket(ticketId: string): Promise<TicketDetailDto> {
  return apiRequest<TicketDetailDto>(`/tickets/${ticketId}`);
}

export async function createTicket(payload: TicketCreatePayload): Promise<TicketSummaryDto> {
  return apiRequest<TicketSummaryDto>('/tickets', { method: 'POST', body: payload });
}

export async function updateTicket(
  ticketId: string,
  payload: TicketUpdatePayload
): Promise<TicketSummaryDto> {
  return apiRequest<TicketSummaryDto>(`/tickets/${ticketId}`, { method: 'PATCH', body: payload });
}

export async function listTicketMessages(ticketId: string): Promise<MessageDto[]> {
  const data = await apiRequest<MessageDto[]>(`/tickets/${ticketId}/messages`);
  return Array.isArray(data) ? data : [];
}

export async function createTicketMessage(
  ticketId: string,
  payload: MessageCreatePayload
): Promise<MessageDto> {
  return apiRequest<MessageDto>(`/tickets/${ticketId}/messages`, { method: 'POST', body: payload });
}

export async function updateTicketClassification(
  ticketId: string,
  payload: ClassificationUpdatePayload
) {
  return apiRequest(`/tickets/${ticketId}/classification`, { method: 'PATCH', body: payload });
}

export async function listTicketEscalations(ticketId: string): Promise<{
  data: EscalationRecordDto[];
  escalation?: EscalationSummaryDto;
}> {
  return apiRequestRaw<{
    success?: boolean;
    count?: number;
    escalation?: EscalationSummaryDto;
    data: EscalationRecordDto[];
  }>(`/tickets/${ticketId}/escalations`);
}

export async function createTicketEscalation(
  ticketId: string,
  payload: EscalationCreatePayload
): Promise<EscalationRecordDto> {
  return apiRequest<EscalationRecordDto>(`/tickets/${ticketId}/escalations`, {
    method: 'POST',
    body: payload,
  });
}

export async function acknowledgeTicketEscalation(
  ticketId: string,
  escalationId: string,
  payload: { acknowledged?: boolean; notes?: string } = { acknowledged: true }
): Promise<EscalationRecordDto> {
  return apiRequest<EscalationRecordDto>(`/tickets/${ticketId}/escalations/${escalationId}`, {
    method: 'PATCH',
    body: payload,
  });
}

export async function detectTicketEscalations(ticketId: string) {
  return apiRequestRaw(`/tickets/${ticketId}/escalations/detect`, { method: 'POST' });
}

export async function applyTicketRouting(ticketId: string) {
  return apiRequestRaw(`/tickets/${ticketId}/apply-routing`, { method: 'POST' });
}

/** Load ticket summaries, then hydrate each with full detail when possible. */
export async function loadTicketsHydrated(): Promise<Ticket[]> {
  const summaries = await listTickets();
  if (summaries.length === 0) return [];

  const details = await Promise.allSettled(summaries.map((item) => getTicket(item.id)));

  return summaries.map((summary, index) => {
    const result = details[index];
    if (result.status === 'fulfilled') {
      return mapTicketDetailToTicket(result.value);
    }
    return mapTicketSummaryToTicket(summary);
  });
}

export async function loadTicketHydrated(ticketId: string): Promise<Ticket> {
  const detail = await getTicket(ticketId);
  return mapTicketDetailToTicket(detail);
}
