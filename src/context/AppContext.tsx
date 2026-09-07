'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Ticket, TicketCategory, TicketPriority, TicketSentiment, TicketStatus, SupportTeam, Message, AIClassification, EscalationDetails } from '../types/ticket';
import { KBArticle, ContentGap, KBCategory } from '../types/knowledgeBase';
import { RoutingRule } from '../types/routingRule';
import { mockTickets } from '../data/mockTickets';
import { mockKBArticles, mockContentGaps } from '../data/mockKnowledgeBase';
import { mockRoutingRules } from '../data/mockRules';
import {
  ThemeMode,
  readStoredTheme,
  readSystemPrefersDark,
  applyThemeToDocument,
  resolveIsDarkMode,
  THEME_STORAGE_KEY,
} from '../lib/theme';
import { USE_MOCK_DATA } from '../lib/config';
import { ApiError } from '../lib/api/client';
import * as ticketsApi from '../lib/api/tickets';
import * as knowledgeBaseApi from '../lib/api/knowledgeBase';
import * as rulesApi from '../lib/api/rules';
import { mapTicketSummaryToTicket } from '../lib/api/mappers';
import { deriveContentGaps } from '../lib/analyticsFromTickets';
import {
  loadStoredTickets,
  mergeTicketsWithStorage,
  saveStoredTickets,
} from '../services/storage/local-storage.service';

export type AppPage = 'dashboard' | 'tickets' | 'workspace' | 'knowledge-base' | 'rules' | 'analytics' | 'submit-ticket' | 'settings' | 'login' | 'register';
export type { ThemeMode } from '../lib/theme';

export interface TicketFilterState {
  search: string;
  status: TicketStatus | 'all';
  category: TicketCategory | 'all';
  urgency: TicketPriority | 'all';
  sentiment: TicketSentiment | 'all';
  team: SupportTeam | 'all';
  escalatedOnly: boolean;
}

interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  ticketId?: string;
}

interface AppContextType {
  // Navigation
  activePage: AppPage;
  setActivePage: (page: AppPage) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;

  // Theme & Dark Mode
  mounted: boolean;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Data source
  useMockData: boolean;
  isDataLoading: boolean;
  dataError: string | null;
  refreshData: () => Promise<void>;

  // Tickets
  tickets: Ticket[];
  selectedTicketId: string;
  selectedTicket: Ticket | undefined;
  setSelectedTicketId: (id: string) => void;
  ticketFilters: TicketFilterState;
  setTicketFilters: React.Dispatch<React.SetStateAction<TicketFilterState>>;
  filteredTickets: Ticket[];

  // Ticket Actions
  createTicket: (data: { name: string; email: string; subject: string; message: string; category?: TicketCategory }) => Promise<Ticket>;
  updateTicketStatus: (ticketId: string, status: TicketStatus) => void;
  updateTicketPriority: (ticketId: string, priority: TicketPriority) => void;
  updateTicketTeam: (ticketId: string, team: SupportTeam) => void;
  updateAIClassification: (ticketId: string, classification: Partial<AIClassification>) => void;
  applyAiTicketAnalysis: (
    ticketId: string,
    update: {
      classification?: Partial<AIClassification> & {
        intent_summary?: string;
        entities?: { key: string; value: string }[];
      };
      escalation?: {
        escalated: boolean;
        reasons?: string[];
        triggerPhrases?: string[];
        reason?: EscalationDetails['reason'];
      };
      summary?: string;
      kbSources?: Ticket['kbSources'];
      suggestedDrafts?: Ticket['suggestedDrafts'];
    }
  ) => void;
  acknowledgeEscalation: (ticketId: string) => void;
  toggleEscalation: (ticketId: string) => void;
  addMessage: (ticketId: string, message: Omit<Message, 'id' | 'timestamp'>) => void;
  resolveTicketWithDraft: (ticketId: string, replyContent: string) => void;

  // Knowledge Base
  articles: KBArticle[];
  contentGaps: ContentGap[];
  createArticle: (article: Omit<KBArticle, 'id' | 'lastIndexed' | 'lastUpdated' | 'chunksCount' | 'embeddingModel' | 'viewCount' | 'helpfulVotes' | 'aiUsageCount'>) => void;
  updateArticle: (id: string, updates: Partial<KBArticle>) => void;
  deleteArticle: (id: string) => void;
  reindexArticle: (id: string) => void;
  createArticleFromGap: (gapId: string) => void;
  previewArticleId: string | null;
  setPreviewArticleId: (id: string | null) => void;

  // Routing Rules
  rules: RoutingRule[];
  createRule: (rule: Omit<RoutingRule, 'id' | 'order' | 'matchesLast30Days'>) => void;
  updateRule: (id: string, updates: Partial<RoutingRule>) => void;
  deleteRule: (id: string) => void;
  toggleRule: (id: string) => void;
  reorderRules: (sourceIndex: number, destinationIndex: number) => void;

  // Modals & UI States
  isNewTicketModalOpen: boolean;
  setIsNewTicketModalOpen: (open: boolean) => void;
  isArticleEditorOpen: boolean;
  setIsArticleEditorOpen: (open: boolean) => void;
  editingArticle: KBArticle | null;
  setEditingArticle: (article: KBArticle | null) => void;
  isRuleModalOpen: boolean;
  setIsRuleModalOpen: (open: boolean) => void;
  editingRule: RoutingRule | null;
  setEditingRule: (rule: RoutingRule | null) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;

