import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  CheckCircle2,
  Plus,
  RotateCcw,
  Trash2,
  TrendingDown,
  TrendingUp,
  X,
} from 'lucide-react';
import { useKLTStore } from '../context/KLTStoreContext';

interface PriceAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PriceAlertModal: React.FC<PriceAlertModalProps> = ({ isOpen, onClose }) => {
  const {
    t,
    kltPriceUsd,
    user,
    updateUserProfile,
    priceAlerts,
    addPriceAlert,
    togglePriceAlert,
    rearmPriceAlert,
    deletePriceAlert,
    autoPriceWatch,
    setAutoPriceWatch,
  } = useKLTStore();

  const [actionIntent, setActionIntent] = useState<'buy' | 'sell'>('buy');
  const [condition, setCondition] = useState<'above' | 'below'>('below');
  const [targetInput, setTargetInput] = useState<string>((kltPriceUsd * 0.95).toFixed(4));
  const [labelInput, setLabelInput] = useState<string>('');
  const [formError, setFormError] = useState<string>('');

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const parsedTarget = parseFloat(targetInput);
  const pctDiff = useMemo(() => {
    if (!Number.isFinite(parsedTarget) || parsedTarget <= 0 || kltPriceUsd <= 0) return null;
    return ((parsedTarget - kltPriceUsd) / kltPriceUsd) * 100;
  }, [kltPriceUsd, parsedTarget]);

  if (!isOpen) return null;

  const handleIntentChange = (nextIntent: 'buy' | 'sell') => {
    setActionIntent(nextIntent);
    const nextCond = nextIntent === 'buy' ? 'below' : 'above';
    const nextTarget = nextIntent === 'buy' ? kltPriceUsd * 0.95 : kltPriceUsd * 1.05;
    setCondition(nextCond);
    setTargetInput(Math.max(0.0001, nextTarget).toFixed(4));
    setFormError('');
  };

  const applyPresetPct = (pct: number) => {
    setCondition(pct >= 0 ? 'above' : 'below');
    setTargetInput(Math.max(0.0001, kltPriceUsd * (1 + pct / 100)).toFixed(4));
    setFormError('');
  };

