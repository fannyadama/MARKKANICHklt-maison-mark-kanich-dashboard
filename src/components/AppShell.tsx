import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpen,
  Coins,
  CreditCard,
  FileText,
  HelpCircle,
  History,
  Landmark,
  LayoutDashboard,
  Menu,
  Search,
  Settings,
  Shield,
  Sparkles,
  Terminal,
  TrendingUp,
  Wallet,
  X,
} from 'lucide-react';
import { useKLTStore } from '../context/KLTStoreContext';
import { RouteId } from '../types/klt';
import { BrandMark } from './BrandMark';
import { NotificationBellButton, ToastStack } from './NotificationCenter';

interface NavItem {
  id: RouteId;
  labelFr: string;
  labelEn: string;
  descFr: string;
  descEn: string;
  group: 'core' | 'ecosystem' | 'account';
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    labelFr: 'Tableau de bord',
    labelEn: 'Dashboard',
    descFr: 'Portefeuille, cours et actions rapides',
    descEn: 'Portfolio overview and quick actions',
    group: 'core',
    icon: LayoutDashboard,
  },
  {
    id: 'buy',
    labelFr: 'Acheter $KLT',
    labelEn: 'Buy $KLT',
    descFr: 'Acquisition multi-devises',
    descEn: 'Multi-currency purchase',
    group: 'core',
    icon: Coins,
  },
  {
    id: 'sell',
    labelFr: 'Vendre $KLT',
    labelEn: 'Sell $KLT',
    descFr: 'Conversion vers USD / EUR / XOF',
    descEn: 'Convert to USD / EUR / XOF',
    group: 'core',
    icon: CreditCard,
  },
  {
    id: 'trade',
    labelFr: 'Trading Avancé',
    labelEn: 'Advanced Trade',
    descFr: 'Chandeliers, SMA et ordres limites',
    descEn: 'Candlesticks and limit orders',
    group: 'core',
    icon: TrendingUp,
  },
  {
    id: 'solana-trading',
    labelFr: 'Solana & Staking',
    labelEn: 'Solana & Staking',
    descFr: 'Swap Raydium/Pump.fun & 15% APY',
    descEn: 'Raydium/Pump.fun Swap & 15% APY',
    group: 'core',
    icon: Sparkles,
  },
  {
    id: 'wallet',
    labelFr: 'Portefeuille',
    labelEn: 'Wallet & Vaults',
    descFr: 'Coffres SPL et carte Visa virtuelle',
    descEn: 'SPL vaults and virtual Visa card',
    group: 'core',
    icon: Wallet,
  },
  {
    id: 'history',
    labelFr: 'Historique & PDF',
    labelEn: 'History & PDF',
    descFr: 'Transactions et exports CSV/PDF',
    descEn: 'Transactions and CSV/PDF exports',
    group: 'core',
    icon: History,
  },
  {
    id: 'live-statistics',
    labelFr: 'Statistiques & Cours',
    labelEn: 'Live Stats & Rates',
    descFr: 'Métriques, registre CSV et marchés',
    descEn: 'Live metrics, CSV users and rates',
    group: 'ecosystem',
    icon: BarChart3,
  },
  {
    id: 'dao',
    labelFr: 'Gouvernance DAO',
    labelEn: 'DAO Governance',
    descFr: 'Propositions et votes $KLT',
    descEn: 'Proposals and $KLT voting',
    group: 'ecosystem',
    icon: Landmark,
  },
  {
    id: 'presentation',
    labelFr: 'Maison Mark Kanich',
    labelEn: 'Maison Mark Kanich',
    descFr: 'Six Maisons, Tokenomics, Sécurité & Tiers',
    descEn: 'Six Houses, Tokenomics, Security & Tiers',
    group: 'ecosystem',
    icon: FileText,
  },
  {
    id: 'klt-token',
    labelFr: 'Token $KLT',
    labelEn: '$KLT Token',
    descFr: 'Page dédiée, piliers, preuves et acquisition',
    descEn: 'Dedicated showcase, pillars, proofs & buy',
    group: 'ecosystem',
    icon: Coins,
  },
  {
    id: 'roadmap',
    labelFr: 'Roadmap',
    labelEn: 'Roadmap',
    descFr: 'Feuille de route en 4 phases (2026–2027)',
    descEn: '4-phase execution roadmap (2026–2027)',
    group: 'ecosystem',
    icon: TrendingUp,
  },
  {
    id: 'whitepaper',
    labelFr: 'Livre Blanc v3.1',
    labelEn: 'Whitepaper v3.1',
    descFr: 'Édition Pump.fun · Tokenomics',
    descEn: 'Pump.fun Edition · Tokenomics',
    group: 'ecosystem',
    icon: BookOpen,
  },
  {
    id: 'faq',
    labelFr: 'FAQ & Support',
    labelEn: 'FAQ & Support',
    descFr: 'Questions fréquentes et aide',
    descEn: 'Frequently asked questions',
    group: 'ecosystem',
    icon: HelpCircle,
  },
  {
    id: 'subscription',
    labelFr: 'Abonnements VIP',
    labelEn: 'VIP Plans',
    descFr: 'Standard, Privilège Pro & VIP',
    descEn: 'Standard, Privilege Pro & VIP',
    group: 'account',
    icon: CreditCard,
  },
  {
    id: '2fa',
    labelFr: 'Sécurité 2FA',
    labelEn: '2FA & Sessions',
    descFr: 'Codes TOTP et connexions actives',
    descEn: 'TOTP codes and active logins',
    group: 'account',
    icon: Shield,
  },
  {
    id: 'devnet-ops',
    labelFr: 'Devnet Ops (Admin)',
    labelEn: 'Devnet Ops (Admin)',
    descFr: 'Contrôle payer Solana & Raydium',
    descEn: 'Solana payer & Raydium control',
    group: 'account',
    icon: Terminal,
    adminOnly: true,
  },
  {
    id: 'settings',
    labelFr: 'Paramètres & Profil',
    labelEn: 'Profile & Settings',
    descFr: 'Compte, devise et rôle RBAC',
    descEn: 'Account, currency and RBAC role',
    group: 'account',
    icon: Settings,
  },
];

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { route, setRoute, language, setLanguage, t, user } = useKLTStore();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const visibleNavItems = NAV_ITEMS.filter((item) => !item.adminOnly || user.role === 'admin');
  const currentIdx = visibleNavItems.findIndex((i) => i.id === route);
  const currentItem = visibleNavItems[currentIdx] || visibleNavItems[0];
  const prevItem = currentIdx > 0 ? visibleNavItems[currentIdx - 1] : null;
  const nextItem = currentIdx >= 0 && currentIdx < visibleNavItems.length - 1 ? visibleNavItems[currentIdx + 1] : null;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target && (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable);
      if (e.key === 'Escape' && paletteOpen) {
        setPaletteOpen(false);
        return;
      }
      if (isInput || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === '/') {
        e.preventDefault();
        setPaletteOpen(true);
        window.setTimeout(() => searchInputRef.current?.focus(), 40);
      } else if (e.key === 'ArrowLeft' && prevItem && !paletteOpen) {
        e.preventDefault();
        setRoute(prevItem.id);
      } else if (e.key === 'ArrowRight' && nextItem && !paletteOpen) {
        e.preventDefault();
        setRoute(nextItem.id);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [nextItem, paletteOpen, prevItem, setRoute]);

  const filteredPalette = visibleNavItems.filter((item) => {
    const q = paletteQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      item.labelFr.toLowerCase().includes(q) ||
      item.labelEn.toLowerCase().includes(q) ||
      item.descFr.toLowerCase().includes(q) ||
      item.descEn.toLowerCase().includes(q)
    );
  });

  const handleSelectRoute = (id: RouteId) => {
    setRoute(id);
    setMobileNavOpen(false);
    setPaletteOpen(false);
    setPaletteQuery('');
  };

  const renderNavGroup = (group: NavItem['group'], headingFr: string, headingEn: string) => {
    const items = visibleNavItems.filter((i) => i.group === group);
    return (
      <div className="space-y-1">
        <p className="px-3 text-[11px] font-medium text-slate-500">{t(headingFr, headingEn)}</p>
        {items.map((item) => {
          const Icon = item.icon;
          const active = route === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelectRoute(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                active
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-amber-400' : 'text-slate-400'}`} />
              <span className="truncate">{t(item.labelFr, item.labelEn)}</span>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#060A13] text-slate-100 flex">
      {/* Desktop Sidebar */}
      <aside className="no-print hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0 border-r border-slate-800/90 bg-[#080D1A] sticky top-0 h-screen">
        <div className="p-4 border-b border-slate-800/90 flex items-center gap-3">
          <BrandMark size="sm" />
          <div className="min-w-0">
            <p className="font-serif-luxury text-sm font-bold text-white truncate">Maison Mark Kanich</p>
            <p className="text-[11px] text-amber-400 font-mono-tabular truncate">$KLT · Solana SPL</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-5">
          {renderNavGroup('core', 'Opérations & Marché', 'Trading & Portfolio')}
          {renderNavGroup('ecosystem', 'Écosystème & DAO', 'Ecosystem & DAO')}
          {renderNavGroup('account', 'Compte & Administration', 'Account & Admin')}
        </div>

        <div className="p-3 border-t border-slate-800/90">
          <button
            type="button"
            onClick={() => handleSelectRoute('settings')}
            className="w-full text-left p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <p className="text-xs font-semibold text-white truncate">{user.name}</p>
            <p className="text-[11px] text-slate-400 truncate">
              {user.role === 'admin' ? 'Admin' : 'Trader'} · {user.email}
            </p>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileNavOpen && (
        <div className="no-print fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/70"
            onClick={() => setMobileNavOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative w-72 max-w-[85vw] bg-[#080D1A] border-r border-slate-800 h-full flex flex-col z-10">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <BrandMark size="sm" />
                <span className="font-serif-luxury text-sm font-bold text-white">KLT Dashboard</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-5">
              {renderNavGroup('core', 'Opérations & Marché', 'Trading & Portfolio')}
              {renderNavGroup('ecosystem', 'Écosystème & DAO', 'Ecosystem & DAO')}
              {renderNavGroup('account', 'Compte & Administration', 'Account & Admin')}
            </div>
          </aside>
        </div>
      )}

      {/* Main Column */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Header */}
        <header className="no-print sticky top-0 z-30 h-14 border-b border-slate-800/90 bg-[#060A13]/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden p-2 rounded-lg border border-slate-800 text-slate-300 hover:text-white"
              aria-label="Menu"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 text-xs sm:text-sm min-w-0">
              <span className="text-slate-500 hidden sm:inline">KLT</span>
              <span className="text-slate-600 hidden sm:inline">/</span>
              <span className="font-semibold text-white truncate">
                {t(currentItem.labelFr, currentItem.labelEn)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                setPaletteOpen(true);
                window.setTimeout(() => searchInputRef.current?.focus(), 40);
              }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-xs text-slate-400 hover:text-white hover:border-slate-700 whitespace-nowrap shrink-0"
              title={t('Navigation rapide (/)', 'Quick jump (/)')}
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('Aller à...', 'Jump to...')}</span>
              <kbd className="px-1.5 py-0.5 text-[10px] rounded bg-slate-800 text-slate-300 font-mono-tabular">/</kbd>
            </button>

            <button
              type="button"
              onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
              className="px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-xs font-semibold text-slate-200 hover:border-slate-700 whitespace-nowrap shrink-0"
            >
              {language === 'fr' ? 'FR' : 'EN'}
            </button>

            <NotificationBellButton />

            <button
              type="button"
              onClick={() => handleSelectRoute('buy')}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
            >
              {t('Acheter $KLT', 'Buy $KLT')}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto">
          {children}

          {/* Page Stepper Footer (matches original PageNavigation.tsx keyboard workflow cleanly) */}
          <div className="no-print mt-10 pt-5 border-t border-slate-800/80 flex items-center justify-between gap-4 text-xs">
            <button
              type="button"
              disabled={!prevItem}
              onClick={() => prevItem && handleSelectRoute(prevItem.id)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-800 text-slate-300 hover:bg-slate-900 disabled:opacity-35 disabled:cursor-not-allowed whitespace-nowrap"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{prevItem ? t(prevItem.labelFr, prevItem.labelEn) : t('Début', 'Start')}</span>
            </button>

            <span className="text-slate-500 font-mono-tabular">
              {currentIdx + 1} / {visibleNavItems.length} · ← / →
            </span>

            <button
              type="button"
              disabled={!nextItem}
              onClick={() => nextItem && handleSelectRoute(nextItem.id)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-800 text-slate-300 hover:bg-slate-900 disabled:opacity-35 disabled:cursor-not-allowed whitespace-nowrap"
            >
              <span className="hidden sm:inline">{nextItem ? t(nextItem.labelFr, nextItem.labelEn) : t('Fin', 'End')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </main>
      </div>

      {/* Quick Jump Command Palette */}
      {paletteOpen && (
        <div
          className="no-print fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-start justify-center pt-20 p-4"
          onClick={() => setPaletteOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-[#0F172A] border border-slate-700 rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 border-b border-slate-800 flex items-center gap-2.5">
              <Search className="w-4 h-4 text-amber-400 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={paletteQuery}
                onChange={(e) => setPaletteQuery(e.target.value)}
                placeholder={t('Rechercher une page (Dashboard, Staking, Livre Blanc, DAO...) ', 'Search pages...')}
                className="flex-1 bg-transparent text-sm text-white focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setPaletteOpen(false)}
                className="text-xs text-slate-400 hover:text-white px-2 py-1"
              >
                ESC
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              {filteredPalette.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectRoute(item.id)}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                      route === item.id ? 'bg-amber-500/15 text-amber-300' : 'hover:bg-slate-900 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className="w-4 h-4 text-amber-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold truncate">{t(item.labelFr, item.labelEn)}</p>
                        <p className="text-[11px] text-slate-400 truncate">{t(item.descFr, item.descEn)}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <ToastStack />
    </div>
  );
};
