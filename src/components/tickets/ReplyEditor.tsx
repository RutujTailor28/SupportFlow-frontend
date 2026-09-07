'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Send, ShieldCheck, Trash2, Bookmark } from 'lucide-react';
import { Button } from '../ui/Button';
import {
  AiClientError,
  buildConversationText,
  draftReplyAi,
  getPrimaryCustomerMessage,
} from '../../lib/ai/client';
import { findRelevantKbArticles } from '../../lib/ai/kb-match';

export interface ReplyEditorProps {
  onSendMessage?: (content: string, isInternalNote: boolean) => void;
  externalDraftInsert?: string;
}

export const ReplyEditor: React.FC<ReplyEditorProps> = ({ onSendMessage, externalDraftInsert }) => {
  const { selectedTicket, resolveTicketWithDraft, addMessage, applyAiTicketAnalysis, articles } =
    useApp();
  const [tone, setTone] = useState<'friendly' | 'formal' | 'concise'>('friendly');
  const [content, setContent] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [draftError, setDraftError] = useState<string | null>(null);

  // Auto-populate initial draft when ticket changes
  useEffect(() => {
    if (selectedTicket?.suggestedDrafts) {
      setContent(selectedTicket.suggestedDrafts[tone] || '');
    } else {
      setContent('');
    }
    setDraftError(null);
  }, [selectedTicket?.id, tone, selectedTicket?.suggestedDrafts]);

  // Insert externally triggered drafts (e.g. from Similar tickets resolution)
  useEffect(() => {
    if (externalDraftInsert) {
      setContent((prev) => `${prev}\n\n${externalDraftInsert}`.trim());
    }
  }, [externalDraftInsert]);

  const handleGenerateDraft = async () => {
    if (!selectedTicket) return;

    setIsGenerating(true);
    setDraftError(null);

    const message = getPrimaryCustomerMessage(selectedTicket.messages, selectedTicket.subject);
    const conversation = buildConversationText(selectedTicket.messages);
    const matchedArticles = findRelevantKbArticles(
      `${selectedTicket.subject} ${message} ${selectedTicket.customerIntent}`,
      articles,
      3
    );

    try {
      const drafts = await draftReplyAi({
        subject: selectedTicket.subject,
        message,
        customerName: selectedTicket.customer.name,
        conversation,
        classification: `${selectedTicket.aiClassification.category} / ${selectedTicket.aiClassification.subcategory} / ${selectedTicket.aiClassification.urgency}`,
        tone,
        kbArticles: matchedArticles.map((article) => ({
          title: article.title,
          summary: article.summary,
          content: article.content,
        })),
      });

      applyAiTicketAnalysis(selectedTicket.id, {
        suggestedDrafts: drafts,
        kbSources: matchedArticles.map((article) => ({
          id: article.id,
          title: article.title,
          snippet: article.summary,
          relevance: article.relevance,
          category: article.category,
        })),
      });
      setContent(drafts[tone] || drafts.friendly);
    } catch (err) {
      const messageText =
        err instanceof AiClientError
          ? err.message
          : 'Failed to generate AI reply. Existing draft was preserved.';
      setDraftError(messageText);

      if (!content.trim() && selectedTicket.suggestedDrafts) {
        setContent(selectedTicket.suggestedDrafts[tone]);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApproveAndSend = () => {
    if (!selectedTicket || !content.trim()) return;

    if (isInternalNote) {
      addMessage(selectedTicket.id, {
        senderType: 'system',
        senderName: 'Internal Note (Alex Rivera)',
        content: content.trim(),
      });
      setContent('');
    } else {
      resolveTicketWithDraft(selectedTicket.id, content.trim());
    }
  };

  if (!selectedTicket) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
      <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-200/80 dark:bg-slate-700/80 p-0.5 rounded-xl">
            <button
              onClick={() => setIsInternalNote(false)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                !isInternalNote
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Public Reply
            </button>
            <button
              onClick={() => setIsInternalNote(true)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isInternalNote
                  ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Internal Note
            </button>
          </div>

          {!isInternalNote && (
            <div className="hidden sm:flex items-center gap-1 border-l border-slate-200 dark:border-slate-700 pl-2">
              <span className="text-[11px] text-slate-400 font-medium">Tone:</span>
              {(['friendly', 'formal', 'concise'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`text-[11px] px-2.5 py-0.5 rounded-lg capitalize font-medium transition-colors cursor-pointer ${
                    tone === t
                      ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-semibold'
                      : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => void handleGenerateDraft()}
          disabled={isGenerating}
          className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 px-2.5 py-1 rounded-xl transition-colors cursor-pointer border border-indigo-200/60 dark:border-indigo-800/60 disabled:opacity-60"
          title="Re-generate AI assisted draft based on grounded knowledge base articles"
        >
          <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'Generating AI reply...' : 'Regenerate Draft'}</span>
        </button>
      </div>

      {draftError && (
        <div className="px-4 py-2 bg-rose-50 dark:bg-rose-950/30 border-b border-rose-200/80 dark:border-rose-900 text-[11px] text-rose-700 dark:text-rose-300">
          {draftError}
        </div>
      )}

      <div className="p-3.5">
        <textarea
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={
            isInternalNote
              ? 'Add an internal note visible only to teammates...'
              : 'Review and refine AI-generated reply draft...'
          }
          className={`w-full p-3 text-xs md:text-sm rounded-xl border focus:outline-none focus:ring-2 transition-all resize-y ${
            isInternalNote
              ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60 text-slate-900 dark:text-amber-100 focus:ring-amber-500 font-mono text-xs'
              : 'bg-slate-50/70 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 focus:ring-indigo-500'
          }`}
        />
      </div>

      <div className="px-4 py-3 bg-slate-50/70 dark:bg-slate-800/40 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>AI never sends replies automatically. Human approval required.</span>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {content && (
            <button
              onClick={() => setContent('')}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              title="Clear draft"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <Button
            size="sm"
            onClick={handleApproveAndSend}
            disabled={!content.trim()}
            variant={isInternalNote ? 'secondary' : 'primary'}
            className="gap-2 font-semibold shadow-xs"
          >
            {isInternalNote ? (
              <>
                <Bookmark className="w-4 h-4" />
                <span>Save Note</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Approve & Send</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
