import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  Bell,
  BellOff,
  CheckCircle2,
  PauseCircle,
  Play,
  Plus,
  RefreshCw,
  RotateCcw,
  Trash2,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { useKLTStore } from '../context/KLTStoreContext';

export const PriceAlertConfigSection: React.FC = () => {
  const {
    t,
    user,
    updateUserProfile,
    kltPriceUsd,
    priceAlerts,
    addPriceAlert,
    togglePriceAlert,
    rearmPriceAlert,
    deletePriceAlert,
    setKltSimulatedPrice,
    refreshMarketPrices,
    autoPriceWatch,
    setAutoPriceWatch,
  } = useKLTStore();

  const [condition, setCondition] = useState<'above' | 'below'>('above');
  const [targetInput, setTargetInput] = useState<string>((kltPriceUsd * 1.05).toFixed(4));
  const [labelInput, setLabelInput] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'active' | 'triggered'>('all');
  const [simPriceInput, setSimPriceInput] = useState<string>(kltPriceUsd.toFixed(4));
  const [formError, setFormError] = useState<string>('');
  const testTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (testTimerRef.current !== null) {
        window.clearTimeout(testTimerRef.current);
      }
    };
  }, []);

  const parsedTarget = parseFloat(targetInput);
  const pctDiff = useMemo(() => {
    if (!Number.isFinite(parsedTarget) || parsedTarget <= 0 || kltPriceUsd <= 0) return null;
    return ((parsedTarget - kltPriceUsd) / kltPriceUsd) * 100;
  }, [kltPriceUsd, parsedTarget]);

  const applyOffsetPreset = (pct: number) => {
    const nextCond: 'above' | 'below' = pct >= 0 ? 'above' : 'below';
    const nextVal = Math.max(0.0001, kltPriceUsd * (1 + pct / 100));
    setCondition(nextCond);
    setTargetInput(nextVal.toFixed(4));
    setFormError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!Number.isFinite(parsedTarget) || parsedTarget <= 0) {
      setFormError(
        t('Veuillez saisir un seuil de prix USD strictement positif.', 'Please enter a positive USD target price.')
      );
      return;
    }
    setFormError('');
    addPriceAlert(condition, parsedTarget, labelInput);
    setLabelInput('');
  };

  const handleSimulateCustomPrice = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(simPriceInput);
    if (!Number.isFinite(val) || val <= 0) return;
    setKltSimulatedPrice(val, true);
  };

  const filteredAlerts = useMemo(() => {
    return priceAlerts.filter((rule) => {
      if (filter === 'active') return rule.active && !rule.triggered;
      if (filter === 'triggered') return rule.triggered;
      return true;
    });
  }, [filter, priceAlerts]);

  const activeCount = priceAlerts.filter((r) => r.active && !r.triggered).length;
  const triggeredCount = priceAlerts.filter((r) => r.triggered).length;

  return (
    <section
      id="price-alerts-config"
      className="scroll-mt-20 bg-[#0F172A] border border-slate-800 rounded-xl p-6 space-y-6"
    >
      {/* Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-400" />
            <h2 className="text-lg font-semibold text-white">
              {t('Configuration des Alertes de Prix $KLT', '$KLT Price Alert Configuration')}
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {t(
              'Définissez vos seuils personnalisés pour recevoir une notification toast dès que le $KLT atteint le prix cible.',
              'Configure custom price thresholds to receive a real-time toast notification when $KLT reaches your target.'
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="text-xs font-mono-tabular pr-3 border-r border-slate-800">
            <span className="text-slate-400 block">{t('Cours $KLT Actuel', 'Current $KLT')}</span>
            <span className="text-base font-bold text-amber-400">${kltPriceUsd.toFixed(4)}</span>
          </div>

          <button
            type="button"
            onClick={() => setAutoPriceWatch(!autoPriceWatch)}
            className={`min-h-[40px] inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border text-xs font-semibold transition-colors whitespace-nowrap ${
              autoPriceWatch
                ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-300'
                : 'border-slate-700 bg-slate-900 text-slate-300 hover:text-white'
            }`}
          >
            {autoPriceWatch ? <PauseCircle className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-amber-400" />}
            {autoPriceWatch
              ? t('Surveillance auto : ON (8s)', 'Auto stream: ON (8s)')
              : t('Surveillance auto : OFF', 'Auto stream: OFF')}
          </button>

          <button
            type="button"
            onClick={refreshMarketPrices}
            className="min-h-[40px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs font-medium text-slate-200 transition-colors whitespace-nowrap"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            {t('Actualiser cours', 'Refresh')}
          </button>
        </div>
      </div>

      {/* Warning if user turned off priceAlerts preference in Settings */}
      {!user.notifications.priceAlerts && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs">
          <div className="flex items-center gap-2 text-amber-200">
            <BellOff className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              {t(
                'Les notifications toast d’alerte prix sont désactivées dans vos paramètres.',
                'Price alert toast notifications are currently disabled in your preferences.'
              )}
            </span>
          </div>
          <button
            type="button"
            onClick={() =>
              updateUserProfile({
                notifications: { ...user.notifications, priceAlerts: true },
              })
            }
            className="px-3 py-1.5 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold whitespace-nowrap shrink-0"
          >
            {t('Activer les alertes', 'Enable alerts')}
          </button>
        </div>
      )}

      {/* Creation Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          {/* Direction Segmented Control */}
          <div className="md:col-span-3 space-y-1.5">
            <span className="block text-xs font-medium text-slate-300">
              {t('Condition de seuil', 'Threshold condition')}
            </span>
            <div className="grid grid-cols-2 gap-1 p-1 rounded-lg bg-slate-900 border border-slate-800">
              <button
                type="button"
                onClick={() => setCondition('above')}
                className={`min-h-[36px] inline-flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                  condition === 'above'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                {t('Hausse ≥', 'Above ≥')}
              </button>
              <button
                type="button"
                onClick={() => setCondition('below')}
                className={`min-h-[36px] inline-flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                  condition === 'below'
                    ? 'bg-red-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <TrendingDown className="w-3.5 h-3.5" />
                {t('Baisse ≤', 'Below ≤')}
              </button>
            </div>
          </div>

          {/* Target Price USD */}
          <div className="md:col-span-3 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="alert-target-price" className="font-medium text-slate-300">
                {t('Prix cible (USD)', 'Target Price (USD)')}
              </label>
              {pctDiff !== null && (
                <span
                  className={`font-mono-tabular ${
                    pctDiff >= 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {pctDiff >= 0 ? '+' : ''}
                  {pctDiff.toFixed(2)}%
                </span>
              )}
            </div>
            <input
              id="alert-target-price"
              type="number"
              step="0.0001"
              min="0.0001"
              value={targetInput}
              onChange={(e) => {
                setTargetInput(e.target.value);
                setFormError('');
              }}
              className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono-tabular text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Optional Label */}
          <div className="md:col-span-4 space-y-1.5">
            <label htmlFor="alert-label" className="block text-xs font-medium text-slate-300">
              {t('Note / Libellé (optionnel)', 'Label / Note (optional)')}
            </label>
            <input
              id="alert-label"
              type="text"
              maxLength={48}
              value={labelInput}
              onChange={(e) => setLabelInput(e.target.value)}
              placeholder={t('Ex : Objectif Raydium, Zone d’achat...', 'e.g., Raydium Target, Accumulation...')}
              className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500 placeholder:text-slate-500"
            />
          </div>

          {/* Submit */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              {t('Créer l’alerte', 'Create Alert')}
            </button>
          </div>
        </div>

        {/* Quick Offset Presets */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 mr-1">{t('Seuils rapides :', 'Quick targets:')}</span>
            {[-5, -2, 2, 5, 10].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => applyOffsetPreset(pct)}
                className="px-2.5 py-1 rounded-md border border-slate-700 bg-slate-900 hover:border-amber-500/50 text-slate-200 font-mono-tabular transition-colors"
              >
                {pct > 0 ? `+${pct}%` : `${pct}%`}
              </button>
            ))}
          </div>

          {formError && <p className="text-xs text-red-400">{formError}</p>}
        </div>
      </form>

      {/* Price Simulator Strip for immediate verification */}
      <form
        onSubmit={handleSimulateCustomPrice}
        className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Activity className="w-4 h-4 text-sky-400 shrink-0" />
          <span>
            {t(
              'Test de seuil : simulez un cours $KLT pour vérifier le déclenchement immédiat des notifications toast.',
              'Threshold test: simulate a $KLT price to verify instant toast alert triggering.'
            )}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              const down = +(kltPriceUsd * 0.97).toFixed(4);
              setSimPriceInput(down.toFixed(4));
              setKltSimulatedPrice(down, true);
            }}
            className="min-h-[36px] px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-red-300 font-mono-tabular text-xs whitespace-nowrap"
          >
            -3%
          </button>
          <button
            type="button"
            onClick={() => {
              const up = +(kltPriceUsd * 1.03).toFixed(4);
              setSimPriceInput(up.toFixed(4));
              setKltSimulatedPrice(up, true);
            }}
            className="min-h-[36px] px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-emerald-300 font-mono-tabular text-xs whitespace-nowrap"
          >
            +3%
          </button>
          <input
            type="number"
            step="0.0001"
            min="0.0001"
            aria-label={t('Prix de test USD', 'Test price USD')}
            value={simPriceInput}
            onChange={(e) => setSimPriceInput(e.target.value)}
            className="w-28 min-h-[36px] px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 font-mono-tabular text-xs text-white focus:outline-none focus:border-sky-400"
          />
          <button
            type="submit"
            className="min-h-[36px] px-3 py-1.5 rounded-lg border border-sky-500/40 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 text-xs font-semibold whitespace-nowrap"
          >
            {t('Appliquer cours', 'Apply price')}
          </button>
        </div>
      </form>

      {/* Rules List & Filter Tabs */}
      <div className="pt-4 border-t border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
            {[
              { id: 'all' as const, label: `${t('Toutes', 'All')} (${priceAlerts.length})` },
              { id: 'active' as const, label: `${t('Actives', 'Active')} (${activeCount})` },
              { id: 'triggered' as const, label: `${t('Déclenchées', 'Triggered')} (${triggeredCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                  filter === tab.id ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-400 font-mono-tabular">
            {activeCount} {t('en surveillance', 'monitoring')}
          </span>
        </div>

        {filteredAlerts.length === 0 ? (
          <div className="py-8 text-center border border-dashed border-slate-800 rounded-lg space-y-2">
            <p className="text-sm text-slate-300 font-medium">
              {t('Aucune alerte dans cette vue.', 'No alerts match this filter.')}
            </p>
            <p className="text-xs text-slate-500">
              {t(
                'Utilisez le formulaire ci-dessus pour ajouter un seuil de surveillance sur le $KLT.',
                'Use the form above to add a $KLT price threshold.'
              )}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {filteredAlerts.map((rule) => {
              const delta = ((rule.targetPriceUsd - kltPriceUsd) / kltPriceUsd) * 100;
              const isAbove = rule.condition === 'above';
              return (
                <div
                  key={rule.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-900/40 px-2 rounded-lg transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="mt-0.5 shrink-0">
                      {isAbove ? (
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {rule.actionIntent && (
                          <span
                            className={`text-[10px] font-semibold uppercase ${
                              rule.actionIntent === 'buy' ? 'text-emerald-400' : 'text-amber-400'
                            }`}
                          >
                            {rule.actionIntent === 'buy' ? t('ACHAT', 'BUY') : t('VENTE', 'SELL')}
                          </span>
                        )}
                        <span className="font-mono-tabular text-sm font-semibold text-white">
                          $KLT {isAbove ? '≥' : '≤'} ${rule.targetPriceUsd.toFixed(4)}
                        </span>
                        <span className="text-xs text-slate-500" aria-hidden="true">
                          ·
                        </span>
                        <span
                          className={`text-xs font-mono-tabular ${
                            delta >= 0 ? 'text-emerald-400' : 'text-red-400'
                          }`}
                        >
                          {delta >= 0 ? '+' : ''}
                          {delta.toFixed(2)}%
                        </span>
                        {rule.label && (
                          <>
                            <span className="text-xs text-slate-500" aria-hidden="true">
                              ·
                            </span>
                            <span className="text-xs text-amber-300 font-medium truncate">
                              {rule.label}
                            </span>
                          </>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {rule.triggered ? (
                          <span className="inline-flex items-center gap-1 text-amber-400 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {t('Seuil atteint · Toast envoyé', 'Threshold reached · Toast sent')}
                            {rule.triggeredAt ? ` (${rule.triggeredAt.slice(11, 19)})` : ''}
                          </span>
                        ) : rule.active ? (
                          <span className="text-emerald-400">
                            {t('Active · Surveillance en cours', 'Active · Monitoring')}
                          </span>
                        ) : (
                          <span className="text-slate-500">{t('En pause', 'Paused')}</span>
                        )}
                        <span aria-hidden="true"> · </span>
                        <span className="font-mono-tabular text-slate-500">
                          {t('Créée le', 'Created')} {rule.createdAt.slice(0, 16)}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {!rule.triggered && rule.active && (
                      <button
                        type="button"
                        onClick={() => {
                          if (testTimerRef.current !== null) {
                            window.clearTimeout(testTimerRef.current);
                          }
                          const alreadyPast =
                            (rule.condition === 'above' && kltPriceUsd >= rule.targetPriceUsd) ||
                            (rule.condition === 'below' && kltPriceUsd <= rule.targetPriceUsd);
                          setSimPriceInput(rule.targetPriceUsd.toFixed(4));
                          if (alreadyPast) {
                            const preStep =
                              rule.condition === 'above'
                                ? Math.max(0.0001, +(rule.targetPriceUsd - 0.0005).toFixed(4))
                                : +(rule.targetPriceUsd + 0.0005).toFixed(4);
                            setKltSimulatedPrice(preStep);
                            testTimerRef.current = window.setTimeout(() => {
                              setKltSimulatedPrice(rule.targetPriceUsd);
                            }, 40);
                          } else {
                            setKltSimulatedPrice(rule.targetPriceUsd);
                          }
                        }}
                        className="min-h-[34px] px-2.5 py-1 rounded-md border border-sky-500/30 text-sky-300 hover:bg-sky-500/10 text-xs font-medium whitespace-nowrap"
                        title={t('Simuler le franchissement de ce seuil', 'Simulate crossing this threshold')}
                      >
                        {t('Tester seuil', 'Test threshold')}
                      </button>
                    )}

                    {rule.triggered ? (
                      <button
                        type="button"
                        onClick={() => rearmPriceAlert(rule.id)}
                        className="min-h-[34px] inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 text-xs font-semibold whitespace-nowrap"
                      >
                        <RotateCcw className="w-3 h-3" />
                        {t('Réarmer', 'Re-arm')}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => togglePriceAlert(rule.id)}
                        className={`min-h-[34px] px-2.5 py-1 rounded-md border text-xs font-semibold whitespace-nowrap ${
                          rule.active
                            ? 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10'
                            : 'border-slate-700 text-slate-400 hover:text-white'
                        }`}
                      >
                        {rule.active ? 'ON' : 'OFF'}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => deletePriceAlert(rule.id)}
                      className="min-h-[34px] min-w-[34px] inline-flex items-center justify-center rounded-md border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/40 transition-colors"
                      aria-label={t('Supprimer l’alerte', 'Delete alert')}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
