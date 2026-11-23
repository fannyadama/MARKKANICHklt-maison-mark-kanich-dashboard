import React, { useMemo, useState } from 'react';
import { Calculator, Coins, Lock } from 'lucide-react';
import { useKLTStore } from '../context/KLTStoreContext';

interface DurationTier {
  days: number;
  labelFr: string;
  labelEn: string;
  apy: number;
}

const DURATION_TIERS: DurationTier[] = [
  { days: 30, labelFr: '30 jours', labelEn: '30 Days', apy: 10.0 },
  { days: 90, labelFr: '90 jours', labelEn: '90 Days', apy: 12.0 },
  { days: 180, labelFr: '6 mois', labelEn: '6 Months', apy: 13.5 },
  { days: 365, labelFr: '1 an', labelEn: '1 Year', apy: 15.0 },
  { days: 730, labelFr: '2 ans', labelEn: '2 Years', apy: 15.0 },
];

export const StakingCalculator: React.FC = () => {
  const { t, totalKltBalance, kltPriceUsd, formatFiat, stakeKlt, setRoute } = useKLTStore();
  const [amountInput, setAmountInput] = useState('10000');
  const [durationDays, setDurationDays] = useState<number>(365);
  const [compoundDaily, setCompoundDaily] = useState<boolean>(true);

  const selectedTier = useMemo(() => {
    const exact = DURATION_TIERS.find((d) => d.days === durationDays);
    if (exact) return exact;
    if (durationDays >= 365) return { days: durationDays, labelFr: `${durationDays} j`, labelEn: `${durationDays}d`, apy: 15.0 };
    if (durationDays >= 180) return { days: durationDays, labelFr: `${durationDays} j`, labelEn: `${durationDays}d`, apy: 13.5 };
    if (durationDays >= 90) return { days: durationDays, labelFr: `${durationDays} j`, labelEn: `${durationDays}d`, apy: 12.0 };
    return { days: durationDays, labelFr: `${durationDays} j`, labelEn: `${durationDays}d`, apy: 10.0 };
  }, [durationDays]);

  const numericAmount = Math.max(0, parseFloat(amountInput) || 0);
  const apyDecimal = selectedTier.apy / 100;

  const { estimatedRewardKlt, totalAtMaturityKlt, dailyAvgKlt, effectiveApy } = useMemo(() => {
    if (numericAmount <= 0 || durationDays <= 0) {
      return { estimatedRewardKlt: 0, totalAtMaturityKlt: 0, dailyAvgKlt: 0, effectiveApy: selectedTier.apy };
    }
    let total = numericAmount;
    if (compoundDaily) {
      total = numericAmount * Math.pow(1 + apyDecimal / 365, durationDays);
    } else {
      total = numericAmount * (1 + (apyDecimal * durationDays) / 365);
    }
    const reward = total - numericAmount;
    const daily = reward / durationDays;
    const effApy = compoundDaily ? (Math.pow(1 + apyDecimal / 365, 365) - 1) * 100 : selectedTier.apy;
    return {
      estimatedRewardKlt: reward,
      totalAtMaturityKlt: total,
      dailyAvgKlt: daily,
      effectiveApy: effApy,
    };
  }, [apyDecimal, compoundDaily, durationDays, numericAmount, selectedTier.apy]);

  const rewardUsd = estimatedRewardKlt * kltPriceUsd;
  const totalUsd = totalAtMaturityKlt * kltPriceUsd;
  const canStakeDirectly = numericAmount > 0 && numericAmount <= totalKltBalance;

  const handleStakeNow = () => {
    if (canStakeDirectly) {
      stakeKlt(numericAmount);
    } else {
      setRoute('solana-trading');
    }
  };

  return (
    <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">
              {t('Simulateur de Staking $KLT (jusqu’à 15% APY)', '$KLT Staking Rewards Calculator (up to 15% APY)')}
            </h3>
            <p className="text-xs text-slate-400">
              {t(
                'Estimez vos rendements selon le montant verrouillé et la durée d’engagement.',
                'Estimate your staking yield based on locked $KLT amount and duration.'
              )}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setCompoundDaily((c) => !c)}
          className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
            compoundDaily
              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
              : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600'
          }`}
        >
          {compoundDaily
            ? t('Intérêts composés : Quotidiens', 'Compounding: Daily')
            : t('Intérêts : Simples', 'Compounding: Simple')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Controls */}
        <div className="lg:col-span-7 space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="calc-klt-amount" className="text-xs font-medium text-slate-300">
                {t('Montant à staker ($KLT)', 'Amount to Stake ($KLT)')}
              </label>
              <span className="text-xs text-slate-400 font-mono-tabular">
                {t('Disponible', 'Available')}: {totalKltBalance.toLocaleString('en-US', { maximumFractionDigits: 2 })} KLT
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                id="calc-klt-amount"
                type="number"
                min="0"
                step="any"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono-tabular text-base focus:outline-none focus:border-amber-500"
              />
              <div className="flex items-center gap-1.5">
                {[0.25, 0.5, 1].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setAmountInput((totalKltBalance * pct).toFixed(2))}
                    className="px-3 py-2.5 rounded-lg border border-slate-700 bg-slate-900 hover:border-amber-500 text-xs font-semibold text-slate-300 hover:text-amber-400 transition-colors whitespace-nowrap"
                  >
                    {pct === 1 ? 'MAX' : `${pct * 100}%`}
                  </button>
                ))}
              </div>
            </div>

            <input
              type="range"
              min={0}
              max={Math.max(100000, Math.round(totalKltBalance))}
              step={500}
              value={Math.min(Math.max(100000, Math.round(totalKltBalance)), numericAmount)}
              onChange={(e) => setAmountInput(e.target.value)}
              aria-label={t('Curseur montant KLT', 'KLT amount slider')}
              className="w-full mt-3 accent-amber-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-300">
                {t('Durée d’engagement', 'Lockup Duration')}
              </span>
              <span className="text-xs font-mono-tabular text-amber-400 font-semibold">
                {durationDays} {t('jours', 'days')} · {selectedTier.apy.toFixed(1)}% APY
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {DURATION_TIERS.map((tier) => {
                const active = durationDays === tier.days;
                return (
                  <button
                    key={tier.days}
                    type="button"
                    onClick={() => setDurationDays(tier.days)}
                    className={`p-2.5 rounded-lg border text-center transition-colors ${
                      active
                        ? 'border-amber-500 bg-amber-500/15 text-amber-300'
                        : 'border-slate-800 bg-slate-900/70 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <p className="text-xs font-semibold whitespace-nowrap">{t(tier.labelFr, tier.labelEn)}</p>
                    <p className="text-[11px] font-mono-tabular text-slate-400 mt-0.5">{tier.apy.toFixed(1)}%</p>
                  </button>
                );
              })}
            </div>

            <input
              type="range"
              min={7}
              max={730}
              step={1}
              value={durationDays}
              onChange={(e) => setDurationDays(Number(e.target.value))}
              aria-label={t('Curseur durée en jours', 'Duration days slider')}
              className="w-full mt-3 accent-amber-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Right Estimation Summary */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">{t('Rendement Estimé', 'Estimated Rewards')}</span>
              <span className="text-xs font-mono-tabular text-emerald-400 font-semibold">
                {effectiveApy.toFixed(2)}% APY {compoundDaily ? t('effectif', 'effective') : ''}
              </span>
            </div>

            <div>
              <p className="text-2xl sm:text-3xl font-bold text-emerald-400 font-mono-tabular">
                +{estimatedRewardKlt.toLocaleString('en-US', { maximumFractionDigits: 2 })} $KLT
              </p>
              <p className="text-xs text-slate-400 font-mono-tabular mt-0.5">
                ≈ {formatFiat(rewardUsd)} ({formatFiat(rewardUsd, 'XOF')})
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-slate-400">{t('Moyenne / jour', 'Daily Average')}</p>
                <p className="font-mono-tabular font-semibold text-white mt-0.5">
                  +{dailyAvgKlt.toLocaleString('en-US', { maximumFractionDigits: 2 })} KLT
                </p>
              </div>
              <div>
                <p className="text-slate-400">{t('Total à l’échéance', 'Total at Maturity')}</p>
                <p className="font-mono-tabular font-semibold text-amber-400 mt-0.5">
                  {totalAtMaturityKlt.toLocaleString('en-US', { maximumFractionDigits: 2 })} KLT
                </p>
                <p className="font-mono-tabular text-[11px] text-slate-500">≈ {formatFiat(totalUsd)}</p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleStakeNow}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold transition-colors whitespace-nowrap"
          >
            {canStakeDirectly ? <Lock className="w-3.5 h-3.5" /> : <Coins className="w-3.5 h-3.5" />}
            {canStakeDirectly
              ? t(`Staker ${numericAmount.toLocaleString()} $KLT maintenant`, `Stake ${numericAmount.toLocaleString()} $KLT Now`)
              : t('Ouvrir le Hub Staking Solana →', 'Open Solana Staking Hub →')}
          </button>
        </div>
      </div>
    </div>
  );
};
