import React, { useEffect, useState } from 'react';
import { Activity, Trash2, Wifi, WifiOff } from 'lucide-react';
import { useKLTStore } from '../context/KLTStoreContext';
import { AdvancedCandlestickChart } from '../components/Charts';

interface TapeTrade {
  id: string;
  side: 'buy' | 'sell';
  price: number;
  amountKlt: number;
  time: string;
}

export const TradeView: React.FC = () => {
  const {
    t,
    kltPriceUsd,
    setKltSimulatedPrice,
    totalKltBalance,
    usdBalance,
    openOrders,
    placeOrder,
    cancelOrder,
  } = useKLTStore();
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [kltAmount, setKltAmount] = useState('1500');
  const [limitPrice, setLimitPrice] = useState(kltPriceUsd.toFixed(4));
  const [wsLive, setWsLive] = useState(false);
  const [tape, setTape] = useState<TapeTrade[]>([
    { id: 't-1', side: 'buy', price: 0.4502, amountKlt: 2450, time: '17:42:10' },
    { id: 't-2', side: 'sell', price: 0.4496, amountKlt: 1120, time: '17:41:54' },
    { id: 't-3', side: 'buy', price: 0.4500, amountKlt: 4800, time: '17:41:30' },
  ]);

  useEffect(() => {
    if (!wsLive) return;
    const timer = window.setInterval(() => {
      const drift = 1 + (Math.random() - 0.485) * 0.012;
      const nextPrice = Math.max(0.05, +(kltPriceUsd * drift).toFixed(4));
      setKltSimulatedPrice(nextPrice, false);
      const nextSide: 'buy' | 'sell' = Math.random() > 0.45 ? 'buy' : 'sell';
      const nextAmt = Math.round(450 + Math.random() * 4800);
      const nowStr = new Date().toTimeString().slice(0, 8);
      setTape((prev) => [
        { id: `ws-${Date.now()}`, side: nextSide, price: nextPrice, amountKlt: nextAmt, time: nowStr },
        ...prev.slice(0, 7),
      ]);
    }, 2500);
    return () => window.clearInterval(timer);
  }, [kltPriceUsd, setKltSimulatedPrice, wsLive]);

  const numericAmount = parseFloat(kltAmount) || 0;
  const execPrice = orderType === 'limit' ? parseFloat(limitPrice) || kltPriceUsd : kltPriceUsd;
  const totalUsd = numericAmount * execPrice;

  const asks = [0.0022, 0.0014, 0.0006].map((d, idx) => ({
    price: +(kltPriceUsd + d).toFixed(4),
    qty: 3200 + idx * 1850,
  }));
  const bids = [0.0005, 0.0013, 0.0021].map((d, idx) => ({
    price: +Math.max(0.01, kltPriceUsd - d).toFixed(4),
    qty: 4100 + idx * 2100,
  }));

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (numericAmount <= 0) return;
    placeOrder(side, orderType, numericAmount, orderType === 'limit' ? execPrice : undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {t('Trading Avancé & Flux Raydium Temps Réel', 'Advanced Trading & Real-Time Raydium Stream')}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {t(
              'Ordres au marché, ordres limites, carnet KLT/USD et flux WebSocket Raydium.',
              'Market orders, limit orders, KLT/USD order book, and live Raydium WebSocket stream.'
            )}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono-tabular">
          <button
            type="button"
            onClick={() => setWsLive((v) => !v)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border font-semibold transition-colors whitespace-nowrap ${
              wsLive
                ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
                : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-amber-500'
            }`}
          >
            {wsLive ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            {wsLive ? t('WebSocket Raydium · LIVE', 'Raydium WebSocket · LIVE') : t('Activer Flux Raydium WS', 'Enable Raydium Live WS')}
          </button>
          <div>
            <span className="text-slate-400 block">{t('Cours KLT/USD', 'KLT/USD Mark')}</span>
            <span className="text-base font-bold text-amber-400">${kltPriceUsd.toFixed(4)}</span>
          </div>
          <div>
            <span className="text-slate-400 block">{t('Disponible USD', 'Available USD')}</span>
            <span className="text-base font-bold text-white">${usdBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          <div>
            <span className="text-slate-400 block">{t('Disponible KLT', 'Available KLT')}</span>
            <span className="text-base font-bold text-white">{totalKltBalance.toLocaleString('en-US', { maximumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <AdvancedCandlestickChart />
        </div>

        {/* Order Execution Form */}
        <form onSubmit={handleOrder} className="bg-[#0F172A] border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 border border-slate-800 rounded-lg">
              <button
                type="button"
                onClick={() => setSide('buy')}
                className={`py-2 text-xs font-semibold rounded-md transition-colors ${
                  side === 'buy' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {t('Achat (Buy)', 'Buy')}
              </button>
              <button
                type="button"
                onClick={() => setSide('sell')}
                className={`py-2 text-xs font-semibold rounded-md transition-colors ${
                  side === 'sell' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {t('Vente (Sell)', 'Sell')}
              </button>
            </div>

            <div className="flex items-center gap-2">
              {(['market', 'limit'] as const).map((ot) => (
                <button
                  key={ot}
                  type="button"
                  onClick={() => setOrderType(ot)}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                    orderType === ot
                      ? 'border-amber-500 bg-amber-500/10 text-amber-300'
                      : 'border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {ot === 'market' ? t('Ordre Marché', 'Market Order') : t('Ordre Limite', 'Limit Order')}
                </button>
              ))}
            </div>

            <div>
              <label htmlFor="trade-qty" className="block text-xs text-slate-400 mb-1.5">
                {t('Quantité ($KLT)', 'Quantity ($KLT)')}
              </label>
              <input
                id="trade-qty"
                type="number"
                step="any"
                min="0"
                value={kltAmount}
                onChange={(e) => setKltAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono-tabular text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            {orderType === 'limit' && (
              <div>
                <label htmlFor="trade-limit" className="block text-xs text-slate-400 mb-1.5">
                  {t('Prix Limite (USD)', 'Limit Price (USD)')}
                </label>
                <input
                  id="trade-limit"
                  type="number"
                  step="0.0001"
                  min="0"
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono-tabular text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
            )}

            <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">{t('Prix d’exécution', 'Execution Price')}</span>
                <span className="font-mono-tabular text-white">${execPrice.toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{t('Total estimé', 'Estimated Total')}</span>
                <span className="font-mono-tabular font-bold text-amber-400">${totalUsd.toFixed(2)} USD</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-lg text-sm font-semibold transition-colors ${
              side === 'buy'
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-red-600 hover:bg-red-500 text-white'
            }`}
          >
            {side === 'buy' ? t('Placer ordre d’achat', 'Submit Buy Order') : t('Placer ordre de vente', 'Submit Sell Order')}
          </button>
        </form>
      </div>

      {/* Live Order Book + Raydium Trade Tape */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">
              {t('Carnet d’Ordres Raydium (KLT/USDC)', 'Raydium Order Book (KLT/USDC)')}
            </h2>
            <span className="text-xs font-mono-tabular text-slate-400">
              Spread: $0.0011
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs font-mono-tabular">
            <div className="space-y-1.5">
              <p className="text-[11px] text-emerald-400 font-semibold">{t('Achat (Bids)', 'Bids')}</p>
              {bids.map((b) => (
                <div key={b.price} className="flex justify-between px-2.5 py-1.5 rounded bg-emerald-500/5 border border-emerald-500/15">
                  <span className="text-emerald-400">${b.price.toFixed(4)}</span>
                  <span className="text-slate-300">{b.qty.toLocaleString()} KLT</span>
                </div>
              ))}
            </div>
            <div className="space-y-1.5">
              <p className="text-[11px] text-red-400 font-semibold">{t('Vente (Asks)', 'Asks')}</p>
              {asks.map((a) => (
                <div key={a.price} className="flex justify-between px-2.5 py-1.5 rounded bg-red-500/5 border border-red-500/15">
                  <span className="text-red-400">${a.price.toFixed(4)}</span>
                  <span className="text-slate-300">{a.qty.toLocaleString()} KLT</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />
              {t('Flux des Transactions Raydium', 'Raydium Trade Tape')}
            </h2>
            <span className={`text-xs font-mono-tabular ${wsLive ? 'text-emerald-400' : 'text-slate-400'}`}>
              {wsLive ? t('Streaming 2.5s', 'Streaming 2.5s') : t('En pause', 'Paused')}
            </span>
          </div>
          <div className="divide-y divide-slate-800/70 text-xs font-mono-tabular">
            {tape.slice(0, 5).map((item) => (
              <div key={item.id} className="py-2 flex items-center justify-between gap-2">
                <span className={item.side === 'buy' ? 'text-emerald-400 font-semibold' : 'text-red-400 font-semibold'}>
                  {item.side === 'buy' ? 'BUY' : 'SELL'}
                </span>
                <span className="text-white">${item.price.toFixed(4)}</span>
                <span className="text-slate-300">{item.amountKlt.toLocaleString()} KLT</span>
                <span className="text-slate-500">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Open Orders Table */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
        <h2 className="text-base font-semibold text-white mb-4">
          {t('Ordres Limites Ouverts', 'Open Limit Orders')} ({openOrders.length})
        </h2>

        {openOrders.length === 0 ? (
          <p className="text-sm text-slate-400 py-6 text-center">
            {t('Aucun ordre limite ouvert actuellement.', 'No open limit orders at the moment.')}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2.5 pr-4">{t('ID', 'ID')}</th>
                  <th className="py-2.5 pr-4">{t('Sens', 'Side')}</th>
                  <th className="py-2.5 pr-4 text-right">{t('Quantité', 'Amount')}</th>
                  <th className="py-2.5 pr-4 text-right">{t('Prix Limite', 'Limit Price')}</th>
                  <th className="py-2.5 pr-4 text-right">{t('Total USD', 'Total USD')}</th>
                  <th className="py-2.5 pr-4">{t('Date', 'Created')}</th>
                  <th className="py-2.5 text-right">{t('Action', 'Action')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {openOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-900/50">
                    <td className="py-3 pr-4 font-mono-tabular text-slate-300">{ord.id}</td>
                    <td className="py-3 pr-4 font-semibold">
                      <span className={ord.side === 'buy' ? 'text-emerald-400' : 'text-red-400'}>
                        {ord.side === 'buy' ? t('ACHAT', 'BUY') : t('VENTE', 'SELL')}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-right font-mono-tabular text-white">
                      {ord.kltAmount.toLocaleString()} KLT
                    </td>
                    <td className="py-3 pr-4 text-right font-mono-tabular text-amber-400">
                      ${ord.limitPrice.toFixed(4)}
                    </td>
                    <td className="py-3 pr-4 text-right font-mono-tabular text-slate-200">
                      ${ord.totalUsd.toFixed(2)}
                    </td>
                    <td className="py-3 pr-4 font-mono-tabular text-slate-400">{ord.createdAt}</td>
                    <td className="py-3 text-right">
                      <button
                        type="button"
                        onClick={() => cancelOrder(ord.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-slate-700 text-slate-300 hover:border-red-500/50 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        {t('Annuler', 'Cancel')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
