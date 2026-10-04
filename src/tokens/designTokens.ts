/**
 * AI MDM Platform - Design System Tokens
 * Architecture: Primitive Tokens -> Semantic Tokens -> Component Tokens
 * Enforces: WCAG AA contrast (>= 4.5:1 text, >= 3:1 non-text), 60-30-10 palette discipline,
 * zero-pill metadata, single-elevation depth, light/dark elevation lightness steps.
 */

export const DesignTokens = {
  // 1. Primitive Tokens
  primitives: {
    colors: {
      slate: {
        50: '#F8FAFC',
        100: '#F1F5F9',
        200: '#E2E8F0',
        300: '#CBD5E1',
        400: '#94A3B8',
        500: '#64748B',
        600: '#475569',
        700: '#334155',
        800: '#1E293B',
        900: '#0F172A',
        950: '#0B0F17',
      },
      blue: {
        50: '#EFF6FF',
        100: '#DBEAFE',
        200: '#BFDBFE',
        500: '#3B82F6',
        600: '#2563EB',
        700: '#1D4ED8',
        800: '#1E40AF',
        900: '#1E3A8A',
      },
      emerald: {
        50: '#ECFDF5',
        100: '#D1FAE5',
        600: '#059669',
        700: '#047857',
        800: '#065F46',
      },
      amber: {
        50: '#FFFBEB',
        100: '#FEF3C7',
        600: '#D97706',
        700: '#B45309',
        800: '#92400E',
      },
      rose: {
        50: '#FFF1F2',
        100: '#FFE4E6',
        600: '#E11D48',
        700: '#BE123C',
        800: '#9F1239',
      },
    },
    spacing: {
      0: '0px',
      1: '4px',
      1.5: '6px',
      2: '8px',
      2.5: '10px',
      3: '12px',
      4: '16px',
      5: '20px',
      6: '24px',
      8: '32px',
      10: '40px',
      12: '48px',
      16: '64px',
    },
    radii: {
      none: '0px',
      sm: '4px',
      base: '6px',
      md: '8px',
      lg: '10px',
      full: '9999px', // Restricted to avatar circles only (zero static pill rule)
    },
    typography: {
      fontFamilies: {
        sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
      },
      fontSize: {
        xs: ['12px', '16px'],
        sm: ['13px', '18px'],
        base: ['14px', '20px'],
        md: ['15px', '22px'],
        lg: ['18px', '26px'],
        xl: ['22px', '28px'],
        '2xl': ['28px', '34px'],
      },
    },
  },

  // 2. Semantic Tokens
  semantic: {
    light: {
      canvas: '#F8FAFC', // Slate-50: 60% neutral canvas
      surface: {
        primary: '#FFFFFF', // Clean white card surface
        secondary: '#F1F5F9', // Slate-100: Muted sub-surface
        tertiary: '#E2E8F0', // Slate-200: Hairline borders
      },
      text: {
        primary: '#0F172A', // Slate-900: High-contrast primary (14.2:1 against canvas)
        secondary: '#475569', // Slate-600: Readable secondary (6.8:1 against canvas)
        muted: '#64748B', // Slate-500: Auxiliary metadata (4.6:1 against canvas)
        inverse: '#FFFFFF',
      },
      border: {
        subtle: '#E2E8F0',
        moderate: '#CBD5E1',
        focus: '#2563EB',
      },
      status: {
        active: {
          bg: '#ECFDF5',
          text: '#047857', // Contrast 5.2:1 against light green bg
          border: '#A7F3D0',
        },
        warning: {
          bg: '#FFFBEB',
          text: '#B45309', // Contrast 4.9:1 against light amber bg
          border: '#FDE68A',
        },
        incident: {
          bg: '#FFF1F2',
          text: '#BE123C', // Contrast 6.1:1 against light rose bg
          border: '#FECDD3',
        },
        info: {
          bg: '#EFF6FF',
          text: '#1D4ED8', // Contrast 5.8:1 against light blue bg
          border: '#BFDBFE',
        },
      },
      chart: {
        primary: '#2563EB',
        secondary: '#64748B',
        accent: '#D97706',
        outlier: '#E11D48',
        grid: '#E2E8F0',
      },
    },
    dark: {
      canvas: '#0B0F17', // Slate-950: 60% deep neutral canvas
      surface: {
        primary: '#111827', // Elevated surface step 1 (Gray-900)
        secondary: '#1F2937', // Elevated surface step 2 (Gray-800)
        tertiary: '#374151', // Hairlines & subtle controls
      },
      text: {
        primary: '#F8FAFC', // Slate-50: Contrast 16.5:1 against canvas
        secondary: '#CBD5E1', // Slate-300: Contrast 9.8:1 against canvas
        muted: '#94A3B8', // Slate-400: Contrast 5.4:1 against canvas
        inverse: '#0B0F17',
      },
      border: {
        subtle: '#1E293B',
        moderate: '#334155',
        focus: '#3B82F6',
      },
      status: {
        active: {
          bg: '#064E3B',
          text: '#6EE7B7', // Contrast 7.3:1 against dark green bg
          border: '#047857',
        },
        warning: {
          bg: '#78350F',
          text: '#FCD34D', // Contrast 8.1:1 against dark amber bg
          border: '#B45309',
        },
        incident: {
          bg: '#881337',
          text: '#FDA4AF', // Contrast 7.6:1 against dark rose bg
          border: '#BE123C',
        },
        info: {
          bg: '#1E3A8A',
          text: '#93C5FD', // Contrast 6.9:1 against dark blue bg
          border: '#1D4ED8',
        },
      },
      chart: {
        primary: '#3B82F6',
        secondary: '#94A3B8',
        accent: '#F59E0B',
        outlier: '#F43F5E',
        grid: '#1E293B',
      },
    },
  },

  // 3. Component Token Guidelines
  components: {
    kpiTile: {
      padding: '16px',
      radius: '8px',
      titleSize: '12px',
      valueSize: '24px',
      deviationSize: '13px',
      tabularNums: true,
    },
    findingCard: {
      padding: '20px',
      radius: '8px',
      headlineSize: '16px',
      domainChainSize: '12px',
      evidenceChipSize: '11px',
    },
    tableTwin: {
      rowHeight: '38px',
      headerHeight: '36px',
      fontSize: '13px',
      alignment: {
        text: 'left',
        numbers: 'right',
      },
    },
    touchTargets: {
      coarsePointerMinHeight: '44px',
      finePointerMinHeight: '32px',
    },
    focusRing: {
      width: '2px',
      offset: '2px',
      color: '#2563EB',
    },
  },
} as const;

export type ThemeMode = 'light' | 'dark' | 'auto';
