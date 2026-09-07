'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  BrainCircuit,
  CheckCircle2,
  ShieldAlert,
  BookOpen,
  History,
  Tag,
  ArrowRight,
  Edit2,
  Check,
  Zap,
  Loader2,
  FileText,
} from 'lucide-react';
import {
  EscalationDetails,
  TicketCategory,
  TicketPriority,
  TicketSentiment,
} from '../../types/ticket';
import {
  AiClientError,
  buildConversationText,
  classifyTicketAi,
  escalateTicketAi,
  getPrimaryCustomerMessage,
  summarizeTicketAi,
} from '../../lib/ai/client';
import { findRelevantKbArticles, toKbSourceRefs } from '../../lib/ai/kb-match';

export interface AIAssistPanelProps {
  onUseResolution?: (resolution: string) => void;
}

export const AIAssistPanel: React.FC<AIAssistPanelProps> = ({ onUseResolution }) => {
  const {
    selectedTicket,
    updateAIClassification,
    applyAiTicketAnalysis,
    setPreviewArticleId,
    articles,
  } = useApp();

  const [isEditingClassification, setIsEditingClassification] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<TicketCategory>(
    selectedTicket?.aiClassification.category || 'Billing'
  );
  const [selectedUrgency, setSelectedUrgency] = useState<TicketPriority>(
    selectedTicket?.aiClassification.urgency || 'normal'
  );
  const [selectedSentiment, setSelectedSentiment] = useState<TicketSentiment>(
    selectedTicket?.aiClassification.sentiment || 'neutral'
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedTicket) return;
    setSelectedCategory(selectedTicket.aiClassification.category);
    setSelectedUrgency(selectedTicket.aiClassification.urgency);
    setSelectedSentiment(selectedTicket.aiClassification.sentiment);
    setIsEditingClassification(false);
    setAiError(null);
  }, [selectedTicket?.id]);

  if (!selectedTicket) {
    return (
      <div className="p-6 text-center text-slate-400">
        <Sparkles className="w-8 h-8 mx-auto text-slate-300 mb-2" />
        <p className="text-xs">Select a ticket to view AI triage intelligence</p>
      </div>
    );
  }

  const {
    aiClassification,
    customerIntent,
    extractedEntities,
    kbSources,
    similarTickets,
    escalation,
    aiSummary,
  } = selectedTicket;

  const handleSaveCorrection = () => {
    updateAIClassification(selectedTicket.id, {
      category: selectedCategory,
      urgency: selectedUrgency,
      sentiment: selectedSentiment,
    });
    setIsEditingClassification(false);
  };

  const handleAnalyzeWithAi = async () => {
    setIsAnalyzing(true);
    setAiError(null);

    const message = getPrimaryCustomerMessage(selectedTicket.messages, selectedTicket.subject);
    const conversation = buildConversationText(selectedTicket.messages);

    try {
      // Run sequentially to avoid free-tier rate limits from parallel OpenRouter calls.
      const classification = await classifyTicketAi({
        subject: selectedTicket.subject,
        message,
        conversation,
      });
      const escalationResult = await escalateTicketAi({
        subject: selectedTicket.subject,
        message,
        conversation,
        sentiment: classification.sentiment || selectedTicket.sentiment,
        urgency: classification.urgency || selectedTicket.priority,
      });
      const summaryResult = await summarizeTicketAi({
        subject: selectedTicket.subject,
        message,
        conversation,
      });

      const matchedArticles = findRelevantKbArticles(
        `${selectedTicket.subject} ${message} ${classification.intent_summary}`,
        articles,
        3
      );

      applyAiTicketAnalysis(selectedTicket.id, {
        classification: {
          category: classification.category,
          subcategory: classification.subcategory,
          urgency: classification.urgency,
          sentiment: classification.sentiment,
          language: classification.language,
          confidence: classification.confidence,
          intent_summary: classification.intent_summary,
          entities: classification.entities,
        },
        escalation: {
          escalated: escalationResult.escalated,
          reasons: escalationResult.reasons,
          triggerPhrases: escalationResult.triggerPhrases,
          reason: escalationResult.reason as EscalationDetails['reason'],
        },
        summary: summaryResult.summary,
        kbSources: toKbSourceRefs(matchedArticles),
      });
    } catch (err) {
      const messageText =
        err instanceof AiClientError
          ? err.message
          : 'AI analysis failed. Existing ticket data was preserved.';
      setAiError(messageText);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSummarize = async () => {
    setIsSummarizing(true);
    setAiError(null);

    const message = getPrimaryCustomerMessage(selectedTicket.messages, selectedTicket.subject);
    const conversation = buildConversationText(selectedTicket.messages);

    try {
      const summaryResult = await summarizeTicketAi({
        subject: selectedTicket.subject,
        message,
        conversation,
      });
      applyAiTicketAnalysis(selectedTicket.id, { summary: summaryResult.summary });
    } catch (err) {
      const messageText =
        err instanceof AiClientError
          ? err.message
          : 'Summary generation failed. Please try again.';
      setAiError(messageText);
    } finally {
      setIsSummarizing(false);
    }
  };

  const confidencePct = Math.round(aiClassification.confidence * 100);

  return (
    <div className="flex flex-col h-full bg-slate-50/60 dark:bg-slate-900 border-l border-slate-200/80 dark:border-slate-800 overflow-y-auto">
      {/* Top AI Header */}
      <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white tracking-tight">
              AI Assistant
            </h3>
            <p className="text-[10px] text-slate-400">Grounded in Knowledge Base</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/80 text-[11px] font-semibold text-indigo-700 dark:text-indigo-300">
          <BrainCircuit className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>{confidencePct}% Confidence</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex flex-col gap-2">
          <button
            onClick={() => void handleAnalyzeWithAi()}
            disabled={isAnalyzing || isSummarizing}
            className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Analyzing ticket...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Analyze with AI</span>
              </>
            )}
          </button>
          <button
            onClick={() => void handleSummarize()}
            disabled={isAnalyzing || isSummarizing}
            className="w-full py-1.5 px-3 rounded-xl text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/80 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-950 disabled:opacity-60 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            {isSummarizing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Summarizing...</span>
              </>
            ) : (
              <>
                <FileText className="w-3.5 h-3.5" />
                <span>Generate AI Summary</span>
              </>
            )}
          </button>
          {aiError && (
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-[11px]">
              {aiError}
            </div>
          )}
        </div>

        {/* Human Corrected Banner if applied */}
        {aiClassification.humanCorrected && (
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-medium">✓ Human correction recorded for fine-tuning</span>
          </div>
        )}

        {/* AI Summary */}
        {aiSummary && (
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-500" />
              <span>AI Ticket Summary</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{aiSummary}</p>
          </div>
        )}

        {/* 1. Classification Card */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
              <Tag className="w-3.5 h-3.5 text-indigo-500" />
              <span>Classification</span>
            </div>

            <button
              onClick={() => {
                if (isEditingClassification) {
                  handleSaveCorrection();
                } else {
                  setIsEditingClassification(true);
                }
              }}
              className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              {isEditingClassification ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-600 dark:text-emerald-400">Save</span>
                </>
              ) : (
                <>
                  <Edit2 className="w-3 h-3" />
                  <span>Edit</span>
                </>
              )}
            </button>
          </div>

          {!isEditingClassification ? (
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Category</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {aiClassification.category}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Subcategory</span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  {aiClassification.subcategory}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Urgency</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
                  {aiClassification.urgency}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Sentiment</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 capitalize">
                  {aiClassification.sentiment.replace('_', ' ')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Language</span>
                <span className="text-slate-700 dark:text-slate-300">
                  {aiClassification.language}
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5 pt-1">
              <div>
                <label className="text-[11px] font-medium text-slate-500">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as TicketCategory)}
                  className="w-full mt-1 text-xs py-1.5 px-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="Billing">Billing</option>
                  <option value="Technical">Technical</option>
                  <option value="Account">Account</option>
                  <option value="Feature Request">Feature Request</option>
                  <option value="Shipping">Shipping</option>
                  <option value="Security">Security</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-500">Urgency</label>
                <select
                  value={selectedUrgency}
                  onChange={(e) => setSelectedUrgency(e.target.value as TicketPriority)}
                  className="w-full mt-1 text-xs py-1.5 px-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-500">Sentiment</label>
                <select
                  value={selectedSentiment}
                  onChange={(e) => setSelectedSentiment(e.target.value as TicketSentiment)}
                  className="w-full mt-1 text-xs py-1.5 px-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="positive">Positive</option>
                  <option value="neutral">Neutral</option>
                  <option value="negative">Negative</option>
                  <option value="very_negative">Very Negative</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* 2. Customer Intent Summary */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-2">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <BrainCircuit className="w-3.5 h-3.5 text-indigo-500" />
            <span>Customer Intent</span>
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {customerIntent}
          </p>
        </div>

        {/* 3. Extracted Entities */}
        {extractedEntities.length > 0 && (
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Extracted Entities
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {extractedEntities.map((ent, idx) => (
                <div
                  key={idx}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 flex items-center gap-1"
                >
                  <span className="text-slate-400 font-medium">{ent.key}:</span>
                  <span className="font-semibold text-slate-900 dark:text-white font-mono">
                    {ent.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Escalation Trigger Card (If escalated) */}
        {escalation.isEscalated && (
          <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 shadow-2xs space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 dark:text-rose-300">
              <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span>Escalation Trigger</span>
            </div>
            <p className="text-xs text-rose-900 dark:text-rose-200 font-medium">
              Reason: {escalation.reason || 'Churn risk / SLA breach'}
            </p>
            {escalation.triggerPhrases && (
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400">
                  Trigger phrases detected:
                </span>
                <div className="space-y-1">
                  {escalation.triggerPhrases.map((phrase, idx) => (
                    <div
                      key={idx}
                      className="p-1.5 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-rose-200/80 dark:border-rose-900 text-xs italic text-rose-800 dark:text-rose-300"
                    >
                      "{phrase}"
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 5. Knowledge Base Sources */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              <span>Grounded Knowledge Sources</span>
            </h4>
            <span className="text-[10px] text-slate-400">Vector Search</span>
          </div>

          <div className="space-y-2">
            {kbSources.length === 0 ? (
              <p className="text-[11px] text-slate-400">No grounded sources yet. Run Analyze with AI.</p>
            ) : (
              kbSources.map((source) => (
              <div
                key={source.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-1.5 group hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                    {source.title}
                  </p>
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-800 shrink-0">
                    {Math.round(source.relevance * 100)}% Match
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2">
                  {source.snippet}
                </p>

                <button
                  onClick={() => setPreviewArticleId(source.id)}
                  className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer pt-0.5"
                >
                  <span>View full article</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              ))
            )}
          </div>
        </div>

        {/* 6. Similar Past Tickets */}
        {similarTickets && similarTickets.length > 0 && (
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-indigo-500" />
                <span>Similar Past Tickets</span>
              </h4>
              <span className="text-[10px] text-slate-400">Memory</span>
            </div>

            <div className="space-y-2.5">
              {similarTickets.map((sim) => (
                <div
                  key={sim.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-semibold text-slate-600 dark:text-slate-400">
                      {sim.ticketNumber}
                    </span>
                    <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-1.5 py-0.2 rounded border border-indigo-200 dark:border-indigo-800">
                      {Math.round(sim.similarity * 100)}% Similarity
                    </span>
                  </div>

                  <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
                    {sim.title}
                  </p>

                  <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      Resolution:
                    </span>{' '}
                    {sim.resolution}
                  </div>

                  {onUseResolution && (
                    <button
                      onClick={() => onUseResolution(sim.resolution)}
                      className="w-full py-1 text-center text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 rounded-lg border border-indigo-200/80 dark:border-indigo-800 transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Zap className="w-3 h-3 text-amber-500" />
                      <span>Use Resolution</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
