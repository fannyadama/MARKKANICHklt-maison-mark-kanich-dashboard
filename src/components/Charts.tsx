import React, { useMemo, useState } from 'react';
import { COMPARISON_7D_DATA, generateKltSeries } from '../data/kltSeedData';
import { useKLTStore } from '../context/KLTStoreContext';
import { Download } from 'lucide-react';

export const KLTPriceChart: React.FC = () => {
  const { t, kltPriceUsd } = useKLTStore();
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '1m' | '1y'>('7d');
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const series = useMemo(() => {
    const base = generateKltSeries(timeframe);
    if (base.length > 0) {
      base[base.length - 1] = {
        ...base[base.length - 1],
        price: kltPriceUsd,
        close: kltPriceUsd,
      };
    }
    return base;
  }, [timeframe, kltPriceUsd]);

  const width = 760;
  const height = 240;
  const padX = 44;
  const padY = 22;

  const prices = series.map((p) => p.price);
  const minP = Math.min(...prices) * 0.985;
  const maxP = Math.max(...prices) * 1.015;
  const rangeP = maxP - minP || 0.01;

  const getX = (idx: number) => padX + (idx / Math.max(1, series.length - 1)) * (width - padX * 2);
  const getY = (val: number) => height - padY - ((val - minP) / rangeP) * (height - padY * 2);

  const linePath = series
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${getX(idx).toFixed(1)} ${getY(p.price).toFixed(1)}`)
    .join(' ');
  const areaPath = `${linePath} L ${getX(series.length - 1).toFixed(1)} ${height - padY} L ${getX(0).toFixed(1)} ${height - padY} Z`;

  const firstP = series[0]?.price || kltPriceUsd;
  const lastP = series[series.length - 1]?.price || kltPriceUsd;
  const pctChange = (((lastP - firstP) / firstP) * 100).toFixed(2);
  const isUp = Number(pctChange) >= 0;

  const activePoint = hoverIdx !== null ? series[hoverIdx] : series[series.length - 1];

  return (
    <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-baseline gap-3">
            <h3 className="text-base font-semibold text-white">
              {t('Historique du cours $KLT', '$KLT Price History')}
            </h3>
            <span className="text-xs text-slate-400">
              {timeframe === '24h'
                ? t('Dernières 24h', 'Last 24h')
                : timeframe === '7d'
                ? t('7 derniers jours', 'Last 7 Days')
                : timeframe === '1m'
                ? t('30 derniers jours', 'Last 30 Days')
                : t('12 derniers mois', 'Last 12 Months')}
            </span>
          </div>
          <div className="flex items-baseline gap-3 mt-1">
            <span className="text-2xl font-bold text-white font-mono-tabular">
              ${activePoint.price.toFixed(4)}
            </span>
            <span
              className={`text-xs font-medium font-mono-tabular ${
                isUp ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {isUp ? '+' : ''}
              {pctChange}% ({timeframe.toUpperCase()})
            </span>
            <span className="text-xs text-slate-500 font-mono-tabular">{activePoint.label}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
          {(['24h', '7d', '1m', '1y'] as const).map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                timeframe === tf
                  ? 'bg-amber-500 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tf.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-56 select-none"
          onMouseLeave={() => setHoverIdx(null)}
        >
          <defs>
            <linearGradient id="kltAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {[0, 0.25, 0.5, 0.75, 1].map((step) => {
            const y = padY + step * (height - padY * 2);
            const val = maxP - step * rangeP;
            return (
              <g key={step}>
                <line
                  x1={padX}
                  x2={width - padX}
                  y1={y}
                  y2={y}
                  stroke="#1E293B"
                  strokeDasharray="3 3"
                />
                <text
                  x={padX - 6}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-slate-500 text-[10px] font-mono-tabular"
                >
                  ${val.toFixed(3)}
                </text>
              </g>
            );
          })}

          <path d={areaPath} fill="url(#kltAreaGrad)" />
          <path d={linePath} fill="none" stroke="#F59E0B" strokeWidth="2.2" strokeLinecap="round" />

          {hoverIdx !== null && (
            <g>
              <line
                x1={getX(hoverIdx)}
                x2={getX(hoverIdx)}
                y1={padY}
                y2={height - padY}
                stroke="#64748B"
                strokeDasharray="3 3"
              />
              <circle
                cx={getX(hoverIdx)}
                cy={getY(series[hoverIdx].price)}
                r="5"
                fill="#F59E0B"
                stroke="#0F172A"
                strokeWidth="2"
              />
            </g>
          )}

          {series.map((p, idx) => (
            <rect
              key={p.label}
              x={getX(idx) - (width - padX * 2) / (series.length * 2)}
              y={0}
              width={(width - padX * 2) / series.length}
              height={height}
              fill="transparent"
              onMouseEnter={() => setHoverIdx(idx)}
            />
          ))}
        </svg>
      </div>
    </div>
  );
};

const COMPARE_COLORS: Record<string, string> = {
  KLT: '#F59E0B',
  BTC: '#FB923C',
  ETH: '#60A5FA',
  SOL: '#34D399',
  ADA: '#38BDF8',
};

