import React from 'react';
import { Sun, Moon, Monitor, Printer, FileText, CheckCircle2 } from 'lucide-react';
import { ThemeMode } from '../../tokens/designTokens';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tabId: string) => void;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  onOpenSpecs: () => void;
  onOpenA11y: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  theme,
  onThemeChange,
  onOpenSpecs,
  onOpenA11y,
}) => {
  const navItems = [
    { id: 'briefing', label: 'Briefing' },
    { id: 'trends', label: 'Trends' },
    { id: 'dq', label: 'Data Quality' },
    { id: 'ask', label: 'Ask' },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 no-print transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#briefing"
            onClick={(e) => {
              e.preventDefault();
              onTabChange('briefing');
            }}
            className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded px-1"
          >
            AI MDM Platform
          </a>
          <span className="hidden lg:inline text-xs text-slate-400 dark:text-slate-500 font-mono">
            v2.4·Postgres16·Kafka3.9
          </span>
        </div>

        {/* Zone 2: Clean 4-6 text navigation links */}
        <nav
          className="flex items-center gap-1 sm:gap-6 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 overflow-x-auto py-1"
          role="tablist"
          aria-label="Platform Views"
        >
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                role="tab"
                id={`tab-${item.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${item.id}`}
                onClick={() => onTabChange(item.id)}
                className={`py-1 px-2.5 sm:px-1 whitespace-nowrap cursor-pointer transition-colors border-b-2 font-medium ${
                  isActive
                    ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-semibold'
                    : 'border-transparent hover:text-slate-900 dark:hover:text-slate-100 hover:border-slate-300 dark:hover:border-slate-700'
                } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Theme switcher: Auto / Light / Dark */}
          <div
            className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-xs"
            role="group"
            aria-label="Theme selection"
          >
            <button
              type="button"
              onClick={() => onThemeChange('light')}
              className={`p-1.5 rounded transition-colors ${
                theme === 'light'
                  ? 'bg-white dark:bg-slate-700 text-amber-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
              } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600`}
              title="Light mode"
              aria-label="Switch to light theme"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onThemeChange('auto')}
              className={`p-1.5 rounded transition-colors ${
                theme === 'auto'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
              } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600`}
              title="Auto (follows OS)"
              aria-label="Follow system theme"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onThemeChange('dark')}
              className={`p-1.5 rounded transition-colors ${
                theme === 'dark'
                  ? 'bg-white dark:bg-slate-700 text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
              } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600`}
              title="Dark mode"
              aria-label="Switch to dark theme"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Print briefing action */}
          <button
            type="button"
            onClick={handlePrint}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            title="Print Executive Briefing report"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>

          {/* Specs & Accessibility audit */}
          <button
            type="button"
            onClick={onOpenSpecs}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            title="View Component Specs and Accessibility contrast audit"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Specs & A11y</span>
          </button>
        </div>
      </div>
    </header>
  );
};