  const handleSaveAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!Number.isFinite(parsedTarget) || parsedTarget <= 0) {
      setFormError(
        t('Veuillez saisir un prix cible USD valide (> 0).', 'Please enter a valid positive USD target price.')
      );
      return;
    }
    setFormError('');
    addPriceAlert(condition, parsedTarget, labelInput, actionIntent);
    setLabelInput('');
  };

  return (
    <div
      className="no-print fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="price-alert-modal-title"
    >
      <div
        className="w-full max-w-xl bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 id="price-alert-modal-title" className="text-base font-semibold text-white">
                {t('Alertes de Prix Achat / Vente $KLT', '$KLT Buy / Sell Price Threshold Alerts')}
              </h2>
              <p className="text-xs text-slate-400 font-mono-tabular">
                {t('Cours actuel', 'Current price')}: <span className="text-amber-400 font-semibold">${kltPriceUsd.toFixed(4)}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label={t('Fermer', 'Close')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[82vh] overflow-y-auto">
          {/* Buy / Sell Threshold Form */}
          <form onSubmit={handleSaveAlert} className="space-y-4">
            {/* Intent Toggle: Buy vs Sell */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-900 border border-slate-800">
              <button
                type="button"
                onClick={() => handleIntentChange('buy')}
                className={`min-h-[40px] inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                  actionIntent === 'buy'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ArrowDownRight className="w-4 h-4" />
                {t('Seuil d’Achat (Entrée)', 'Buy Alert (Entry)')}
              </button>
              <button
                type="button"
                onClick={() => handleIntentChange('sell')}
                className={`min-h-[40px] inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                  actionIntent === 'sell'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ArrowUpRight className="w-4 h-4" />
                {t('Seuil de Vente (Objectif)', 'Sell Alert (Take Profit)')}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Crossing Direction */}
              <div>
                <span className="block text-xs font-medium text-slate-300 mb-1.5">
                  {t('Condition de déclenchement', 'Trigger Condition')}
                </span>
                <div className="grid grid-cols-2 gap-1 p-1 rounded-lg bg-slate-900 border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setCondition('below')}
                    className={`min-h-[36px] inline-flex items-center justify-center gap-1 rounded-md text-xs font-semibold transition-colors ${
                      condition === 'below' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <TrendingDown className="w-3.5 h-3.5" />
                    {t('Baisse ≤', 'Below ≤')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCondition('above')}
                    className={`min-h-[36px] inline-flex items-center justify-center gap-1 rounded-md text-xs font-semibold transition-colors ${
                      condition === 'above' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    {t('Hausse ≥', 'Above ≥')}
                  </button>
                </div>
              </div>

              {/* Target Price */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <label htmlFor="modal-alert-price" className="font-medium text-slate-300">
                    {t('Prix seuil (USD)', 'Threshold Price (USD)')}
                  </label>
                  {pctDiff !== null && (
                    <span className={`font-mono-tabular ${pctDiff >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {pctDiff >= 0 ? '+' : ''}
                      {pctDiff.toFixed(2)}%
                    </span>
                  )}
                </div>
                <input
                  id="modal-alert-price"
                  type="number"
                  step="0.0001"
                  min="0.0001"
                  value={targetInput}
                  onChange={(e) => {
                    setTargetInput(e.target.value);
                    setFormError('');
                  }}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 font-mono-tabular text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-slate-400 mr-1">{t('Préréglages :', 'Presets:')}</span>
              {[-10, -5, -2, 2, 5, 10].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => applyPresetPct(pct)}
                  className="px-2.5 py-1 rounded-md border border-slate-700 bg-slate-900 hover:border-amber-500/50 text-slate-200 font-mono-tabular transition-colors"
                >
                  {pct > 0 ? `+${pct}%` : `${pct}%`}
                </button>
              ))}
            </div>

            {/* Note & Save Button */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                maxLength={48}
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                placeholder={
                  actionIntent === 'buy'
                    ? t('Note optionnelle (ex : Zone d’accumulation)...', 'Optional note (e.g., Buy zone)...')
                    : t('Note optionnelle (ex : Prise de profit PALIER 1)...', 'Optional note (e.g., Take profit T1)...')
                }
                className="flex-1 min-h-[42px] px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="min-h-[42px] inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
              >
                <Plus className="w-4 h-4" />
                {t('Enregistrer l’alerte', 'Save Alert')}
              </button>
            </div>

            {formError && <p className="text-xs text-red-400">{formError}</p>}
          </form>

          {/* Store-Saved Notification Preferences */}
          <div className="pt-4 border-t border-slate-800 space-y-2.5">
            <p className="text-xs font-semibold text-slate-300">
              {t('Préférences de surveillance enregistrées', 'Saved Monitoring Preferences')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <label className="p-3 rounded-lg bg-slate-900/75 border border-slate-800 flex items-center justify-between gap-2 cursor-pointer">
                <span className="text-slate-200">
                  {t('Alertes Toast Prix $KLT', '$KLT Price Toast Alerts')}
                </span>
                <input
                  type="checkbox"
                  checked={user.notifications.priceAlerts}
                  onChange={(e) =>
                    updateUserProfile({
                      notifications: { ...user.notifications, priceAlerts: e.target.checked },
                    })
                  }
                  className="accent-amber-500 w-4 h-4"
                />
              </label>

              <label className="p-3 rounded-lg bg-slate-900/75 border border-slate-800 flex items-center justify-between gap-2 cursor-pointer">
                <span className="text-slate-200">
                  {t('Flux temps réel (8s)', 'Auto Price Stream (8s)')}
                </span>
                <input
                  type="checkbox"
                  checked={autoPriceWatch}
                  onChange={(e) => setAutoPriceWatch(e.target.checked)}
                  className="accent-amber-500 w-4 h-4"
                />
              </label>
            </div>
          </div>

          {/* Saved Threshold Alerts List */}
          <div className="pt-4 border-t border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">
                {t('Seuils enregistrés dans votre profil', 'Saved Thresholds in Local Store')}
              </span>
              <span className="font-mono-tabular text-slate-400">{priceAlerts.length}</span>
            </div>

            {priceAlerts.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center border border-dashed border-slate-800 rounded-lg">
                {t('Aucune alerte enregistrée.', 'No alerts saved yet.')}
              </p>
            ) : (
              <div className="max-h-52 overflow-y-auto divide-y divide-slate-800/70 pr-1">
                {priceAlerts.map((rule) => (
                  <div key={rule.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {rule.actionIntent && (
                          <span
                            className={`font-semibold uppercase text-[10px] ${
                              rule.actionIntent === 'buy' ? 'text-emerald-400' : 'text-amber-400'
                            }`}
                          >
                            {rule.actionIntent === 'buy' ? t('ACHAT', 'BUY') : t('VENTE', 'SELL')}
                          </span>
                        )}
                        <span className="font-mono-tabular font-semibold text-white">
                          $KLT {rule.condition === 'above' ? '≥' : '≤'} ${rule.targetPriceUsd.toFixed(4)}
                        </span>
                        {rule.label && <span className="text-slate-400 truncate">· {rule.label}</span>}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {rule.triggered ? (
                          <span className="inline-flex items-center gap-1 text-amber-400">
                            <CheckCircle2 className="w-3 h-3" />
                            {t('Déclenchée', 'Triggered')}
                          </span>
                        ) : rule.active ? (
                          <span className="text-emerald-400">{t('Surveillance active', 'Active')}</span>
                        ) : (
                          <span>{t('En pause', 'Paused')}</span>
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {rule.triggered ? (
                        <button
                          type="button"
                          onClick={() => rearmPriceAlert(rule.id)}
                          className="p-1.5 rounded-md border border-amber-500/40 text-amber-300 hover:bg-amber-500/10"
                          title={t('Réarmer', 'Re-arm')}
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => togglePriceAlert(rule.id)}
                          className={`px-2 py-1 rounded-md border text-[11px] font-semibold ${
                            rule.active
                              ? 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10'
                              : 'border-slate-700 text-slate-400'
                          }`}
                        >
                          {rule.active ? 'ON' : 'OFF'}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => deletePriceAlert(rule.id)}
                        className="p-1.5 rounded-md border border-slate-800 text-slate-400 hover:text-red-400"
                        aria-label={t('Supprimer', 'Delete')}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
