import React from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Building2,
  Coins,
  Eye,
  EyeOff,
  FileCheck2,
  Globe,
  RefreshCw,
  ShieldCheck,
  Terminal,
  TrendingUp,
  UserPlus,
  Wallet,
} from 'lucide-react';
import { useKLTStore } from '../context/KLTStoreContext';
import { BrandMark } from '../components/BrandMark';
import { CryptoComparisonChart, KLTPriceChart } from '../components/Charts';
import { KLTRechartsPerformance } from '../components/KLTRechartsPerformance';
import { StakingCalculator } from '../components/StakingCalculator';
import { StakingApyChart } from '../components/StakingApyChart';
import { PriceAlertConfigSection } from '../components/PriceAlertConfigSection';
import { PenguinOnboarding } from '../components/PenguinOnboarding';
import { SolscanTracker } from '../components/SolscanTracker';
import { MarkKanichXFeedCard } from '../components/MarkKanichXFeedCard';
import { EIGHT_PILLARS_REPORTING, FX_RATES } from '../data/kltSeedData';

export const DashboardView: React.FC = () => {
  const {
    t,
    user,
    totalKltBalance,
    stakedKlt,
    stakingRewardsKlt,
    usdBalance,
    assets,
    kltPriceUsd,
    refreshMarketPrices,
    transactions,
    hideBalances,
    toggleHideBalances,
    formatFiat,
    setRoute,
    workspaceMode,
    setWorkspaceMode,
    showWeb3Wallet,
    customDomain,
    referrals,
    subscriptionPlan,
    solanaConnected,
    walletProvider,
    solanaAddress,
    openWalletModal,
  } = useKLTStore();

  const kltAsset = assets.find((a) => a.symbol === 'KLT') || assets[0];
  const totalPortfolioUsd = (totalKltBalance + stakedKlt) * kltPriceUsd + usdBalance;
  const totalEur = totalPortfolioUsd * FX_RATES.EUR;
  const totalXof = totalPortfolioUsd * FX_RATES.XOF;
  const isUp24h = kltAsset.change24h >= 0;

  const totalEightPillarsRevenue = EIGHT_PILLARS_REPORTING.reduce((s, p) => s + p.revenueUsd, 0);
  const showKltModules = showWeb3Wallet && workspaceMode !== 'stipulor';
  const showStipulorModules = workspaceMode !== 'klt' || !showWeb3Wallet;

  return (
    <div className="space-y-6">
      {/* Inline Penguin Mascot Onboarding (non-blocking) */}
      <PenguinOnboarding />

      {/* Welcome & Role Context Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <BrandMark size="lg" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {t(`Bienvenue, ${user.name}`, `Welcome back, ${user.name}`)}
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              {t('Maison Mark Kanich · Stipulor SaaS & $KLT Solana', 'Maison Mark Kanich · Stipulor SaaS & $KLT Solana')}
              <span aria-hidden="true"> · </span>
              <span className="text-amber-400 font-medium">
                {user.role === 'admin' ? t('Administrateur', 'Administrator') : t('Trader Standard', 'Standard Trader')}
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <div className="inline-flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
            {(
              [
                { id: 'all', fr: 'Unifié', en: 'Unified' },
                { id: 'stipulor', fr: 'Stipulor SaaS', en: 'Stipulor SaaS' },
                { id: 'klt', fr: '$KLT Web3', en: '$KLT Web3' },
              ] as const
            ).map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setWorkspaceMode(mode.id)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                  workspaceMode === mode.id
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t(mode.fr, mode.en)}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={toggleHideBalances}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
          >
            {hideBalances ? <Eye className="w-4 h-4 text-amber-400" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
            {hideBalances ? t('Afficher soldes', 'Show balances') : t('Masquer soldes', 'Hide balances')}
          </button>
          {showKltModules && (
            <button
              type="button"
              onClick={openWalletModal}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                solanaConnected
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                  : 'border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
              }`}
            >
              <Wallet className="w-3.5 h-3.5" />
              {solanaConnected
                ? `${walletProvider} · ${solanaAddress.slice(0, 4)}..${solanaAddress.slice(-4)}`
                : t('Connecter Wallet', 'Connect Wallet')}
            </button>
          )}
          <button
            type="button"
            onClick={refreshMarketPrices}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            {t('Actualiser cours', 'Refresh rates')}
          </button>
        </div>
      </div>

      {/* Stipulor SaaS & 8 Pillars Governance Summary (shown in Unified & Stipulor modes) */}
      {showStipulorModules && (
        <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-amber-400">
                STIPULOR SAAS · {customDomain}
              </p>
              <h2 className="text-base font-semibold text-white mt-0.5">
                {t(
                  'Pilotage Abonnements, PSP FCFA, Parrainage & 8 Piliers KIIS Global',
                  'Subscriptions, FCFA PSPs, Referrals & 8 KIIS Global Pillars'
                )}
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setRoute('pillars-reporting')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:border-amber-500 text-xs font-medium text-slate-200 whitespace-nowrap"
              >
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                {t('8 Piliers Reporting', '8 Pillars Reporting')}
              </button>
              <button
                type="button"
                onClick={() => setRoute('referral')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:border-amber-500 text-xs font-medium text-slate-200 whitespace-nowrap"
              >
                <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
                {t('Parrainage', 'Referrals')} ({referrals.length})
              </button>
              <button
                type="button"
                onClick={() => setRoute('action-plan')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-xs font-semibold text-amber-300 whitespace-nowrap"
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                {t('Plan P0–P2 & Conformité', 'P0–P2 Action Plan')}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
              <p className="text-slate-400">{t('Revenu Consolidé (8 Piliers)', 'Consolidated Revenue (8 Pillars)')}</p>
              <p className="text-lg font-bold text-white font-mono-tabular mt-1">
                ${(totalEightPillarsRevenue / 1e6).toFixed(2)}M
              </p>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
              <p className="text-slate-400">{t('Passerelles PSP Actives', 'Active PSP Gateways')}</p>
              <p className="text-lg font-bold text-emerald-400 font-mono-tabular mt-1">
                Paddle · Paystack · CinetPay
              </p>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800">
              <p className="text-slate-400">{t('Plan Stipulor Actif', 'Active Stipulor Plan')}</p>
              <p className="text-lg font-bold text-amber-400 font-mono-tabular mt-1 uppercase">
                {subscriptionPlan}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setRoute('remboursement')}
              className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-left transition-colors"
            >
              <p className="text-slate-400 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                {t('Page Paddle Dédiée', 'Dedicated Paddle Page')}
              </p>
              <p className="text-sm font-bold text-white font-mono-tabular mt-1">/remboursement →</p>
            </button>
          </div>
        </div>
      )}

      {/* Top Grid: Portfolio Value (2 cols) + Quick Actions (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#0F172A] border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-slate-400">
                {t('Valeur Totale du Portefeuille', 'Total Portfolio Value')}
              </p>
              <div className="mt-2 flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl sm:text-4xl font-bold text-white font-mono-tabular">
                  {hideBalances ? '••••••' : formatFiat(totalPortfolioUsd, 'USD')}
                </span>
                <span className="text-sm text-amber-400 font-mono-tabular">
                  {hideBalances
                    ? '••••••'
                    : `≈ €${totalEur.toLocaleString('en-US', { maximumFractionDigits: 2 })} · ${Math.round(totalXof).toLocaleString('fr-FR')} FCFA`}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400">{t('Variation 24h', '24h Change')}</span>
              <div
                className={`mt-1 flex items-center justify-end gap-1 text-sm font-semibold font-mono-tabular ${
                  isUp24h ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {isUp24h ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {isUp24h ? '+' : ''}
                {kltAsset.change24h.toFixed(2)}%
              </div>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-slate-400">{t('$KLT Disponible', 'Available $KLT')}</p>
              <p className="text-lg font-semibold text-white font-mono-tabular mt-1">
                {hideBalances ? '••••' : totalKltBalance.toLocaleString('en-US', { maximumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">{t('$KLT Staké (15% APY)', 'Staked $KLT (15% APY)')}</p>
              <p className="text-lg font-semibold text-amber-400 font-mono-tabular mt-1">
                {hideBalances ? '••••' : stakedKlt.toLocaleString('en-US', { maximumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">{t('Récompenses Staking', 'Staking Rewards')}</p>
              <p className="text-lg font-semibold text-emerald-400 font-mono-tabular mt-1">
                {hideBalances ? '••••' : `+${stakingRewardsKlt.toFixed(2)} KLT`}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">{t('Liquidité USD', 'USD Liquidity')}</p>
              <p className="text-lg font-semibold text-white font-mono-tabular mt-1">
                {hideBalances ? '••••' : `$${usdBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white mb-4">
              {t('Actions Rapides', 'Quick Actions')}
            </h2>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setRoute('buy')}
                className="px-3 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors whitespace-nowrap"
              >
                {t('Acheter KLT', 'Buy KLT')}
              </button>
              <button
                type="button"
                onClick={() => setRoute('sell')}
                className="px-3 py-2.5 rounded-lg bg-red-600/90 hover:bg-red-500 text-white text-xs font-semibold transition-colors whitespace-nowrap"
              >
                {t('Vendre KLT', 'Sell KLT')}
              </button>
              <button
                type="button"
                onClick={() => setRoute('trade')}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-semibold transition-colors whitespace-nowrap"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                {t('Trading', 'Trade')}
              </button>
              <button
                type="button"
                onClick={() => setRoute('solana-trading')}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-semibold transition-colors whitespace-nowrap"
              >
                <Coins className="w-3.5 h-3.5" />
                {t('Swap & Stake', 'Swap & Stake')}
              </button>
              <button
                type="button"
                onClick={() => setRoute('wallet')}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-medium transition-colors whitespace-nowrap"
              >
                <Wallet className="w-3.5 h-3.5" />
                {t('Portefeuille', 'Wallet')}
              </button>
              <button
                type="button"
                onClick={() => setRoute('live-statistics')}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-emerald-400 text-xs font-medium transition-colors whitespace-nowrap"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                {t('Statistiques', 'Live Stats')}
              </button>
            </div>
          </div>

          {user.role === 'admin' && (
            <button
              type="button"
              onClick={() => setRoute('devnet-ops')}
              className="mt-3 w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-semibold transition-colors whitespace-nowrap"
            >
              <Terminal className="w-3.5 h-3.5" />
              {t('Devnet Ops (Admin Solana)', 'Devnet Ops (Admin Solana)')}
            </button>
          )}
        </div>
      </div>

      {/* Crypto Ticker Strip */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="text-base font-semibold text-white">
            {t('Cours Crypto en Direct', 'Live Crypto Rates')}
          </h2>
          <button
            type="button"
            onClick={() => setRoute('crypto-rates')}
            className="text-xs font-medium text-amber-400 hover:text-amber-300 whitespace-nowrap"
          >
            {t('Voir tous les marchés →', 'View all markets →')}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {assets.slice(0, 6).map((asset) => {
            const up = asset.change24h >= 0;
            return (
              <div
                key={asset.symbol}
                className="p-3 rounded-lg bg-slate-900/70 border border-slate-800/80 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{asset.symbol}</span>
                  <span
                    className={`text-xs font-mono-tabular font-medium ${
                      up ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {up ? '+' : ''}
                    {asset.change24h.toFixed(2)}%
                  </span>
                </div>
                <p className="text-sm font-bold text-white font-mono-tabular mt-2">
                  ${asset.priceUsd < 10 ? asset.priceUsd.toFixed(4) : asset.priceUsd.toLocaleString('en-US')}
                </p>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">{asset.name}</p>
              </div>
            );
          })}
        </div>
      </div>

      {showKltModules && (
        <>
          {/* KLT Price Widget + Chart */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold text-white">
                    {t('Indice $KLT Solana', '$KLT Solana Index')}
                  </h3>
                  <span className="text-xs text-emerald-400 font-medium">SPL · Pump.fun</span>
                </div>
                <p className="text-3xl font-bold text-white font-mono-tabular">${kltAsset.priceUsd.toFixed(4)}</p>
                <p className={`text-xs font-mono-tabular mt-1 ${isUp24h ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isUp24h ? '+' : ''}
                  {kltAsset.change24h.toFixed(2)}% {t('sur 24h', '24h')}
                </p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 pt-4 border-t border-slate-800">
                <div>
                  <p className="text-xs text-slate-400">{t('Plus haut 24h', '24h High')}</p>
                  <p className="text-sm font-semibold text-white font-mono-tabular mt-0.5">
                    ${kltAsset.high24h.toFixed(4)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">{t('Plus bas 24h', '24h Low')}</p>
                  <p className="text-sm font-semibold text-white font-mono-tabular mt-0.5">
                    ${kltAsset.low24h.toFixed(4)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">{t('Volume 24h', '24h Volume')}</p>
                  <p className="text-sm font-semibold text-white font-mono-tabular mt-0.5">
                    ${(kltAsset.volume24h / 1e6).toFixed(2)}M
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">{t('Capitalisation (FDV)', 'Market Cap')}</p>
                  <p className="text-sm font-semibold text-amber-400 font-mono-tabular mt-0.5">
                    ${(kltAsset.marketCap / 1e6).toFixed(2)}M
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="inline-flex items-center gap-1.5 text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  {t('Mint & Freeze Révoqués', 'Mint & Freeze Revoked')}
                </span>
                <button
                  type="button"
                  onClick={() => setRoute('whitepaper')}
                  className="text-amber-400 hover:text-amber-300 font-medium whitespace-nowrap"
                >
                  {t('Livre Blanc →', 'Whitepaper →')}
                </button>
              </div>
            </div>

            <div className="xl:col-span-2">
              <KLTPriceChart />
            </div>
          </div>

          {/* 30-Day Recharts Performance: $KLT Token Price & User Holdings */}
          <KLTRechartsPerformance />

          {/* Crypto Comparison Chart */}
          <CryptoComparisonChart />

          {/* Interactive $KLT Staking Calculator */}
          <StakingCalculator />

          {/* 12-Month 15% APY Staking Progression Chart (Recharts) */}
          <StakingApyChart />

          {/* Custom $KLT Price Alerts Configuration */}
          <PriceAlertConfigSection />

          {/* Sécurité & Preuves — SolscanTracker Iframe & On-Chain Burn/Locks */}
          <section id="dashboard-securite-preuves" className="bg-[#0F172A] border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-amber-400">
                  {t('SÉCURITÉ & PREUVES', 'SECURITY & PROOFS')}
                </p>
                <h2 className="text-lg font-bold text-white mt-0.5">
                  {t(
                    'Sécurité & Preuves On-Chain Solana (Solscan Tracker)',
                    'Solana On-Chain Security & Proofs (Solscan Tracker)'
                  )}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setRoute('presentation')}
                className="text-xs font-medium text-amber-400 hover:text-amber-300 whitespace-nowrap"
              >
                {t('Voir page Maison complète →', 'View full Maison page →')}
              </button>
            </div>
            <SolscanTracker />
          </section>
        </>
      )}

      {/* Official Mark Kanich X Social Media Feed */}
      <MarkKanichXFeedCard />

      {/* Holdings Allocation & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
          <h3 className="text-base font-semibold text-white mb-1">
            {t('Répartition des Actifs', 'Holdings Summary')}
          </h3>
          <p className="text-xs text-slate-400 mb-5">
            {t('Ventilation de votre exposition $KLT et trésorerie', 'Breakdown of your $KLT exposure and cash')}
          </p>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-300">{t('$KLT Liquide', 'Liquid $KLT')}</span>
                <span className="font-mono-tabular text-white font-semibold">
                  {hideBalances ? '••••' : `${totalKltBalance.toLocaleString('en-US', { maximumFractionDigits: 2 })} KLT`}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '68%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-300">{t('$KLT Staké (15% APY)', 'Staked $KLT (15% APY)')}</span>
                <span className="font-mono-tabular text-amber-400 font-semibold">
                  {hideBalances ? '••••' : `${stakedKlt.toLocaleString('en-US', { maximumFractionDigits: 2 })} KLT`}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '22%' }} />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-sm">
              <span className="text-slate-400">{t('Solde USD Disponible', 'Available USD')}</span>
              <span className="font-mono-tabular font-semibold text-white">
                {hideBalances ? '••••' : `$${usdBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-[#0F172A] border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-white">
                {t('Transactions Récentes', 'Recent Transactions')}
              </h3>
              <p className="text-xs text-slate-400">
                {t('Derniers mouvements on-chain et ordres exécutés', 'Latest on-chain movements and executed orders')}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setRoute('history')}
              className="text-xs font-medium text-amber-400 hover:text-amber-300 whitespace-nowrap"
            >
              {t('Historique complet →', 'Full history →')}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-medium text-slate-400">
                  <th className="py-2.5 pr-4">{t('Opération', 'Operation')}</th>
                  <th className="py-2.5 pr-4">{t('Date', 'Date')}</th>
                  <th className="py-2.5 pr-4 text-right">{t('Montant $KLT', '$KLT Amount')}</th>
                  <th className="py-2.5 pr-4 text-right">{t('Valeur', 'Total')}</th>
                  <th className="py-2.5 text-right">{t('Statut', 'Status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 text-xs">
                {transactions.slice(0, 5).map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3 pr-4">
                      <p className="font-medium text-white">{tx.description}</p>
                      <p className="text-[11px] text-slate-500 font-mono-tabular">{tx.txHash}</p>
                    </td>
                    <td className="py-3 pr-4 text-slate-400 font-mono-tabular whitespace-nowrap">
                      {tx.createdAt.slice(0, 16)}
                    </td>
                    <td className="py-3 pr-4 text-right font-mono-tabular font-semibold text-white whitespace-nowrap">
                      {tx.type === 'sell' ? '-' : '+'}
                      {tx.kltAmount.toLocaleString('en-US', { maximumFractionDigits: 2 })} KLT
                    </td>
                    <td className="py-3 pr-4 text-right font-mono-tabular text-slate-300 whitespace-nowrap">
                      {tx.totalAmount.toLocaleString('en-US', { maximumFractionDigits: 2 })} {tx.currency}
                    </td>
                    <td className="py-3 text-right whitespace-nowrap">
                      <span className="text-emerald-400 font-medium">{tx.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
