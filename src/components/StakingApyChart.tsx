import React, { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ArrowUpRight, TrendingUp } from 'lucide-react';
import { useKLTStore } from '../context/KLTStoreContext';

interface StakingMonthDatum {
  month: string;
  monthIndex: number;
  compoundedRewardKlt: number;
  simpleRewardKlt: number;
  monthlyYieldKlt: number;
  totalWithCompoundingKlt: number;
}

const NOMINAL_APY = 0.15;

export const StakingApyChart: React.FC = () => {
  const { t, stakedKlt, kltPriceUsd, hideBalances, formatFiat, setRoute } = useKLTStore();

  const defaultPrincipal = stakedKlt > 0 ? stakedKlt : 25000;
  const [principalMode, setPrincipalMode] = useState<'current' | '10000' | '50000' | '100000'>('current');
  const [viewMetric, setViewMetric] = useState<'rewards' | 'total'>('rewards');

  const principalKlt = useMemo(() => {
    if (principalMode === 'current') return defaultPrincipal;
    return Number(principalMode);
  }, [defaultPrincipal, principalMode]);

  const data = useMemo<StakingMonthDatum[]>(() => {
    const rows: StakingMonthDatum[] = [];
    let prevCompoundedReward = 0;

    for (let m = 0; m <= 12; m += 1) {
      const days = Math.round((365 * m) / 12);
      const compoundedTotal =
        principalKlt * Math.pow(1 + NOMINAL_APY / 365, days);
      const compoundedReward = Math.max(0, compoundedTotal - principalKlt);
      const simpleReward = principalKlt * NOMINAL_APY * (m / 12);
      const monthlyYield = m === 0 ? 0 : Math.max(0, compoundedReward - prevCompoundedReward);
      prevCompoundedReward = compoundedReward;

      rows.push({
        month: m === 0 ? t('Départ', 'Start') : `M${m}`,
        monthIndex: m,
        compoundedRewardKlt: +compoundedReward.toFixed(2),
        simpleRewardKlt: +simpleReward.toFixed(2),
        monthlyYieldKlt: +monthlyYield.toFixed(2),
        totalWithCompoundingKlt: +compoundedTotal.toFixed(2),
      });
    }
    return rows;
  }, [principalKlt, t]);

  const finalPoint = data[data.length - 1];
  const effectiveApyPct = (Math.pow(1 + NOMINAL_APY / 365, 365) - 1) * 100;
  const annualRewardKlt = finalPoint?.compoundedRewardKlt ?? 0;
  const annualRewardUsd = annualRewardKlt * kltPriceUsd;
  const avgMonthlyKlt = annualRewardKlt / 12;

  return (
    <section
      aria-labelledby="staking-apy-chart-heading"
      className="bg-[#0F172A] border border-slate-800 rounded-xl p-5 sm:p-6 space-y-5"
    >
      {/* Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 id="staking-apy-chart-heading" className="text-base font-semibold text-white">
              {t(
                'Visualisation Staking $KLT · Progression 15% APY sur 12 Mois',
                '$KLT Staking Projection · 12-Month 15% APY Growth Curve'
              )}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {t(
                'Projection mensuelle des récompenses cumulées (intérêt composé quotidien vs linéaire) à 15% APY.',
                'Monthly cumulative rewards projection (daily compounding vs. simple linear yield) at 15% APY.'
              )}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="inline-flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
            {(
              [
                { id: 'current', fr: 'Mon Staking', en: 'My Stake' },
                { id: '10000', fr: '10K KLT', en: '10K KLT' },
                { id: '50000', fr: '50K KLT', en: '50K KLT' },
                { id: '100000', fr: '100K KLT', en: '100K KLT' },
              ] as const
            ).map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setPrincipalMode(preset.id)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                  principalMode === preset.id
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t(preset.fr, preset.en)}
              </button>
            ))}
          </div>

          <div className="inline-flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
            <button
              type="button"
              onClick={() => setViewMetric('rewards')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                viewMetric === 'rewards'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('Récompenses', 'Rewards')}
            </button>
            <button
              type="button"
              onClick={() => setViewMetric('total')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                viewMetric === 'total'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('Capital Total', 'Total Balance')}
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-lg bg-slate-900/75 border border-slate-800">
          <p className="text-[11px] text-slate-400">{t('Capital Staké Analysé', 'Analyzed Staked Principal')}</p>
          <p className="text-base font-bold text-white font-mono-tabular mt-1">
            {hideBalances && principalMode === 'current'
              ? '•••••• KLT'
              : `${principalKlt.toLocaleString('en-US')} $KLT`}
          </p>
        </div>

        <div className="p-3.5 rounded-lg bg-slate-900/75 border border-slate-800">
          <p className="text-[11px] text-slate-400">{t('Rendement 12 Mois (Composé)', '12-Month Rewards (Compounded)')}</p>
          <p className="text-base font-bold text-emerald-400 font-mono-tabular mt-1">
            {hideBalances && principalMode === 'current'
              ? '•••••• KLT'
              : `+${annualRewardKlt.toLocaleString('en-US', { maximumFractionDigits: 2 })} $KLT`}
          </p>
          <p className="text-[11px] text-slate-500 font-mono-tabular">
            {hideBalances && principalMode === 'current' ? '••••' : `≈ ${formatFiat(annualRewardUsd)}`}
          </p>
        </div>

        <div className="p-3.5 rounded-lg bg-slate-900/75 border border-slate-800">
          <p className="text-[11px] text-slate-400">{t('Gain Mensuel Moyen', 'Avg. Monthly Yield')}</p>
          <p className="text-base font-bold text-amber-400 font-mono-tabular mt-1">
            {hideBalances && principalMode === 'current'
              ? '•••••• KLT'
              : `+${avgMonthlyKlt.toLocaleString('en-US', { maximumFractionDigits: 2 })} $KLT`}
          </p>
        </div>

        <div className="p-3.5 rounded-lg bg-slate-900/75 border border-slate-800 flex items-center justify-between gap-2">
          <div>
            <p className="text-[11px] text-slate-400">{t('APY Effectif', 'Effective APY')}</p>
            <p className="text-base font-bold text-white font-mono-tabular mt-1">
              {effectiveApyPct.toFixed(2)}%
            </p>
            <p className="text-[11px] text-emerald-400 font-mono-tabular">15.00% {t('nominal', 'base')}</p>
          </div>
          <button
            type="button"
            onClick={() => setRoute('solana-trading')}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 text-xs font-semibold whitespace-nowrap shrink-0"
          >
            {t('Staker', 'Stake')}
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Recharts 12-Month Staking Progression AreaChart */}
      <div className="w-full h-72 min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 16, left: 6, bottom: 4 }}>
            <defs>
              <linearGradient id="kltStakingRewardGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#1E293B" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: '#94A3B8', fontSize: 11 }}
              axisLine={{ stroke: '#1E293B' }}
              tickLine={false}
            />
            <YAxis
              domain={viewMetric === 'total' ? ['auto', 'auto'] : [0, 'auto']}
              tickFormatter={(v: number) =>
                hideBalances && principalMode === 'current'
                  ? '•••'
                  : v >= 1000
                  ? `${(v / 1000).toFixed(1)}k`
                  : `${Math.round(v)}`
              }
              tick={{ fill: '#94A3B8', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={56}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0B1120',
                borderColor: '#334155',
                borderRadius: '0.5rem',
                fontSize: '12px',
                color: '#F1F5F9',
              }}
              formatter={(value, name) => {
                const num = Number(value ?? 0);
                const formatted =
                  hideBalances && principalMode === 'current'
                    ? '•••••• KLT'
                    : `${num.toLocaleString('en-US', { maximumFractionDigits: 2 })} $KLT`;

                if (name === 'compoundedRewardKlt') {
                  return [formatted, t('Récompenses composées (15% APY)', 'Compounded Rewards (15% APY)')];
                }
                if (name === 'simpleRewardKlt') {
                  return [formatted, t('Récompenses simples (15% APR)', 'Simple Yield Baseline (15% APR)')];
                }
                return [formatted, t('Position Totale Stakée', 'Total Staked Position')];
              }}
              labelFormatter={(label) =>
                label === t('Départ', 'Start')
                  ? t('Mois 0 · Initialisation', 'Month 0 · Start')
                  : `${t('Échéance', 'Horizon')} : ${String(label)} / M12`
              }
              labelStyle={{ color: '#F59E0B', fontWeight: 600, marginBottom: '4px' }}
            />
            <Legend
              wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
              formatter={(value: string) => {
                if (value === 'compoundedRewardKlt') {
                  return t('Cumul Composé 15% APY ($KLT)', 'Compounded 15% APY ($KLT)');
                }
                if (value === 'simpleRewardKlt') {
                  return t('Base Linéaire 15% ($KLT)', 'Simple 15% Baseline ($KLT)');
                }
                return t('Capital + Récompenses ($KLT)', 'Principal + Rewards ($KLT)');
              }}
            />

            {viewMetric === 'rewards' ? (
              <>
                <Area
                  type="monotone"
                  dataKey="compoundedRewardKlt"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  fill="url(#kltStakingRewardGrad)"
                  activeDot={{ r: 5, fill: '#10B981', stroke: '#0F172A', strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="simpleRewardKlt"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  strokeDasharray="5 4"
                  dot={false}
                  activeDot={{ r: 4, fill: '#F59E0B', stroke: '#0F172A', strokeWidth: 2 }}
                />
              </>
            ) : (
              <Area
                type="monotone"
                dataKey="totalWithCompoundingKlt"
                stroke="#10B981"
                strokeWidth={2.5}
                fill="url(#kltStakingRewardGrad)"
                activeDot={{ r: 5, fill: '#10B981', stroke: '#0F172A', strokeWidth: 2 }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};
