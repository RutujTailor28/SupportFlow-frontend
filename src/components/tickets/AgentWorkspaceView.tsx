'use client';

import React, { useState } from 'react';
import { TicketListPanel } from './TicketListPanel';
import { TicketConversationPanel } from './TicketConversationPanel';
import { AIAssistPanel } from './AIAssistPanel';
import { ArticlePreviewModal } from './ArticlePreviewModal';
import { PanelLeft, PanelRight, Sparkles, Inbox } from 'lucide-react';

export const AgentWorkspaceView: React.FC = () => {
  const [isLeftPanelVisible, setIsLeftPanelVisible] = useState(true);
  const [isRightPanelVisible, setIsRightPanelVisible] = useState(true);
  const [externalDraftInsert, setExternalDraftInsert] = useState<string | undefined>(undefined);

  const handleUseResolution = (resolution: string) => {
    setExternalDraftInsert(resolution);
  };

  return (
    <div id="agent-workspace-view" className="h-[calc(100vh-6rem)] -m-4 md:-m-6 flex flex-col bg-slate-100 dark:bg-slate-950 overflow-hidden">
      {/* Mobile / Tablet Panel Toggle Bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-2 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-xs shrink-0">
        <button
          onClick={() => setIsLeftPanelVisible(prev => !prev)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
        >
          <Inbox className="w-3.5 h-3.5 text-indigo-500" />
          <span>{isLeftPanelVisible ? 'Hide Tickets' : 'Show Tickets'}</span>
        </button>

        <button
          onClick={() => setIsRightPanelVisible(prev => !prev)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>{isRightPanelVisible ? 'Hide AI Assist' : 'Show AI Assist'}</span>
        </button>
      </div>

      {/* 3-Panel Main Layout Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Ticket List (280px - 320px) */}
        {isLeftPanelVisible && (
          <div className="w-full sm:w-80 lg:w-72 xl:w-80 shrink-0 h-full overflow-hidden border-r border-slate-200/80 dark:border-slate-800">
            <TicketListPanel />
          </div>
        )}

        {/* Center Panel: Ticket Detail & Conversation & Reply Composer */}
        <div className="flex-1 h-full overflow-hidden min-w-0">
          <TicketConversationPanel
            externalDraftInsert={externalDraftInsert}
            onUseResolution={handleUseResolution}
          />
        </div>

        {/* Right Panel: AI Assist & Grounding & Similar Tickets (320px - 380px) */}
        {isRightPanelVisible && (
          <div className="hidden md:block w-80 lg:w-84 xl:w-96 shrink-0 h-full overflow-hidden border-l border-slate-200/80 dark:border-slate-800">
            <AIAssistPanel onUseResolution={handleUseResolution} />
          </div>
        )}
      </div>

      {/* KB Article Preview Modal */}
      <ArticlePreviewModal />
    </div>
  );
};
