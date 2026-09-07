import type { Ticket } from '../../types/ticket';

export const TICKETS_STORAGE_KEY = 'sf_tickets_state';

interface TicketsStoragePayload {
  version: 1;
  tickets: Ticket[];
  updatedAt: string;
}

function canUseStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function loadStoredTickets(): Ticket[] {
  if (!canUseStorage()) return [];

  try {
    const raw = window.localStorage.getItem(TICKETS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as TicketsStoragePayload;
    if (!parsed || !Array.isArray(parsed.tickets)) return [];
    return parsed.tickets.filter((ticket) => ticket && typeof ticket.id === 'string');
  } catch {
    return [];
  }
}

export function saveStoredTickets(tickets: Ticket[]): void {
  if (!canUseStorage()) return;

  const payload: TicketsStoragePayload = {
    version: 1,
    tickets,
    updatedAt: new Date().toISOString(),
  };

  try {
    window.localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore quota / private-mode failures; app remains usable in-memory.
  }
}

/**
 * Merge mock seed data with localStorage overrides/creations.
 * Stored tickets win on id collision so AI/user edits persist.
 */
export function mergeTicketsWithStorage(seedTickets: Ticket[], storedTickets: Ticket[]): Ticket[] {
  const byId = new Map<string, Ticket>();

  for (const ticket of seedTickets) {
    byId.set(ticket.id, ticket);
  }

  for (const ticket of storedTickets) {
    byId.set(ticket.id, ticket);
  }

  const seedIds = new Set(seedTickets.map((t) => t.id));
  const created = storedTickets.filter((t) => !seedIds.has(t.id));
  const seeded = seedTickets.map((seed) => byId.get(seed.id) || seed);

  return [...created, ...seeded].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
