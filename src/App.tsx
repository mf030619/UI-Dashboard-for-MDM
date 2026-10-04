/**
 * AI MDM Platform - Main Application Component
 * Implements: 4 primary screens, URL-synced view state, ARIA tablist patterns,
 * Theme switching (light/dark/auto), Evidence Inspector drawer, and Deliverables Modal.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { ThemeMode } from './tokens/designTokens';
import { EvidenceId } from './types/mdm';
import { mockBriefing } from './mockData/dataset';
import { Header } from './components/common/Header';
import { EvidenceDrawer } from './components/common/EvidenceDrawer';
import { SpecsAndA11yModal } from './components/modals/SpecsAndA11yModal';
import { BriefingScreen } from './screens/BriefingScreen';
import { TrendsScreen } from './screens/TrendsScreen';
import { DataQualityScreen } from './screens/DataQualityScreen';
import { AskScreen } from './screens/AskScreen';
import { RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';

const VALID_TABS = ['briefing', 'trends', 'dq', 'ask'] as const;
type TabId = (typeof VALID_TABS)[number];

export default function App() {
  // 1. URL-synced view state with validation on read
  const getInitialTab = (): TabId => {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    if (VALID_TABS.includes(hash as TabId)) {
      return hash as TabId;
    }
    return 'briefing';
  };

  const [currentTab, setCurrentTab] = useState<TabId>(getInitialTab);
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<EvidenceId | null>(null);
  const [isSpecsModalOpen, setIsSpecsModalOpen] = useState(false);
  const [screenReaderAnnouncement, setScreenReaderAnnouncement] = useState('');

  // 2. Theme State & System OS Listener
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const stored = localStorage.getItem('aimdm_theme');
      if (stored === 'light' || stored === 'dark' || stored === 'auto') {
        return stored;
      }
    } catch (e) {}
    return 'auto';
  });

  const applyTheme = useCallback((mode: ThemeMode) => {
    const root = document.documentElement;
    const isDark =
      mode === 'dark' ||
      (mode === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    applyTheme(theme);
    try {
      localStorage.setItem('aimdm_theme', theme);
    } catch (e) {}

    // Listen to OS system preference change when on 'auto'
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      if (theme === 'auto') {
        applyTheme('auto');
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [theme, applyTheme]);

  // Sync hash change
  useEffect(() => {
    const handleHashChange = () => {
      const tab = getInitialTab();
      setCurrentTab(tab);
      setScreenReaderAnnouncement(`Navigated to ${tab} view`);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabChange = (newTab: string) => {
    if (VALID_TABS.includes(newTab as TabId)) {
      setCurrentTab(newTab as TabId);
      window.location.hash = newTab;
      setScreenReaderAnnouncement(`Navigated to ${newTab} view`);
    }
  };

  const handleSelectEvidence = (id: EvidenceId) => {
    setSelectedEvidenceId(id);
    setScreenReaderAnnouncement(`Inspecting evidence ${id}`);
  };

  // Keyboard navigation for tablist (ArrowLeft, ArrowRight, Home, End)
  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = VALID_TABS.indexOf(currentTab);
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % VALID_TABS.length;
      handleTabChange(VALID_TABS[nextIndex]);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + VALID_TABS.length) % VALID_TABS.length;
      handleTabChange(VALID_TABS[prevIndex]);
    } else if (e.key === 'Home') {
      e.preventDefault();
      handleTabChange(VALID_TABS[0]);
    } else if (e.key === 'End') {
      e.preventDefault();
      handleTabChange(VALID_TABS[VALID_TABS.length - 1]);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 transition-colors"
      onKeyDown={handleTabKeyDown}
    >
      {/* Screen Reader ARIA Live Region */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {screenReaderAnnouncement}
      </div>

      {/* Top Bar Navigation (Strict 3-zone contract) */}
      <Header
        currentTab={currentTab}
        onTabChange={handleTabChange}
        theme={theme}
        onThemeChange={setTheme}
        onOpenSpecs={() => setIsSpecsModalOpen(true)}
        onOpenA11y={() => setIsSpecsModalOpen(true)}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 pb-16" id={`panel-${currentTab}`} role="tabpanel" tabIndex={0}>
        {currentTab === 'briefing' && (
          <BriefingScreen report={mockBriefing} onSelectEvidence={handleSelectEvidence} />
        )}
        {currentTab === 'trends' && <TrendsScreen />}
        {currentTab === 'dq' && <DataQualityScreen />}
        {currentTab === 'ask' && <AskScreen onSelectEvidence={handleSelectEvidence} />}
      </main>

      {/* Evidence Drawer Slide-over */}
      <EvidenceDrawer
        evidenceId={selectedEvidenceId}
        onClose={() => setSelectedEvidenceId(null)}
      />

      {/* Specifications & Accessibility Contrast Audit Modal */}
      <SpecsAndA11yModal
        isOpen={isSpecsModalOpen}
        onClose={() => setIsSpecsModalOpen(false)}
      />

      {/* Quiet, clean Footer (Anti-slop: zero fake telemetry tickers, zero animated counters) */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 py-4 px-6 text-xs text-slate-500 no-print transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              AI MDM Platform
            </span>
            <span>·</span>
            <span>Real-Time Ingestion &amp; Causal Intelligence</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsSpecsModalOpen(true)}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors underline"
            >
              WCAG AA Contrast Audit
            </button>
            <span>·</span>
            <span>PostgreSQL 16 · Kafka 3.9 · FastAPI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
