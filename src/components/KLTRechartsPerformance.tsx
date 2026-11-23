import React, { useMemo, useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useKLTStore } from '../context/KLTStoreContext';
import { generateKltSeries } from '../data/kltSeedData';

interface ChartDatum {
  date: string;
  kltPrice: number;
  holdingsKlt: number;
  holdingsUsd: number;
}

export const KLTRechartsPerformance: React.FC = () => {
  const { t, language, kltPriceUsd, totalKltBalance, stakedKlt, hideBalances, formatFiat } =
    useKLTStore();
  const [seriesMode, setSeriesMode] = useState<'both' | 'price' | 'holdings'>('both');

  const data = useMemo<ChartDatum[]>(() => {
    const raw30d = generateKltSeries('1m');
    const currentHoldingsKlt = Math.max(1000, totalKltBalance + stakedKlt);
    const today = new Date('2026-11-23T12:00:00Z');

    return raw30d.map((pt, idx) => {
      const daysAgo = raw30d.length - 1 - idx;
      const d = new Date(today.getTime() - daysAgo * 86400000);
      const dateLabel = d.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
        day: '2-digit',
        month: 'short',
      });

      const price = idx === raw30d.length - 1 ? kltPriceUsd : pt.price;
      // Progressive accumulation curve culminating at the user's exact live KLT holdings
      const progress = idx / Math.max(1, raw30d.length - 1);
      const accumulationFactor = 0.72 + 0.28 * progress + Math.sin(idx * 0.4) * 0.015;
      const holdingsKlt =
        idx === raw30d.length - 1
          ? Math.round(currentHoldingsKlt)
          : Math.round(currentHoldingsKlt * Math.min(1, accumulationFactor));
      const holdingsUsd = +(holdingsKlt * price).toFixed(2);

      return {
        date: dateLabel,
        kltPrice: +price.toFixed(4),
        holdingsKlt,
        holdingsUsd,
      };
    });
  }, [kltPriceUsd, language, stakedKlt, totalKltBalance]);

  const first = data[0];
  const last = data[data.length - 1];
  const priceDeltaPct = first ? (((last.kltPrice - first.kltPrice) / first.kltPrice) * 100).toFixed(2) : '0.00';
  const holdingsDeltaPct = first
    ? (((last.holdingsUsd - first.holdingsUsd) / first.holdingsUsd) * 100).toFixed(2)
    : '0.00';

  return (
    <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
        <div>
          <h3 className="text-base font-semibold text-white">
            {t('Performance 30 Jours : Cours $KLT & Portefeuille', '30-Day Performance: $KLT Price & User Holdings')}
          </h3>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-1.5 text-xs">
            <span className="text-slate-400">
              {t('Cours $KLT (30j)', '$KLT Price (30d)')}:{' '}
              <strong className="text-amber-400 font-mono-tabular">
                ${last?.kltPrice.toFixed(4)} ({Number(priceDeltaPct) >= 0 ? '+' : ''}
                {priceDeltaPct}%)
              </strong>
            </span>
            <span className="text-slate-400">
              {t('Valeur Avoirs $KLT (30j)', '$KLT Holdings Value (30d)')}:{' '}
              <strong className="text-emerald-400 font-mono-tabular">
                {hideBalances
                  ? '••••••'
                  : `${formatFiat(last?.holdingsUsd || 0, 'USD')} (${Number(holdingsDeltaPct) >= 0 ? '+' : ''}${holdingsDeltaPct}%)`}
              </strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg self-start lg:self-auto shrink-0">
          {(
            [
              { id: 'both', fr: 'Combiné', en: 'Combined' },
              { id: 'price', fr: 'Cours $KLT', en: '$KLT Price' },
              { id: 'holdings', fr: 'Mes Avoirs', en: 'My Holdings' },
            ] as const
          ).map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setSeriesMode(mode.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                seriesMode === mode.id
                  ? 'bg-amber-500 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t(mode.fr, mode.en)}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full h-72 min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, left: 4, bottom: 4 }}>
            <CartesianGrid stroke="#1E293B" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: '#64748B', fontSize: 11 }}
              axisLine={{ stroke: '#1E293B' }}
              tickLine={false}
              minTickGap={24}
            />
            {(seriesMode === 'both' || seriesMode === 'price') && (
              <YAxis
                yAxisId="price"
                orientation="left"
                domain={['auto', 'auto']}
                tickFormatter={(v: number) => `$${v.toFixed(2)}`}
                tick={{ fill: '#F59E0B', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={54}
              />
            )}
            {(seriesMode === 'both' || seriesMode === 'holdings') && (
              <YAxis
                yAxisId="holdings"
                orientation="right"
                domain={['auto', 'auto']}
                tickFormatter={(v: number) => (hideBalances ? '•••' : `$${(v / 1000).toFixed(0)}k`)}
                tick={{ fill: '#10B981', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={54}
              />
            )}
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
                if (name === 'kltPrice') {
                  return [`$${num.toFixed(4)}`, t('Cours $KLT', '$KLT Price')];
                }
                if (hideBalances) {
                  return ['••••••', t('Valeur des avoirs', 'Holdings Value')];
                }
                return [
                  `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                  t('Valeur des avoirs', 'Holdings Value'),
                ];
              }}
              labelStyle={{ color: '#94A3B8', marginBottom: '4px' }}
            />
            <Legend
              wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
              formatter={(value: string) =>
                value === 'kltPrice'
                  ? t('Cours $KLT (USD)', '$KLT Token Price (USD)')
                  : t('Avoirs Utilisateur (USD)', 'User Holdings Value (USD)')
              }
            />
            {(seriesMode === 'both' || seriesMode === 'price') && (
              <Line
                yAxisId="price"
                type="monotone"
                dataKey="kltPrice"
                stroke="#F59E0B"
                strokeWidth={2.4}
                dot={false}
                activeDot={{ r: 5, fill: '#F59E0B', stroke: '#0F172A', strokeWidth: 2 }}
              />
            )}
            {(seriesMode === 'both' || seriesMode === 'holdings') && (
              <Line
                yAxisId="holdings"
                type="monotone"
                dataKey="holdingsUsd"
                stroke="#10B981"
                strokeWidth={2.4}
                dot={false}
                activeDot={{ r: 5, fill: '#10B981', stroke: '#0F172A', strokeWidth: 2 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
