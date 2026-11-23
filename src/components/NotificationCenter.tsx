import React, { useState } from 'react';
import {
  ArrowRight,
  Award,
  Bell,
  CheckCheck,
  Coins,
  Plus,
  Trash2,
  TrendingUp,
  X,
} from 'lucide-react';
import { useKLTStore } from '../context/KLTStoreContext';
import { NotificationCategory } from '../types/klt';

function getCategoryMeta(category: NotificationCategory) {
  switch (category) {
    case 'transaction':
      return {
        icon: Coins,
        accent: 'text-emerald-400',
        border: 'border-emerald-500/40',
        bg: 'bg-[#0C1B18]',
      };
    case 'staking':
      return {
        icon: Award,
        accent: 'text-amber-400',
        border: 'border-amber-500/40',
        bg: 'bg-[#18140C]',
      };
    case 'price_alert':
      return {
        icon: TrendingUp,
        accent: 'text-sky-400',
        border: 'border-sky-500/40',
        bg: 'bg-[#0C1626]',
      };
    default:
      return {
        icon: Bell,
        accent: 'text-slate-300',
        border: 'border-slate-700',
        bg: 'bg-slate-900',
      };
  }
}

export const ToastStack: React.FC = () => {
  const { toasts, dismissToast, setRoute } = useKLTStore();

  if (toasts.length === 0) return null;

  return (
    <div
      className="no-print fixed bottom-4 right-4 z-50 space-y-2.5 w-[calc(100vw-2rem)] max-w-sm"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((toast) => {
        const meta = getCategoryMeta(toast.category);
        const Icon = meta.icon;
        const isErr = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`p-3.5 rounded-xl border shadow-2xl backdrop-blur-md transition-all duration-200 ${
              isErr
                ? 'bg-red-950/95 border-red-500/50 text-red-100'
                : `${meta.bg}/95 ${meta.border} text-slate-100`
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-lg bg-slate-950/70 border border-slate-800 shrink-0 ${
                  isErr ? 'text-red-400' : meta.accent
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-white truncate">{toast.title}</p>
                  <button
                    type="button"
                    onClick={() => dismissToast(toast.id)}
                    className="text-slate-400 hover:text-white shrink-0"
                    aria-label="Fermer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{toast.message}</p>

                <div className="flex items-center justify-between gap-2 mt-2">
                  <span className="text-[10px] font-mono-tabular text-slate-500">
                    {toast.timestamp.slice(11, 19)}
                  </span>
                  {toast.actionRoute && toast.actionLabel && (
                    <button
                      type="button"
                      onClick={() => {
                        setRoute(toast.actionRoute!);
                        dismissToast(toast.id);
                      }}
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold ${meta.accent} hover:underline`}
                    >
                      {toast.actionLabel}
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const NotificationBellButton: React.FC = () => {
  const {
    t,
    kltPriceUsd,
    unreadNotificationsCount,
    notificationsLog,
    priceAlerts,
    addPriceAlert,
    togglePriceAlert,
    rearmPriceAlert,
    deletePriceAlert,
    markAllNotificationsRead,
    clearNotificationsLog,
    triggerSampleMilestoneOrAlert,
    setRoute,
  } = useKLTStore();

  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'feed' | 'alerts'>('feed');
  const [condition, setCondition] = useState<'above' | 'below'>('above');
  const [targetPrice, setTargetPrice] = useState((kltPriceUsd * 1.05).toFixed(4));

  const handleOpenToggle = () => {
    const next = !open;
    setOpen(next);
    if (next && unreadNotificationsCount > 0) {
      markAllNotificationsRead();
    }
  };

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(targetPrice);
    if (!val || val <= 0) return;
    addPriceAlert(condition, val);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleOpenToggle}
        className="relative inline-flex items-center justify-center p-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:border-slate-700 transition-colors shrink-0"
        aria-label={t('Centre de notifications et alertes prix', 'Notification & Price Alert Center')}
        title={t('Notifications & Alertes $KLT', 'Notifications & $KLT Alerts')}
      >
        <Bell className="w-4 h-4" />
        {unreadNotificationsCount > 0 && (
          <span className="ml-1.5 text-[11px] font-mono-tabular font-semibold text-amber-400">
            {unreadNotificationsCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed sm:absolute right-4 sm:right-0 top-14 sm:top-11 z-50 w-[calc(100vw-2rem)] sm:w-96 bg-[#0F172A] border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
            <div className="p-3.5 border-b border-slate-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
                <button
                  type="button"
                  onClick={() => setTab('feed')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                    tab === 'feed' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t('Activité', 'Activity')} ({notificationsLog.length})
                </button>
                <button
                  type="button"
                  onClick={() => setTab('alerts')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                    tab === 'alerts' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t('Alertes Prix', 'Price Alerts')} ({priceAlerts.length})
                </button>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
                aria-label="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {tab === 'feed' ? (
              <div className="divide-y divide-slate-800/80">
                <div className="p-2.5 bg-slate-900/60 flex items-center justify-between gap-2 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => triggerSampleMilestoneOrAlert('staking')}
                      className="px-2 py-1 rounded border border-amber-500/30 text-amber-300 hover:bg-amber-500/10 whitespace-nowrap"
                    >
                      {t('Tester palier staking', 'Test Staking Milestone')}
                    </button>
                    <button
                      type="button"
                      onClick={() => triggerSampleMilestoneOrAlert('price_alert')}
                      className="px-2 py-1 rounded border border-sky-500/30 text-sky-300 hover:bg-sky-500/10 whitespace-nowrap"
                    >
                      {t('Tester alerte prix', 'Test Price Alert')}
                    </button>
                  </div>
                  {notificationsLog.length > 0 && (
                    <button
                      type="button"
                      onClick={clearNotificationsLog}
                      className="text-slate-400 hover:text-white inline-flex items-center gap-1"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      {t('Vider', 'Clear')}
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
                  {notificationsLog.length === 0 ? (
                    <p className="p-6 text-center text-xs text-slate-400">
                      {t('Aucune notification récente.', 'No recent notifications.')}
                    </p>
                  ) : (
                    notificationsLog.map((item) => {
                      const meta = getCategoryMeta(item.category);
                      const Icon = meta.icon;
                      return (
                        <div key={item.id} className="p-3.5 hover:bg-slate-900/50 flex items-start gap-2.5">
                          <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${meta.accent}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-white">{item.title}</p>
                            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{item.message}</p>
                            <div className="flex items-center justify-between mt-1.5">
                              <span className="text-[10px] font-mono-tabular text-slate-500">
                                {item.timestamp}
                              </span>
                              {item.actionRoute && item.actionLabel && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setRoute(item.actionRoute!);
                                    setOpen(false);
                                  }}
                                  className={`text-[11px] font-medium ${meta.accent} hover:underline`}
                                >
                                  {item.actionLabel} →
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                <form onSubmit={handleCreateAlert} className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">{t('Cours actuel $KLT', 'Current $KLT')}</span>
                    <span className="font-mono-tabular font-semibold text-amber-400">
                      ${kltPriceUsd.toFixed(4)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={condition}
                      onChange={(e) => setCondition(e.target.value as 'above' | 'below')}
                      className="px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="above">{t('Au-dessus (≥)', 'Above (≥)')}</option>
                      <option value="below">{t('En dessous (≤)', 'Below (≤)')}</option>
                    </select>
                    <input
                      type="number"
                      step="0.0001"
                      min="0"
                      value={targetPrice}
                      onChange={(e) => setTargetPrice(e.target.value)}
                      className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 font-mono-tabular text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      {t('Ajouter', 'Add')}
                    </button>
                  </div>
                </form>

                <div className="max-h-60 overflow-y-auto divide-y divide-slate-800/70">
                  {priceAlerts.map((rule) => (
                    <div key={rule.id} className="py-2.5 flex items-center justify-between gap-2 text-xs">
                      <div className="min-w-0">
                        <p className="font-mono-tabular font-semibold text-white truncate">
                          $KLT {rule.condition === 'above' ? '≥' : '≤'} ${rule.targetPriceUsd.toFixed(4)}
                          {rule.label ? ` · ${rule.label}` : ''}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {rule.triggered
                            ? t('Déclenchée', 'Triggered')
                            : rule.active
                            ? t('Active · Surveillance cours', 'Active · Monitoring')
                            : t('En pause', 'Paused')}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => (rule.triggered ? rearmPriceAlert(rule.id) : togglePriceAlert(rule.id))}
                          className={`px-2 py-1 rounded border text-[11px] font-medium ${
                            rule.active && !rule.triggered
                              ? 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10'
                              : 'border-slate-700 text-slate-400'
                          }`}
                        >
                          {rule.triggered ? t('Réarmer', 'Re-arm') : rule.active ? 'ON' : 'OFF'}
                        </button>
                        <button
                          type="button"
                          onClick={() => deletePriceAlert(rule.id)}
                          className="p-1 text-slate-400 hover:text-red-400"
                          aria-label="Supprimer alerte"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setRoute('dashboard');
                      setOpen(false);
                      window.setTimeout(() => {
                        document.getElementById('price-alerts-config')?.scrollIntoView({
                          behavior: 'smooth',
                          block: 'start',
                        });
                      }, 80);
                    }}
                    className="text-[11px] font-semibold text-amber-400 hover:text-amber-300"
                  >
                    {t('Configuration avancée →', 'Full configuration →')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
