import React, { useState } from 'react';
import { RefreshCw, Search, TrendingUp, Users } from 'lucide-react';
import { useKLTStore } from '../context/KLTStoreContext';
import { CSV_USERS_REGISTRY } from '../data/kltSeedData';

interface LiveStatsRatesViewProps {
  initialTab?: 'stats' | 'rates';
}

export const LiveStatsRatesView: React.FC<LiveStatsRatesViewProps> = ({ initialTab = 'stats' }) => {
  const { t, assets, refreshMarketPrices, transactions, setRoute } = useKLTStore();
  const [tab, setTab] = useState<'stats' | 'rates'>(initialTab);
  const [search, setSearch] = useState('');

  const filteredAssets = assets.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {tab === 'stats'
              ? t('Statistiques Live & Registre Utilisateurs', 'Live Statistics & User Registry')
              : t('Cours des Cryptomonnaies', 'Cryptocurrency Market Rates')}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {t('Indicateurs réseau en temps réel, annuaire CSV et cotations multi-actifs.', 'Real-time platform metrics, CSV user directory, and market quotes.')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
            <button
              type="button"
              onClick={() => setTab('stats')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                tab === 'stats' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('Statistiques Live', 'Live Stats')}
            </button>
            <button
              type="button"
              onClick={() => setTab('rates')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                tab === 'rates' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('Cours Crypto', 'Crypto Rates')}
            </button>
          </div>
          <button
            type="button"
            onClick={refreshMarketPrices}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-xs text-slate-200 hover:bg-slate-800 whitespace-nowrap"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            {t('Actualiser', 'Refresh')}
          </button>
        </div>
      </div>

      {tab === 'stats' ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
              <p className="text-xs text-slate-400">{t('Abonnés & Comptes Vérifiés', 'Verified Accounts')}</p>
              <p className="text-3xl font-bold text-white font-mono-tabular mt-2">
                {(4820 + CSV_USERS_REGISTRY.length).toLocaleString()}
              </p>
              <p className="text-xs text-emerald-400 mt-1">+18.4% {t('ce mois', 'this month')}</p>
            </div>
            <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
              <p className="text-xs text-slate-400">{t('Offre Totale $KLT', '$KLT Total Supply')}</p>
              <p className="text-3xl font-bold text-amber-400 font-mono-tabular mt-2">100,000,000</p>
              <p className="text-xs text-slate-400 mt-1">30% {t('brûlés définitivement', 'permanently burned')}</p>
            </div>
            <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
              <p className="text-xs text-slate-400">{t('Volume Écosystème 24h', '24h Ecosystem Volume')}</p>
              <p className="text-3xl font-bold text-white font-mono-tabular mt-2">$4.28M</p>
              <p className="text-xs text-emerald-400 mt-1">Pump.fun · Raydium</p>
            </div>
            <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
              <p className="text-xs text-slate-400">{t('Opérations Enregistrées', 'Recorded Operations')}</p>
              <p className="text-3xl font-bold text-white font-mono-tabular mt-2">{transactions.length}</p>
              <p className="text-xs text-slate-400 mt-1">{t('Session locale persistante', 'Persistent local ledger')}</p>
            </div>
          </div>

          {/* User & Referral Registry sourced from attached CSV files */}
          <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2.5">
                <Users className="w-5 h-5 text-amber-400" />
                <div>
                  <h2 className="text-base font-semibold text-white">
                    {t('Annuaire Utilisateurs & Parrainages (Export CSV)', 'Users & Referral Registry (CSV Import)')}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {t('Comptes importés depuis vos exports CSV officiels (users_20261120)', 'Accounts imported from your official CSV exports (users_20261120)')}
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono-tabular text-slate-400">
                {CSV_USERS_REGISTRY.length} {t('enregistrements', 'records')}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2.5 pr-4">ID</th>
                    <th className="py-2.5 pr-4">{t('Nom', 'Name')}</th>
                    <th className="py-2.5 pr-4">Email</th>
                    <th className="py-2.5 pr-4">{t('Méthode', 'Login')}</th>
                    <th className="py-2.5 pr-4">{t('Rôle', 'Role')}</th>
                    <th className="py-2.5 pr-4">{t('Catégorie', 'Category')}</th>
                    <th className="py-2.5 text-right">{t('Dernière connexion', 'Last Sign-In')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  {CSV_USERS_REGISTRY.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-900/50">
                      <td className="py-3 pr-4 font-mono-tabular text-slate-400">{u.id}</td>
                      <td className="py-3 pr-4 font-semibold text-white">{u.name}</td>
                      <td className="py-3 pr-4 text-slate-300 font-mono-tabular">{u.email}</td>
                      <td className="py-3 pr-4 text-slate-400">{u.loginMethod}</td>
                      <td className="py-3 pr-4">
                        <span className={u.role === 'admin' ? 'text-amber-400 font-semibold' : 'text-slate-300'}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-slate-300">{u.referralType}</td>
                      <td className="py-3 text-right font-mono-tabular text-slate-400 whitespace-nowrap">
                        {u.lastSignedIn}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('Filtrer par nom ou symbole...', 'Filter by name or symbol...')}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2.5 pr-4">{t('Actif', 'Asset')}</th>
                  <th className="py-2.5 pr-4 text-right">{t('Prix USD', 'Price USD')}</th>
                  <th className="py-2.5 pr-4 text-right">{t('Var. 24h', '24h Change')}</th>
                  <th className="py-2.5 pr-4 text-right">{t('Plus haut 24h', '24h High')}</th>
                  <th className="py-2.5 pr-4 text-right">{t('Volume 24h', '24h Volume')}</th>
                  <th className="py-2.5 text-right">{t('Action', 'Action')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {filteredAssets.map((a) => {
                  const up = a.change24h >= 0;
                  return (
                    <tr key={a.symbol} className="hover:bg-slate-900/50">
                      <td className="py-3 pr-4">
                        <span className="font-bold text-white">{a.symbol}</span>
                        <span className="text-slate-400 ml-2">{a.name}</span>
                      </td>
                      <td className="py-3 pr-4 text-right font-mono-tabular font-semibold text-white">
                        ${a.priceUsd < 10 ? a.priceUsd.toFixed(4) : a.priceUsd.toLocaleString('en-US')}
                      </td>
                      <td className={`py-3 pr-4 text-right font-mono-tabular font-semibold ${up ? 'text-emerald-400' : 'text-red-400'}`}>
                        {up ? '+' : ''}
                        {a.change24h.toFixed(2)}%
                      </td>
                      <td className="py-3 pr-4 text-right font-mono-tabular text-slate-300">
                        ${a.high24h < 10 ? a.high24h.toFixed(4) : a.high24h.toLocaleString('en-US')}
                      </td>
                      <td className="py-3 pr-4 text-right font-mono-tabular text-slate-400">
                        ${(a.volume24h / 1e6).toFixed(1)}M
                      </td>
                      <td className="py-3 text-right">
                        <button
                          type="button"
                          onClick={() => setRoute(a.symbol === 'KLT' ? 'trade' : 'solana-trading')}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-slate-700 text-amber-400 hover:bg-slate-800"
                        >
                          <TrendingUp className="w-3 h-3" />
                          {t('Trader', 'Trade')}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
