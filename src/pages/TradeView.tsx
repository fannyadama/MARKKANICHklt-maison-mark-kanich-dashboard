import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useKLTStore } from '../context/KLTStoreContext';
import { AdvancedCandlestickChart } from '../components/Charts';

export const TradeView: React.FC = () => {
  const { t, kltPriceUsd, totalKltBalance, usdBalance, openOrders, placeOrder, cancelOrder } = useKLTStore();
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [kltAmount, setKltAmount] = useState('1500');
  const [limitPrice, setLimitPrice] = useState(kltPriceUsd.toFixed(4));

  const numericAmount = parseFloat(kltAmount) || 0;
  const execPrice = orderType === 'limit' ? parseFloat(limitPrice) || kltPriceUsd : kltPriceUsd;
  const totalUsd = numericAmount * execPrice;

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
            {t('Trading Avancé & Analyse Technique', 'Advanced Trading & Technical Analysis')}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {t('Ordres au marché, ordres limites et graphiques OHLCV KLT/USD.', 'Market orders, limit orders, and KLT/USD OHLCV charts.')}
          </p>
        </div>
        <div className="flex items-center gap-6 text-xs font-mono-tabular">
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