export const CryptoComparisonChart: React.FC = () => {
  const { t, assets } = useKLTStore();
  const [selected, setSelected] = useState<Record<string, boolean>>({
    KLT: true,
    BTC: true,
    ETH: true,
    SOL: false,
    ADA: false,
  });

  const keys = Object.keys(selected);
  const activeKeys = keys.filter((k) => selected[k]);

  const width = 760;
  const height = 210;
  const padX = 44;
  const padY = 20;

  const allVals = COMPARISON_7D_DATA.flatMap((d) =>
    activeKeys.length > 0 ? activeKeys.map((k) => Number(d[k])) : [100]
  );
  const minV = Math.min(...allVals) - 1.5;
  const maxV = Math.max(...allVals) + 1.5;
  const rangeV = maxV - minV || 1;

  const getX = (i: number) =>
    padX + (i / (COMPARISON_7D_DATA.length - 1)) * (width - padX * 2);
  const getY = (v: number) => height - padY - ((v - minV) / rangeV) * (height - padY * 2);

  return (
    <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-base font-semibold text-white">
            {t('Comparaison Crypto', 'Crypto Comparison')}
          </h3>
          <p className="text-xs text-slate-400">
            {t('Indice de performance normalisé (Base 100 · 7 jours)', 'Normalized Price Index (Base 100 · 7 Days)')}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setSelected({ KLT: true, BTC: true, ETH: true, SOL: false, ADA: false })}
            className="px-2.5 py-1 text-xs rounded-md border border-slate-700 text-slate-300 hover:bg-slate-800 whitespace-nowrap shrink-0"
          >
            Top 3
          </button>
          <button
            type="button"
            onClick={() => setSelected({ KLT: true, BTC: false, ETH: false, SOL: false, ADA: false })}
            className="px-2.5 py-1 text-xs rounded-md border border-slate-700 text-slate-300 hover:bg-slate-800 whitespace-nowrap shrink-0"
          >
            {t('KLT seul', 'KLT Only')}
          </button>
          <button
            type="button"
            onClick={() => setSelected({ KLT: true, BTC: true, ETH: true, SOL: true, ADA: true })}
            className="px-2.5 py-1 text-xs rounded-md border border-slate-700 text-slate-300 hover:bg-slate-800 whitespace-nowrap shrink-0"
          >
            {t('Tous', 'All')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-4">
        {keys.map((symbol) => {
          const asset = assets.find((a) => a.symbol === symbol);
          const isChecked = selected[symbol];
          return (
            <button
              key={symbol}
              type="button"
              onClick={() => setSelected((prev) => ({ ...prev, [symbol]: !prev[symbol] }))}
              className={`text-left p-2.5 rounded-lg border transition-colors ${
                isChecked
                  ? 'bg-slate-900 border-slate-600'
                  : 'bg-slate-950/60 border-slate-800/80 opacity-65 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">{symbol}</span>
                <span
                  className="w-2.5 h-2.5 rounded-xs"
                  style={{ backgroundColor: isChecked ? COMPARE_COLORS[symbol] : '#334155' }}
                />
              </div>
              <p className="text-sm font-bold font-mono-tabular mt-1" style={{ color: COMPARE_COLORS[symbol] }}>
                ${asset ? (asset.priceUsd < 10 ? asset.priceUsd.toFixed(2) : asset.priceUsd.toLocaleString()) : '0.00'}
              </p>
              <p className="text-[11px] text-slate-400 truncate">{asset?.name}</p>
            </button>
          );
        })}
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48">
        {[0, 0.5, 1].map((step) => {
          const y = padY + step * (height - padY * 2);
          const val = maxV - step * rangeV;
          return (
            <g key={step}>
              <line x1={padX} x2={width - padX} y1={y} y2={y} stroke="#1E293B" strokeDasharray="3 3" />
              <text x={padX - 6} y={y + 4} textAnchor="end" className="fill-slate-500 text-[10px] font-mono-tabular">
                {val.toFixed(0)}
              </text>
            </g>
          );
        })}

        {COMPARISON_7D_DATA.map((d, i) => (
          <text
            key={String(d.day)}
            x={getX(i)}
            y={height - 4}
            textAnchor="middle"
            className="fill-slate-500 text-[10px] font-mono-tabular"
          >
            {d.day}
          </text>
        ))}

        {activeKeys.map((symbol) => {
          const path = COMPARISON_7D_DATA.map(
            (d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i).toFixed(1)} ${getY(Number(d[symbol])).toFixed(1)}`
          ).join(' ');
          return (
            <path
              key={symbol}
              d={path}
              fill="none"
              stroke={COMPARE_COLORS[symbol]}
              strokeWidth={symbol === 'KLT' ? 2.6 : 1.8}
              strokeLinecap="round"
            />
          );
        })}
      </svg>
    </div>
  );
};

export const AdvancedCandlestickChart: React.FC = () => {
  const { t, kltPriceUsd, notify } = useKLTStore();
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '1m' | '1y'>('1m');
  const [chartMode, setChartMode] = useState<'candles' | 'line'>('candles');
  const [showSma, setShowSma] = useState(true);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const data = useMemo(() => {
    const s = generateKltSeries(timeframe);
    if (s.length > 0) {
      s[s.length - 1] = { ...s[s.length - 1], close: kltPriceUsd, price: kltPriceUsd };
    }
    return s;
  }, [timeframe, kltPriceUsd]);

  const width = 820;
  const height = 300;
  const padX = 50;
  const padY = 24;

  const allHighs = data.map((d) => d.high);
  const allLows = data.map((d) => d.low);
  const maxP = Math.max(...allHighs) * 1.015;
  const minP = Math.min(...allLows) * 0.985;
  const rangeP = maxP - minP || 0.01;

  const getX = (i: number) => padX + (i / Math.max(1, data.length - 1)) * (width - padX * 2);
  const getY = (v: number) => height - padY - ((v - minP) / rangeP) * (height - padY * 2);

  const smaPath = data
    .map((_, i) => {
      const start = Math.max(0, i - 4);
      const slice = data.slice(start, i + 1);
      const avg = slice.reduce((sum, item) => sum + item.close, 0) / slice.length;
      return `${i === 0 ? 'M' : 'L'} ${getX(i).toFixed(1)} ${getY(avg).toFixed(1)}`;
    })
    .join(' ');

  const active = hoverIdx !== null ? data[hoverIdx] : data[data.length - 1];

  const handleExportCsv = () => {
    const header = 'Period,Open,High,Low,Close,Volume';
    const rows = data.map((d) => `${d.label},${d.open},${d.high},${d.low},${d.close},${d.volume}`);
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `klt-ohlcv-${timeframe}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    notify(t('Données OHLCV exportées en CSV.', 'OHLCV data exported as CSV.'));
  };

  return (
    <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-base font-semibold text-white">
            {t('Analyse Technique KLT / USD', 'KLT / USD Technical Analysis')}
          </h3>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-mono-tabular mt-1">
            <span>{active.label}</span>
            <span>O: ${active.open.toFixed(4)}</span>
            <span className="text-emerald-400">H: ${active.high.toFixed(4)}</span>
            <span className="text-red-400">L: ${active.low.toFixed(4)}</span>
            <span className="text-amber-400 font-semibold">C: ${active.close.toFixed(4)}</span>
            <span>Vol: {active.volume.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
            {(['candles', 'line'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setChartMode(m)}
                className={`px-2.5 py-1 text-xs rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  chartMode === m ? 'bg-slate-700 text-white font-medium' : 'text-slate-400 hover:text-white'
                }`}
              >
                {m === 'candles' ? t('Chandeliers', 'Candles') : t('Courbe', 'Line')}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowSma((s) => !s)}
            className={`px-2.5 py-1.5 text-xs rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
              showSma
                ? 'border-sky-500/50 bg-sky-500/10 text-sky-300'
                : 'border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            SMA-5
          </button>

          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
            {(['24h', '7d', '1m', '1y'] as const).map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 text-xs rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  timeframe === tf ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-slate-700 text-slate-200 hover:bg-slate-800 whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            CSV
          </button>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-72 select-none"
        onMouseLeave={() => setHoverIdx(null)}
      >
        {[0, 0.25, 0.5, 0.75, 1].map((step) => {
          const y = padY + step * (height - padY * 2);
          const val = maxP - step * rangeP;
          return (
            <g key={step}>
              <line x1={padX} x2={width - padX} y1={y} y2={y} stroke="#1E293B" strokeDasharray="3 3" />
              <text x={padX - 6} y={y + 4} textAnchor="end" className="fill-slate-500 text-[10px] font-mono-tabular">
                ${val.toFixed(3)}
              </text>
            </g>
          );
        })}

        {chartMode === 'candles' ? (
          data.map((d, i) => {
            const cx = getX(i);
            const bull = d.close >= d.open;
            const color = bull ? '#10B981' : '#EF4444';
            const topY = getY(Math.max(d.open, d.close));
            const botY = getY(Math.min(d.open, d.close));
            const bodyH = Math.max(3, botY - topY);
            const candleW = Math.max(6, Math.min(16, (width - padX * 2) / data.length - 4));
            return (
              <g key={d.label}>
                <line x1={cx} x2={cx} y1={getY(d.high)} y2={getY(d.low)} stroke={color} strokeWidth="1.5" />
                <rect x={cx - candleW / 2} y={topY} width={candleW} height={bodyH} fill={color} rx="1.5" />
              </g>
            );
          })
        ) : (
          <path
            d={data
              .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i).toFixed(1)} ${getY(d.close).toFixed(1)}`)
              .join(' ')}
            fill="none"
            stroke="#F59E0B"
            strokeWidth="2.2"
          />
        )}

        {showSma && <path d={smaPath} fill="none" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="4 2" />}

        {data.map((d, i) => (
          <rect
            key={d.label}
            x={getX(i) - (width - padX * 2) / (data.length * 2)}
            y={0}
            width={(width - padX * 2) / data.length}
            height={height}
            fill="transparent"
            onMouseEnter={() => setHoverIdx(i)}
          />
        ))}
      </svg>
    </div>
  );
};
