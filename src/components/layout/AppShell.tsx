'use client';

import React from 'react';
import { useApp, AppPage } from '../../context/AppContext';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { CommandPalette } from './CommandPalette';
import { ToastContainer } from '../ui/ToastContainer';
import { NewTicketModal } from '../tickets/NewTicketModal';
import { DashboardView } from '../dashboard/DashboardView';
import { TicketQueueView } from '../tickets/TicketQueueView';
import { AgentWorkspaceView } from '../tickets/AgentWorkspaceView';
import { KnowledgeBaseView } from '../knowledge-base/KnowledgeBaseView';
import { RoutingRulesView } from '../rules/RoutingRulesView';
import { AnalyticsView } from '../analytics/AnalyticsView';
import { PublicSubmitForm } from '../public-form/PublicSubmitForm';
import { SettingsView } from '../settings/SettingsView';
import { LoginPage } from '../auth/LoginPage';
import { RegisterPage } from '../auth/RegisterPage';
import { DataStatusBanner } from '../ui/DataStatusBanner';
import { cn } from '../../lib/utils';

interface AppShellProps {
  initialPage?: AppPage;
}

export const AppShell: React.FC<AppShellProps> = ({ initialPage }) => {
  const { activePage, setActivePage, isSidebarCollapsed } = useApp();

  React.useEffect(() => {
    if (initialPage && activePage !== initialPage) {
      setActivePage(initialPage);
    }
  }, [initialPage]);

  // Full-screen standalone authentication pages
  if (activePage === 'login') {
    return (
      <>
        <LoginPage />
        <ToastContainer />
      </>
    );
  }

  if (activePage === 'register') {
    return (
      <>
        <RegisterPage />
        <ToastContainer />
      </>
    );
  }

  const renderActiveView = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardView />;
      case 'tickets':
        return <TicketQueueView />;
      case 'workspace':
        return <AgentWorkspaceView />;
      case 'knowledge-base':
        return <KnowledgeBaseView />;
      case 'rules':
        return <RoutingRulesView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'submit-ticket':
        return <PublicSubmitForm />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Header */}
      <Header />

      {/* Main Content Area */}
      <main
        id="app-main-content"
        className={cn(
          'flex-1 transition-all duration-300 p-4 md:p-6',
          isSidebarCollapsed ? 'md:pl-22' : 'md:pl-70'
        )}
      >
        <DataStatusBanner />
        {renderActiveView()}
      </main>

      {/* Global Overlays & Modals */}
      <CommandPalette />
      <NewTicketModal />
      <ToastContainer />
    </div>
  );
};