  // Live simulation & notifications
  toasts: ToastNotification[];
  removeToast: (id: string) => void;
  triggerSimulatedTicket: () => void;
  isSimulatingLive: boolean;
  setIsSimulatingLive: (simulating: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function errorMessage(err: unknown, fallback: string): string {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  return fallback;
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<AppPage>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes('login') || hash.includes('login')) return 'login';
      if (path.includes('register') || hash.includes('register')) return 'register';
    }
    return 'dashboard';
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes('login') || hash.includes('login')) {
        setActivePage('login');
      } else if (path.includes('register') || hash.includes('register')) {
        setActivePage('register');
      }
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const [mounted, setMounted] = useState(false);
  const [theme, setThemeState] = useState<ThemeMode>('system');
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(false);

  useEffect(() => {
    const storedTheme = readStoredTheme();
    const prefersDark = readSystemPrefersDark();
    setThemeState(storedTheme);
    setSystemPrefersDark(prefersDark);
    applyThemeToDocument(resolveIsDarkMode(storedTheme, prefersDark));
    setMounted(true);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemPrefersDark(e.matches);
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const isDarkMode = resolveIsDarkMode(theme, systemPrefersDark);

  useEffect(() => {
    if (!mounted) return;
    applyThemeToDocument(isDarkMode);
  }, [isDarkMode, mounted]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    applyThemeToDocument(resolveIsDarkMode(newTheme, readSystemPrefersDark()));
  };

  const toggleDarkMode = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  const [tickets, setTickets] = useState<Ticket[]>(USE_MOCK_DATA ? mockTickets : []);
  const [selectedTicketId, setSelectedTicketId] = useState<string>(
    USE_MOCK_DATA ? mockTickets[0]?.id || 'tk-1' : ''
  );
  const [isDataLoading, setIsDataLoading] = useState<boolean>(!USE_MOCK_DATA);
  const [dataError, setDataError] = useState<string | null>(null);
  const [ticketStorageReady, setTicketStorageReady] = useState<boolean>(!USE_MOCK_DATA);
  const loadGeneration = useRef(0);

  const [ticketFilters, setTicketFilters] = useState<TicketFilterState>({
    search: '',
    status: 'all',
    category: 'all',
    urgency: 'all',
    sentiment: 'all',
    team: 'all',
    escalatedOnly: false,
  });

  const [articles, setArticles] = useState<KBArticle[]>(USE_MOCK_DATA ? mockKBArticles : []);
  const [previewArticleId, setPreviewArticleId] = useState<string | null>(null);

  const [rules, setRules] = useState<RoutingRule[]>(USE_MOCK_DATA ? mockRoutingRules : []);

  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState<boolean>(false);
  const [isArticleEditorOpen, setIsArticleEditorOpen] = useState<boolean>(false);
  const [editingArticle, setEditingArticle] = useState<KBArticle | null>(null);
  const [isRuleModalOpen, setIsRuleModalOpen] = useState<boolean>(false);
  const [editingRule, setEditingRule] = useState<RoutingRule | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);

  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [isSimulatingLive, setIsSimulatingLive] = useState<boolean>(true);

  const addToast = useCallback((toast: Omit<ToastNotification, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const refreshData = useCallback(async () => {
    if (USE_MOCK_DATA) {
      const merged = mergeTicketsWithStorage(mockTickets, loadStoredTickets());
      setTickets(merged);
      setArticles(mockKBArticles);
      setRules(mockRoutingRules);
      setSelectedTicketId((current) => {
        if (current && merged.some((t) => t.id === current)) return current;
        return merged[0]?.id || 'tk-1';
      });
      setDataError(null);
      setIsDataLoading(false);
      setTicketStorageReady(true);
      return;
    }

    const generation = ++loadGeneration.current;
    setIsDataLoading(true);
    setDataError(null);

    try {
      const [loadedTickets, loadedArticles, loadedRules] = await Promise.all([
        ticketsApi.loadTicketsHydrated(),
        knowledgeBaseApi.listKbArticles(),
        rulesApi.listRoutingRules(),
      ]);

      if (generation !== loadGeneration.current) return;

      setTickets(loadedTickets);
      setArticles(loadedArticles);
      setRules(loadedRules);
      setSelectedTicketId((current) => {
        if (current && loadedTickets.some((t) => t.id === current)) return current;
        return loadedTickets[0]?.id || '';
      });
    } catch (err) {
      if (generation !== loadGeneration.current) return;
      const message = errorMessage(err, 'Failed to load data from the API.');
      setDataError(message);
      setTickets([]);
      setArticles([]);
      setRules([]);
      addToast({
        type: 'error',
        title: 'API load failed',
        message,
      });
    } finally {
      if (generation === loadGeneration.current) {
        setIsDataLoading(false);
      }
    }
  }, [addToast]);

  useEffect(() => {
    void refreshData();
  }, [refreshData]);

  // Persist mock-mode ticket mutations (AI results, edits, new tickets) to localStorage.
  useEffect(() => {
    if (!USE_MOCK_DATA || !ticketStorageReady) return;
    saveStoredTickets(tickets);
  }, [tickets, ticketStorageReady]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      if (e.shiftKey && (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        toggleDarkMode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const selectedTicket = useMemo(() => {
    return tickets.find((t) => t.id === selectedTicketId) || tickets[0];
  }, [tickets, selectedTicketId]);

  const contentGaps = useMemo(() => {
    if (USE_MOCK_DATA) return mockContentGaps;
    return deriveContentGaps(tickets, articles);
  }, [tickets, articles]);

  const filteredTickets = useMemo(() => {
    return tickets
      .filter((t) => {
        if (ticketFilters.search) {
          const query = ticketFilters.search.toLowerCase();
          const matchSubject = t.subject.toLowerCase().includes(query);
          const matchCustomer =
            t.customer.name.toLowerCase().includes(query) ||
            t.customer.email.toLowerCase().includes(query);
          const matchNumber = t.ticketNumber.toLowerCase().includes(query);
          const matchCategory = t.category.toLowerCase().includes(query);
          if (!matchSubject && !matchCustomer && !matchNumber && !matchCategory) return false;
        }
        if (ticketFilters.status !== 'all' && t.status !== ticketFilters.status) return false;
        if (ticketFilters.category !== 'all' && t.category !== ticketFilters.category) return false;
        if (ticketFilters.urgency !== 'all' && t.priority !== ticketFilters.urgency) return false;
        if (ticketFilters.sentiment !== 'all' && t.sentiment !== ticketFilters.sentiment) return false;
        if (ticketFilters.team !== 'all' && t.assignedTeam !== ticketFilters.team) return false;
        if (ticketFilters.escalatedOnly && !t.escalation.isEscalated) return false;
        return true;
      })
      .sort((a, b) => {
        if (a.escalation.isEscalated && !b.escalation.isEscalated) return -1;
        if (!a.escalation.isEscalated && b.escalation.isEscalated) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [tickets, ticketFilters]);

  const buildLocalTicket = (data: {
    name: string;
    email: string;
    subject: string;
    message: string;
    category?: TicketCategory;
  }): Ticket => {
    const nextNum = Math.floor(48300 + Math.random() * 900);
    const id = `tk-${Date.now()}`;
    const category: TicketCategory =
      data.category ||
      (data.subject.toLowerCase().includes('charge') ||
      data.subject.toLowerCase().includes('refund') ||
      data.subject.toLowerCase().includes('invoice')
        ? 'Billing'
        : data.subject.toLowerCase().includes('502') ||
            data.subject.toLowerCase().includes('api') ||
            data.subject.toLowerCase().includes('bug')
          ? 'Technical'
          : data.subject.toLowerCase().includes('password') ||
              data.subject.toLowerCase().includes('account') ||
              data.subject.toLowerCase().includes('login')
            ? 'Account'
            : data.subject.toLowerCase().includes('feature') ||
                data.subject.toLowerCase().includes('dark mode')
              ? 'Feature Request'
              : data.subject.toLowerCase().includes('ship') ||
                  data.subject.toLowerCase().includes('tracking')
                ? 'Shipping'
                : 'Technical');

    const isUrgent =
      data.subject.toLowerCase().includes('urgent') ||
      data.message.toLowerCase().includes('cancel') ||
      data.message.toLowerCase().includes('immediately');
    const isEscalated =
      data.message.toLowerCase().includes('cancel my account') ||
      data.message.toLowerCase().includes('competitor') ||
      data.message.toLowerCase().includes('lawyer') ||
      data.message.toLowerCase().includes('legal');

    let assignedTeam: SupportTeam = 'Tier 1 Support';
    if (category === 'Billing') assignedTeam = 'Finance Team';
    else if (category === 'Technical' && isUrgent) assignedTeam = 'Engineering';
    else if (category === 'Account' && isEscalated) assignedTeam = 'Account Management';
    else if (category === 'Security') assignedTeam = 'Security & Compliance';

    return {
      id,
      ticketNumber: `#TK-${nextNum}`,
      subject: data.subject,
      customer: {
        id: `cust-${Date.now()}`,
        name: data.name,
        email: data.email,
        plan: 'Pro',
        totalTickets: 1,
        joinedDate: new Date().toISOString().split('T')[0],
      },
      status: 'new',
      priority: isUrgent || isEscalated ? 'high' : 'normal',
      category,
      sentiment: isEscalated ? 'very_negative' : isUrgent ? 'negative' : 'neutral',
      assignedTeam,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      slaDueIn: isUrgent ? '20 min' : '2 hours',
      escalation: {
        isEscalated,
        reason: isEscalated ? 'Churn Risk Detected' : undefined,
        triggerPhrases: isEscalated ? ['cancel my account', 'competitor'] : [],
        acknowledged: false,
        escalatedAt: isEscalated ? new Date().toISOString() : undefined,
      },
      aiClassification: {
        category,
        subcategory: `${category} Inbound Query`,
        urgency: isUrgent || isEscalated ? 'high' : 'normal',
        sentiment: isEscalated ? 'very_negative' : isUrgent ? 'negative' : 'neutral',
        language: 'English',
        confidence: 0.94,
      },
      customerIntent: `Customer is inquiring about ${data.subject.toLowerCase()}. AI suggests prioritizing team review.`,
      extractedEntities: [
        { key: 'Detected Channel', value: 'Web Support Portal' },
        { key: 'Email', value: data.email },
      ],
      kbSources: mockKBArticles.slice(0, 2).map((a) => ({
        id: a.id,
        title: a.title,
        category: a.category,
        relevance: 0.92,
        snippet: a.summary,
      })),
      similarTickets: [
        {
          id: 'sim-new',
          ticketNumber: '#TK-41098',
          title: data.subject,
          similarity: 0.89,
          resolution: 'Assisted customer with standard knowledge base protocol and verified account health.',
          resolvedDate: '4 days ago',
        },
      ],
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderType: 'customer',
          senderName: data.name,
          content: data.message,
          timestamp: 'Just now',
        },
      ],
      suggestedDrafts: {
        friendly: `Hi ${data.name.split(' ')[0]},\n\nThank you for reaching out to SupportFlow! I have reviewed your request regarding "${data.subject}" and am here to help you get this resolved.\n\nLet me know if there are any specific details you would like me to check on your account!`,
        formal: `Dear ${data.name},\n\nThank you for contacting customer support. We have received your inquiry regarding "${data.subject}" and our team is reviewing the operational details.\n\nWe will follow up shortly with a comprehensive resolution.`,
        concise: `Hi ${data.name.split(' ')[0]},\n\nWe received your request regarding "${data.subject}". We are reviewing it and will provide a resolution shortly.`,
      },
    };
  };

  const createTicket = async (data: {
    name: string;
    email: string;
    subject: string;
    message: string;
    category?: TicketCategory;
  }): Promise<Ticket> => {
    if (USE_MOCK_DATA) {
      const newTicket = buildLocalTicket(data);
      setTickets((prev) => [newTicket, ...prev]);
      setSelectedTicketId(newTicket.id);
      addToast({
        type: newTicket.escalation.isEscalated ? 'warning' : 'success',
        title: newTicket.escalation.isEscalated ? '🚨 Escalated Ticket Received' : '✨ New Ticket Triaged',
        message: `${newTicket.ticketNumber}: ${newTicket.subject.substring(0, 45)}...`,
        ticketId: newTicket.id,
      });
      return newTicket;
    }

    try {
      const summary = await ticketsApi.createTicket({
        customerName: data.name,
        customerEmail: data.email,
        subject: data.subject,
        body: data.message,
        channel: 'web',
      });

      let hydrated: Ticket;
      try {
        hydrated = await ticketsApi.loadTicketHydrated(summary.id);
      } catch {
        hydrated = mapTicketSummaryToTicket(summary);
      }

      if (data.category) {
        try {
          await ticketsApi.updateTicketClassification(hydrated.id, {
            category: data.category,
            humanCorrected: true,
          });
          hydrated = {
            ...hydrated,
            category: data.category,
            aiClassification: {
              ...hydrated.aiClassification,
              category: data.category,
              humanCorrected: true,
            },
          };
        } catch {
          // Classification is optional enrichment
        }
      }

      try {
        await ticketsApi.detectTicketEscalations(hydrated.id);
        await ticketsApi.applyTicketRouting(hydrated.id);
        hydrated = await ticketsApi.loadTicketHydrated(hydrated.id);
      } catch {
        // Routing/escalation detection are best-effort
      }

      setTickets((prev) => [hydrated, ...prev.filter((t) => t.id !== hydrated.id)]);
      setSelectedTicketId(hydrated.id);
      addToast({
        type: hydrated.escalation.isEscalated ? 'warning' : 'success',
        title: hydrated.escalation.isEscalated ? '🚨 Escalated Ticket Received' : '✨ New Ticket Triaged',
        message: `${hydrated.ticketNumber}: ${hydrated.subject.substring(0, 45)}...`,
        ticketId: hydrated.id,
      });
      return hydrated;
    } catch (err) {
      const message = errorMessage(err, 'Failed to create ticket.');
      addToast({ type: 'error', title: 'Create ticket failed', message });
      throw err;
    }
  };

  const updateTicketStatus = (ticketId: string, status: TicketStatus) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId ? { ...t, status, updatedAt: new Date().toISOString() } : t
      )
    );
    addToast({
      type: 'info',
      title: 'Status Updated',
      message: `Ticket status marked as ${status.toUpperCase()}.`,
    });

    if (!USE_MOCK_DATA) {
      void ticketsApi.updateTicket(ticketId, { status }).catch((err) => {
        addToast({
          type: 'error',
          title: 'Status sync failed',
          message: errorMessage(err, 'Could not update ticket status on the server.'),
        });
        void refreshData();
      });
    }
  };

  const updateTicketPriority = (ticketId: string, priority: TicketPriority) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId ? { ...t, priority, updatedAt: new Date().toISOString() } : t
      )
    );

    if (!USE_MOCK_DATA) {
      void ticketsApi.updateTicket(ticketId, { priority }).catch((err) => {
        addToast({
          type: 'error',
          title: 'Priority sync failed',
          message: errorMessage(err, 'Could not update ticket priority on the server.'),
        });
        void refreshData();
      });
    }
  };

  const updateTicketTeam = (ticketId: string, team: SupportTeam) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? { ...t, assignedTeam: team, updatedAt: new Date().toISOString() }
          : t
      )
    );
    addToast({
      type: 'info',
      title: 'Ticket Re-routed',
      message: `Ticket successfully assigned to ${team}.`,
    });

    if (!USE_MOCK_DATA) {
      void ticketsApi.updateTicket(ticketId, { assignedTeam: team }).catch((err) => {
        addToast({
          type: 'error',
          title: 'Team sync failed',
          message: errorMessage(err, 'Could not update assigned team on the server.'),
        });
        void refreshData();
      });
    }
  };

  const updateAIClassification = (ticketId: string, classification: Partial<AIClassification>) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        return {
          ...t,
          aiClassification: {
            ...t.aiClassification,
            ...classification,
            humanCorrected: true,
          },
          category: classification.category || t.category,
          priority: classification.urgency || t.priority,
          sentiment: classification.sentiment || t.sentiment,
          updatedAt: new Date().toISOString(),
        };
      })
    );

    addToast({
      type: 'success',
      title: 'Classification Saved',
      message: '✓ Human correction recorded to train future triage model.',
    });

    if (!USE_MOCK_DATA) {
      void ticketsApi
        .updateTicketClassification(ticketId, {
          ...classification,
          humanCorrected: true,
        })
        .catch((err) => {
          addToast({
            type: 'error',
            title: 'Classification sync failed',
            message: errorMessage(err, 'Could not save classification on the server.'),
          });
          void refreshData();
        });
    }
  };

  const applyAiTicketAnalysis = (
    ticketId: string,
    update: {
      classification?: Partial<AIClassification> & {
        intent_summary?: string;
        entities?: { key: string; value: string }[];
      };
      escalation?: {
        escalated: boolean;
        reasons?: string[];
        triggerPhrases?: string[];
        reason?: EscalationDetails['reason'];
      };
      summary?: string;
      kbSources?: Ticket['kbSources'];
      suggestedDrafts?: Ticket['suggestedDrafts'];
    }
  ) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;

        const nextClassification = update.classification
          ? {
              ...t.aiClassification,
              ...update.classification,
              humanCorrected: false,
            }
          : t.aiClassification;

        const nextEscalation: EscalationDetails = update.escalation
          ? {
              isEscalated: update.escalation.escalated,
              reason: update.escalation.escalated
                ? update.escalation.reason || 'Churn Risk Detected'
                : undefined,
              triggerPhrases: update.escalation.escalated
                ? [
                    ...(update.escalation.triggerPhrases || []),
                    ...(update.escalation.reasons || []),
                  ].filter(Boolean)
                : [],
              acknowledged: update.escalation.escalated ? false : t.escalation.acknowledged,
              escalatedAt: update.escalation.escalated
                ? new Date().toISOString()
                : undefined,
            }
          : t.escalation;

        return {
          ...t,
          aiClassification: nextClassification,
          category: update.classification?.category || t.category,
          priority: update.classification?.urgency || t.priority,
          sentiment: update.classification?.sentiment || t.sentiment,
          customerIntent: update.classification?.intent_summary || t.customerIntent,
          extractedEntities: update.classification?.entities || t.extractedEntities,
          aiSummary: update.summary ?? t.aiSummary,
          escalation: nextEscalation,
          kbSources: update.kbSources || t.kbSources,
          suggestedDrafts: update.suggestedDrafts || t.suggestedDrafts,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const acknowledgeEscalation = (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        return {
          ...t,
          escalation: { ...t.escalation, acknowledged: true },
          updatedAt: new Date().toISOString(),
        };
      })
    );

    addToast({
      type: 'info',
      title: 'Escalation Acknowledged',
      message: 'Agent marked escalation as under active review.',
    });

    if (!USE_MOCK_DATA) {
      void (async () => {
        try {
          const response = await ticketsApi.listTicketEscalations(ticketId);
          const active = (response.data || []).find((item) => !item.acknowledged);
          if (active?.id) {
            await ticketsApi.acknowledgeTicketEscalation(ticketId, active.id, {
              acknowledged: true,
            });
          }
          const refreshed = await ticketsApi.loadTicketHydrated(ticketId);
          setTickets((prev) => prev.map((t) => (t.id === ticketId ? refreshed : t)));
        } catch (err) {
          addToast({
            type: 'error',
            title: 'Escalation sync failed',
            message: errorMessage(err, 'Could not acknowledge escalation on the server.'),
          });
        }
      })();
    }
  };

  const toggleEscalation = (ticketId: string) => {
    const current = tickets.find((t) => t.id === ticketId);
    const nextEsc = !(current?.escalation.isEscalated ?? false);

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        return {
          ...t,
          escalation: {
            isEscalated: nextEsc,
            reason: nextEsc ? 'Executive Escalation' : undefined,
            acknowledged: false,
            escalatedAt: nextEsc ? new Date().toISOString() : undefined,
          },
          priority: nextEsc ? 'critical' : t.priority,
          updatedAt: new Date().toISOString(),
        };
      })
    );

    if (!USE_MOCK_DATA) {
      void (async () => {
        try {
          if (nextEsc) {
            await ticketsApi.createTicketEscalation(ticketId, {
              reason: 'Executive Escalation',
              source: 'manual',
            });
          } else {
            const response = await ticketsApi.listTicketEscalations(ticketId);
            const active = (response.data || []).find((item) => !item.acknowledged);
            if (active?.id) {
              await ticketsApi.acknowledgeTicketEscalation(ticketId, active.id, {
                acknowledged: true,
                notes: 'Cleared via agent toggle',
              });
            }
          }
          const refreshed = await ticketsApi.loadTicketHydrated(ticketId);
          setTickets((prev) => prev.map((t) => (t.id === ticketId ? refreshed : t)));
        } catch (err) {
          addToast({
            type: 'error',
            title: 'Escalation sync failed',
            message: errorMessage(err, 'Could not update escalation on the server.'),
          });
          void refreshData();
        }
      })();
    }
  };

  const addMessage = (ticketId: string, message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMsg: Message = {
      ...message,
      id: `msg-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== ticketId) return t;
        return {
          ...t,
          messages: [...t.messages, newMsg],
          updatedAt: new Date().toISOString(),
          status: message.senderType === 'agent' ? 'pending' : 'open',
        };
      })
    );

    if (!USE_MOCK_DATA) {
      void (async () => {
        try {
          await ticketsApi.createTicketMessage(ticketId, {
            direction: message.senderType === 'customer' ? 'in' : 'out',
            author: message.senderName,
            body: message.content,
            senderType: message.senderType,
            senderAvatar: message.senderAvatar,
            isAiGenerated: message.isAiGenerated,
            aiConfidence: message.aiConfidence,
          });
          if (message.senderType === 'agent') {
            await ticketsApi.updateTicket(ticketId, { status: 'pending' });
          } else if (message.senderType === 'customer') {
            await ticketsApi.updateTicket(ticketId, { status: 'open' });
          }
        } catch (err) {
          addToast({
            type: 'error',
            title: 'Message sync failed',
            message: errorMessage(err, 'Could not save message on the server.'),
          });
          void refreshData();
        }
      })();
    }
  };

  const resolveTicketWithDraft = (ticketId: string, replyContent: string) => {
    addMessage(ticketId, {
      senderType: 'agent',
      senderName: 'Support Agent (You)',
      senderAvatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      content: replyContent,
    });

    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? { ...t, status: 'resolved', updatedAt: new Date().toISOString() }
          : t
      )
    );

    addToast({
      type: 'success',
      title: '🎉 Reply Dispatched & Ticket Resolved',
      message: 'Customer notified via email. Ticket status updated to Resolved.',
    });

    if (!USE_MOCK_DATA) {
      void ticketsApi.updateTicket(ticketId, { status: 'resolved' }).catch((err) => {
        addToast({
          type: 'error',
          title: 'Resolve sync failed',
          message: errorMessage(err, 'Could not resolve ticket on the server.'),
        });
        void refreshData();
      });
    }
  };

  const createArticle = (
    articleData: Omit<
      KBArticle,
      | 'id'
      | 'lastIndexed'
      | 'lastUpdated'
      | 'chunksCount'
      | 'embeddingModel'
      | 'viewCount'
      | 'helpfulVotes'
      | 'aiUsageCount'
    >
  ) => {
    if (USE_MOCK_DATA) {
      const newArticle: KBArticle = {
        ...articleData,
        id: `kb-${Date.now()}`,
        lastIndexed: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        chunksCount: Math.ceil(articleData.content.length / 400) || 4,
        embeddingModel: 'text-embedding-004',
        viewCount: 0,
        helpfulVotes: 0,
        aiUsageCount: 0,
      };
      setArticles((prev) => [newArticle, ...prev]);
      addToast({
        type: 'success',
        title: 'Article Created & Indexed',
        message: `"${newArticle.title}" is now active in the AI vector store.`,
      });
      return;
    }

    void (async () => {
      try {
        const created = await knowledgeBaseApi.createKbArticle({
          title: articleData.title,
          slug: articleData.slug,
          category: articleData.category,
          tags: articleData.tags,
          content: articleData.content,
          summary: articleData.summary,
          status: articleData.status,
        });
        setArticles((prev) => [created, ...prev]);
        addToast({
          type: 'success',
          title: 'Article Created & Indexed',
          message: `"${created.title}" is now active in the AI vector store.`,
        });
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Create article failed',
          message: errorMessage(err, 'Could not create knowledge base article.'),
        });
      }
    })();
  };

  const updateArticle = (id: string, updates: Partial<KBArticle>) => {
    setArticles((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        return {
          ...a,
          ...updates,
          lastUpdated: new Date().toISOString(),
          lastIndexed: updates.status === 'indexed' ? new Date().toISOString() : a.lastIndexed,
          chunksCount: updates.content ? Math.ceil(updates.content.length / 400) : a.chunksCount,
        };
      })
    );

    addToast({
      type: 'success',
      title: 'Article Updated',
      message: 'Knowledge base embeddings recomputed successfully.',
    });

    if (!USE_MOCK_DATA) {
      void knowledgeBaseApi
        .updateKbArticle(id, {
          title: updates.title,
          slug: updates.slug,
          category: updates.category,
          tags: updates.tags,
          content: updates.content,
          summary: updates.summary,
          status: updates.status,
        })
        .then((updated) => {
          setArticles((prev) => prev.map((a) => (a.id === id ? updated : a)));
        })
        .catch((err) => {
          addToast({
            type: 'error',
            title: 'Update article failed',
            message: errorMessage(err, 'Could not update knowledge base article.'),
          });
          void refreshData();
        });
    }
  };

  const deleteArticle = (id: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
    addToast({
      type: 'info',
      title: 'Article Deleted',
      message: 'Article removed from AI retrieval index.',
    });

    if (!USE_MOCK_DATA) {
      void knowledgeBaseApi.deleteKbArticle(id).catch((err) => {
        addToast({
          type: 'error',
          title: 'Delete article failed',
          message: errorMessage(err, 'Could not delete knowledge base article.'),
        });
        void refreshData();
      });
    }
  };

  const reindexArticle = (id: string) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'processing' } : a))
    );

    const finish = () => {
      setArticles((prev) =>
        prev.map((a) =>
          a.id === id
            ? { ...a, status: 'indexed', lastIndexed: new Date().toISOString() }
            : a
        )
      );
      addToast({
        type: 'success',
        title: 'Re-indexing Complete',
        message: 'Vector embeddings refreshed across 8 chunks.',
      });
    };

    if (USE_MOCK_DATA) {
      setTimeout(finish, 1200);
      return;
    }

    void knowledgeBaseApi
      .updateKbArticle(id, { status: 'processing' })
      .then(() =>
        knowledgeBaseApi.updateKbArticle(id, { status: 'indexed' }).then((updated) => {
          setArticles((prev) => prev.map((a) => (a.id === id ? updated : a)));
          addToast({
            type: 'success',
            title: 'Re-indexing Complete',
            message: 'Vector embeddings refreshed across 8 chunks.',
          });
        })
      )
      .catch((err) => {
        addToast({
          type: 'error',
          title: 'Re-index failed',
          message: errorMessage(err, 'Could not reindex article on the server.'),
        });
        void refreshData();
      });
  };

  const createArticleFromGap = (gapId: string) => {
    const gap = contentGaps.find((g) => g.id === gapId);
    if (!gap) return;

    setEditingArticle({
      id: '',
      title: gap.topic,
      slug: gap.topic.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: (gap.suggestedCategory as KBCategory) || 'Technical',
      tags: [gap.suggestedCategory, 'Documentation', 'AI Drafted'],
      summary: gap.description,
      content: `# ${gap.topic}\n\n## Overview\nThis documentation addresses common inquiries regarding ${gap.topic.toLowerCase()}.\n\n### Common Questions Covered:\n${gap.sampleQueries.map((q) => `- ${q}`).join('\n')}\n\n## Recommended Guidance\n1. Step one instructions...\n2. Configuration details...\n3. Escalation path if unresolved.`,
      status: 'draft',
      lastIndexed: '',
      lastUpdated: new Date().toISOString(),
      chunksCount: 6,
      embeddingModel: 'text-embedding-004',
      viewCount: 0,
      helpfulVotes: 0,
      aiUsageCount: 0,
    });
    setIsArticleEditorOpen(true);
  };

  const createRule = (ruleData: Omit<RoutingRule, 'id' | 'order' | 'matchesLast30Days'>) => {
    if (USE_MOCK_DATA) {
      const newRule: RoutingRule = {
        ...ruleData,
        id: `rule-${Date.now()}`,
        order: rules.length + 1,
        matchesLast30Days: 0,
        lastTriggered: 'Just now',
      };
      setRules((prev) => [...prev, newRule]);
      addToast({
        type: 'success',
        title: 'Routing Rule Created',
        message: `Rule "${newRule.name}" is now actively triaging incoming tickets.`,
      });
      return;
    }

    void (async () => {
      try {
        const created = await rulesApi.createRoutingRule({
          name: ruleData.name,
          description: ruleData.description,
          order: rules.length + 1,
          enabled: ruleData.enabled,
          matchType: ruleData.matchType,
          conditions: ruleData.conditions,
          actions: ruleData.actions,
        });
        setRules((prev) => [...prev, created]);
        addToast({
          type: 'success',
          title: 'Routing Rule Created',
          message: `Rule "${created.name}" is now actively triaging incoming tickets.`,
        });
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Create rule failed',
          message: errorMessage(err, 'Could not create routing rule.'),
        });
      }
    })();
  };

  const updateRule = (id: string, updates: Partial<RoutingRule>) => {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
    addToast({
      type: 'success',
      title: 'Rule Updated',
      message: 'Updated routing conditions applied.',
    });

    if (!USE_MOCK_DATA) {
      void rulesApi
        .updateRoutingRule(id, {
          name: updates.name,
          description: updates.description,
          order: updates.order,
          enabled: updates.enabled,
          matchType: updates.matchType,
          conditions: updates.conditions,
          actions: updates.actions,
        })
        .then((updated) => {
          setRules((prev) => prev.map((r) => (r.id === id ? updated : r)));
        })
        .catch((err) => {
          addToast({
            type: 'error',
            title: 'Update rule failed',
            message: errorMessage(err, 'Could not update routing rule.'),
          });
          void refreshData();
        });
    }
  };

  const deleteRule = (id: string) => {
    setRules((prev) =>
      prev.filter((r) => r.id !== id).map((r, idx) => ({ ...r, order: idx + 1 }))
    );
    addToast({
      type: 'info',
      title: 'Rule Deleted',
      message: 'Routing logic adjusted.',
    });

    if (!USE_MOCK_DATA) {
      void rulesApi.deleteRoutingRule(id).catch((err) => {
        addToast({
          type: 'error',
          title: 'Delete rule failed',
          message: errorMessage(err, 'Could not delete routing rule.'),
        });
        void refreshData();
      });
    }
  };

  const toggleRule = (id: string) => {
    const current = rules.find((r) => r.id === id);
    const nextEnabled = !(current?.enabled ?? true);

    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );

    if (!USE_MOCK_DATA) {
      void rulesApi.updateRoutingRule(id, { enabled: nextEnabled }).catch((err) => {
        addToast({
          type: 'error',
          title: 'Toggle rule failed',
          message: errorMessage(err, 'Could not toggle routing rule.'),
        });
        void refreshData();
      });
    }
  };

  const reorderRules = (sourceIndex: number, destinationIndex: number) => {
    setRules((prev) => {
      const result: RoutingRule[] = [...prev];
      const removed = result.splice(sourceIndex, 1)[0];
      if (removed) {
        result.splice(destinationIndex, 0, removed);
      }
      return result.map((r, idx) => ({ ...r, order: idx + 1 }));
    });
    addToast({
      type: 'info',
      title: 'Rules Reordered',
      message: 'Priority execution sequence updated.',
    });

    if (!USE_MOCK_DATA) {
      void (async () => {
        try {
          const next = [...rules];
          const removed = next.splice(sourceIndex, 1)[0];
          if (!removed) return;
          next.splice(destinationIndex, 0, removed);
          const ordered = next.map((r, idx) => ({ ...r, order: idx + 1 }));
          await Promise.all(
            ordered.map((rule) => rulesApi.updateRoutingRule(rule.id, { order: rule.order }))
          );
          setRules(ordered);
        } catch (err) {
          addToast({
            type: 'error',
            title: 'Reorder sync failed',
            message: errorMessage(err, 'Could not persist rule order.'),
          });
          void refreshData();
        }
      })();
    }
  };

  const triggerSimulatedTicket = () => {
    const pool = [
      {
        name: 'Carlos Rivera',
        email: 'carlos@vortextrading.com',
        subject: 'Cannot download VAT invoices for August 2026',
        message:
          'Hi Support, our accounting department cannot locate the downloadable PDF tax invoice for August. Can you re-generate it?',
        category: 'Billing' as TicketCategory,
      },
      {
        name: 'Elena Rostova',
        email: 'elena@novapharma.org',
        subject: 'Webhook endpoint returning 403 Forbidden with Invalid HMAC',
        message:
          'Our backend receiver started failing signature checks on event delivery. Did you rotate the signing secret?',
        category: 'Technical' as TicketCategory,
      },
      {
        name: 'Marcus Vance',
        email: 'm.vance@solarenergy.net',
        subject: 'Urgent: Considering cancelling our contract due to recent outages',
        message:
          'We had 2 hours of downtime yesterday and our executives are demanding answers. We are evaluating switching to another vendor if SLA compensation is not issued.',
        category: 'Account' as TicketCategory,
      },
      {
        name: 'Aisha Al-Mansoor',
        email: 'aisha@qatarlogistics.qa',
        subject: 'Expedited replacement hardware shipment tracking code',
        message: 'Hello, please confirm the DHL express tracking code for our replacement reader unit.',
        category: 'Shipping' as TicketCategory,
      },
    ];

    const randomItem = pool[Math.floor(Math.random() * pool.length)];
    void createTicket(randomItem);
  };

  return (
    <AppContext.Provider
      value={{
        activePage,
        setActivePage,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        theme,
        mounted,
        setTheme,
        isDarkMode,
        toggleDarkMode,
        useMockData: USE_MOCK_DATA,
        isDataLoading,
        dataError,
        refreshData,
        tickets,
        selectedTicketId,
        selectedTicket,
        setSelectedTicketId,
        ticketFilters,
        setTicketFilters,
        filteredTickets,
        createTicket,
        updateTicketStatus,
        updateTicketPriority,
        updateTicketTeam,
        updateAIClassification,
        applyAiTicketAnalysis,
        acknowledgeEscalation,
        toggleEscalation,
        addMessage,
        resolveTicketWithDraft,
        articles,
        contentGaps,
        createArticle,
        updateArticle,
        deleteArticle,
        reindexArticle,
        createArticleFromGap,
        previewArticleId,
        setPreviewArticleId,
        rules,
        createRule,
        updateRule,
        deleteRule,
        toggleRule,
        reorderRules,
        isNewTicketModalOpen,
        setIsNewTicketModalOpen,
        isArticleEditorOpen,
        setIsArticleEditorOpen,
        editingArticle,
        setEditingArticle,
        isRuleModalOpen,
        setIsRuleModalOpen,
        editingRule,
        setEditingRule,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        toasts,
        removeToast,
        triggerSimulatedTicket,
        isSimulatingLive,
        setIsSimulatingLive,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
