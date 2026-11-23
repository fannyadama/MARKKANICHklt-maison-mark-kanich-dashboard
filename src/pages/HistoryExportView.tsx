import React, { useState } from 'react';
import { Download, FileText, Search } from 'lucide-react';
import { useKLTStore } from '../context/KLTStoreContext';
import { TransactionType } from '../types/klt';

export const HistoryExportView: React.FC = () => {
  const { t, transactions, user, totalKltBalance, kltPriceUsd, notify } = useKLTStore();
  const [filterType, setFilterType] = useState<'all' | TransactionType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = transactions.filter((tx) => {
    if (filterType !== 'all' && tx.type !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        tx.description.toLowerCase().includes(q) ||
        tx.txHash.toLowerCase().includes(q) ||
        String(tx.totalAmount).includes(q)
      );
    }
    return true;
  });

  const exportCsv = () => {
    const headers = ['Date', 'Type', 'KLT Amount', 'Price USD', 'Total', 'Currency', 'Method', 'TxHash', 'Status'];
    const rows = filtered.map((tx) => [
      tx.createdAt,
      tx.type.toUpperCase(),
      tx.kltAmount,
      tx.pricePerKlt,
      tx.totalAmount,
      tx.currency,
      tx.paymentMethod || '',
      tx.txHash,
      tx.status,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `klt-transactions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    notify(t('Relevé CSV téléchargé.', 'CSV statement downloaded.'));
  };

  const printPdfReport = () => {
    window.print();
    notify(t('Boîte d’impression PDF ouverte.', 'PDF print dialog opened.'), 'info');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {t('Historique & Exports Certifiés', 'Transaction History & Certified Exports')}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {t('Audit complet des opérations et génération de relevés CSV / PDF.', 'Complete operations audit trail and CSV / PDF statement export.')}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={exportCsv}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-200 whitespace-nowrap"
          >
            <Download className="w-4 h-4 text-amber-400" />
            {t('Exporter CSV', 'Export CSV')}
          </button>
          <button
            type="button"
            onClick={printPdfReport}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold whitespace-nowrap"
          >
            <FileText className="w-4 h-4" />
            {t('Relevé PDF / Imprimer', 'PDF Statement / Print')}
          </button>
        </div>
      </div>

      {/* Print Header */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5 print-only-light">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <p className="font-serif-luxury text-lg font-bold text-amber-400">
              MAISON MARK KANICH · KIIS GLOBAL
            </p>
            <p className="text-xs text-slate-400">
              {t('Titulaire', 'Account Holder')}: {user.name} ({user.email})
            </p>
          </div>
          <div className="text-right text-xs font-mono-tabular">
            <p className="text-slate-300">
              {t('Solde actuel', 'Current Balance')}: {totalKltBalance.toLocaleString()} $KLT
            </p>
            <p className="text-slate-400">
              {t('Valorisation', 'Valuation')}: ${(totalKltBalance * kltPriceUsd).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
            </p>
          </div>
        </div>

        {/* Summary Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
          <div>
            <span className="text-slate-400">{t('Total Opérations', 'Total Operations')}</span>
            <p className="text-lg font-bold text-white font-mono-tabular mt-0.5">{transactions.length}</p>
          </div>
          <div>
            <span className="text-slate-400">{t('Achats / Swaps', 'Buys / Swaps')}</span>
            <p className="text-lg font-bold text-emerald-400 font-mono-tabular mt-0.5">
              {transactions.filter((x) => x.type === 'buy' || x.type === 'swap').length}
            </p>
          </div>
          <div>
            <span className="text-slate-400">{t('Ventes / Trades', 'Sells / Trades')}</span>
            <p className="text-lg font-bold text-amber-400 font-mono-tabular mt-0.5">
              {transactions.filter((x) => x.type === 'sell' || x.type === 'trade').length}
            </p>
          </div>
          <div>
            <span className="text-slate-400">{t('Staking & Parrainage', 'Staking & Referrals')}</span>
            <p className="text-lg font-bold text-sky-400 font-mono-tabular mt-0.5">
              {transactions.filter((x) => x.type === 'reward' || x.type === 'stake' || x.type === 'referral').length}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg overflow-x-auto">
          {(
            [
              { id: 'all', fr: 'Tous', en: 'All' },
              { id: 'buy', fr: 'Achat', en: 'Buy' },
              { id: 'sell', fr: 'Vente', en: 'Sell' },
              { id: 'trade', fr: 'Trade', en: 'Trade' },
              { id: 'swap', fr: 'Swap', en: 'Swap' },
              { id: 'reward', fr: 'Récompenses', en: 'Rewards' },
              { id: 'referral', fr: 'Parrainage', en: 'Referral' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                filterType === tab.id ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t(tab.fr, tab.en)}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('Rechercher hash, libellé...', 'Search hash, label...')}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5 print-only-light">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 pr-4">{t('Date', 'Date')}</th>
                <th className="py-2.5 pr-4">{t('Type', 'Type')}</th>
                <th className="py-2.5 pr-4">{t('Description', 'Description')}</th>
                <th className="py-2.5 pr-4 text-right">{t('Quantité $KLT', '$KLT Amount')}</th>
                <th className="py-2.5 pr-4 text-right">{t('Cours', 'Price')}</th>
                <th className="py-2.5 pr-4 text-right">{t('Total', 'Total')}</th>
                <th className="py-2.5 text-right">{t('Hash', 'Tx Hash')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    {t('Aucune transaction ne correspond à votre filtre.', 'No transactions match your filter.')}
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-900/50">
                    <td className="py-3 pr-4 font-mono-tabular text-slate-400 whitespace-nowrap">{tx.createdAt}</td>
                    <td className="py-3 pr-4 font-semibold uppercase text-amber-400 whitespace-nowrap">{tx.type}</td>
                    <td className="py-3 pr-4 text-slate-200">{tx.description}</td>
                    <td className="py-3 pr-4 text-right font-mono-tabular font-semibold text-white whitespace-nowrap">
                      {tx.type === 'sell' ? '-' : '+'}
                      {tx.kltAmount.toLocaleString('en-US', { maximumFractionDigits: 2 })} KLT
                    </td>
                    <td className="py-3 pr-4 text-right font-mono-tabular text-slate-300 whitespace-nowrap">
                      ${tx.pricePerKlt.toFixed(4)}
                    </td>
                    <td className="py-3 pr-4 text-right font-mono-tabular text-white whitespace-nowrap">
                      {tx.totalAmount.toLocaleString('en-US', { maximumFractionDigits: 2 })} {tx.currency}
                    </td>
                    <td className="py-3 text-right font-mono-tabular text-slate-400 whitespace-nowrap">{tx.txHash}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
