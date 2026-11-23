import React, { useState } from 'react';
import {
  ArrowDownUp,
  CheckCircle2,
  Coins,
  Copy,
  ExternalLink,
  Flame,
  Lock,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import { useKLTStore } from '../context/KLTStoreContext';

export const SolanaHubView: React.FC = () => {
  const {
    t,
    user,
    assets,
    kltPriceUsd,
    totalKltBalance,
    stakedKlt,
    stakingRewardsKlt,
    solanaConnected,
    solanaAddress,
    walletProvider,
    connectWalletWithProvider,
    toggleSolanaConnection,
    showWeb3Wallet,
    featureWeb3,
    setFeatureWeb3,
    setWeb3ModeEnabled,
    kltMintAddress,
    setKltMintAddress,
    swapTokens,
    stakeKlt,
    unstakeKlt,
    claimStakingRewards,
    notify,
  } = useKLTStore();

  const [activeTab, setActiveTab] = useState<'swap' | 'stake'>('swap');
  const [payAsset, setPayAsset] = useState<'SOL' | 'USDC'>('SOL');
  const [payAmount, setPayAmount] = useState('2.5');
  const [stakeAmount, setStakeAmount] = useState('5000');
  const [mintDraft, setMintDraft] = useState(kltMintAddress);

  const solPrice = assets.find((a) => a.symbol === 'SOL')?.priceUsd || 198.4;
  const numericPay = parseFloat(payAmount) || 0;
  const estimatedKltOut = (payAsset === 'SOL' ? numericPay * solPrice : numericPay) / kltPriceUsd;

  const handleSwap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!solanaConnected) return;
    swapTokens(payAsset, numericPay);
  };

  if (!showWeb3Wallet) {
    return (
      <div className="max-w-3xl mx-auto bg-[#0F172A] border border-slate-800 rounded-xl p-6 sm:p-8 space-y-5">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Wallet className="w-5 h-5 text-amber-400" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-white">
              {t('Module Web3 Solana ($KLT) en mode isolé', 'Solana Web3 Module ($KLT) Isolated')}
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              {!featureWeb3
                ? t(
                    'Le flag administrateur FEATURE_WEB3 est désactivé afin de présenter uniquement l’espace SaaS Stipulor / Paddle.',
                    'The global FEATURE_WEB3 flag is disabled to isolate the Stipulor / Paddle SaaS workspace.'
                  )
                : t(
                    'Vous avez choisi de masquer les portefeuilles Solana. Activez l’option Web3 pour connecter Phantom ou Solflare, vérifier le burn sur Solscan et staker à 15% APY.',
                    'You chose to hide Solana wallets. Enable Web3 opt-in to connect Phantom or Solflare, inspect the Solscan burn, and stake at 15% APY.'
                  )}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          {!featureWeb3 && user.role === 'admin' && (
            <button
              type="button"
              onClick={() => setFeatureWeb3(true)}
              className="px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold transition-colors whitespace-nowrap"
            >
              {t('Activer FEATURE_WEB3 (Admin)', 'Enable FEATURE_WEB3 (Admin)')}
            </button>
          )}
          <button
            type="button"
            onClick={() => setWeb3ModeEnabled(true)}
            className="px-4 py-2.5 rounded-lg border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold transition-colors whitespace-nowrap"
          >
            {t('Activer mon Opt-In Wallet Web3 ($KLT)', 'Enable Web3 Wallet Opt-In ($KLT)')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {t('Solana Trading Hub · Phantom, Solflare & Solscan', 'Solana Trading Hub · Phantom, Solflare & Solscan')}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {t(
              'Connectez Phantom ou Solflare, auditez le burn Solscan et stakez vos $KLT jusqu’à 15% APY.',
              'Connect Phantom or Solflare, audit Solscan burn proof, and stake $KLT up to 15% APY.'
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => connectWalletWithProvider('Phantom')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-colors whitespace-nowrap ${
              solanaConnected && walletProvider === 'Phantom'
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                : 'border-slate-700 bg-slate-900 text-slate-200 hover:border-amber-500'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            Phantom {solanaConnected && walletProvider === 'Phantom' ? `· ${solanaAddress.slice(0, 4)}..${solanaAddress.slice(-4)}` : ''}
          </button>
          <button
            type="button"
            onClick={() => connectWalletWithProvider('Solflare')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-colors whitespace-nowrap ${
              solanaConnected && walletProvider === 'Solflare'
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                : 'border-slate-700 bg-slate-900 text-slate-200 hover:border-amber-500'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            Solflare {solanaConnected && walletProvider === 'Solflare' ? `· ${solanaAddress.slice(0, 4)}..${solanaAddress.slice(-4)}` : ''}
          </button>
          {solanaConnected && (
            <button
              type="button"
              onClick={toggleSolanaConnection}
              className="px-3 py-2 rounded-lg border border-red-500/30 text-xs text-red-400 hover:bg-red-500/10 whitespace-nowrap"
            >
              {t('Déconnecter', 'Disconnect')}
            </button>
          )}
        </div>
      </div>

      {/* Bonding Curve + Solscan Burn Transparency Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold text-white">
                {t('Bonding Curve Pump.fun → Migration Raydium', 'Pump.fun Bonding Curve → Raydium Migration')}
              </span>
              <span className="text-xs font-mono-tabular text-amber-400 font-semibold">
                82.4 / 85.0 SOL (96.9%)
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: '96.9%' }} />
            </div>
            <p className="text-xs text-slate-400 mt-3 leading-relaxed">
              {t(
                'Sécurité Anti-Rug Pull native : à 85 SOL, la liquidité migre automatiquement sur Raydium et les tokens LP sont brûlés.',
                'Native Anti-Rug security: at 85 SOL, liquidity auto-migrates to Raydium and LP tokens are burned.'
              )}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-800 space-y-2">
            <label htmlFor="klt-mint-input" className="block text-[11px] font-medium text-slate-400">
              {t('Adresse Mint SPL $KLT (Solscan)', '$KLT SPL Mint Address (Solscan)')}
            </label>
            <div className="flex items-center gap-2">
              <input
                id="klt-mint-input"
                type="text"
                value={mintDraft}
                onChange={(e) => setMintDraft(e.target.value)}
                className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 font-mono-tabular text-xs text-white focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={() => setKltMintAddress(mintDraft)}
                className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white whitespace-nowrap"
              >
                {t('Sauver', 'Save')}
              </button>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(mintDraft);
                  notify(t('Adresse Mint copiée.', 'Mint address copied.'), 'info');
                }}
                className="p-2 rounded-lg border border-slate-700 text-slate-300 hover:text-white"
                aria-label="Copy Mint"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Solscan Burn Transparency Widget */}
        <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-red-400" />
              <h2 className="text-sm font-semibold text-white">
                {t('Widget Transparence Solscan & Burn', 'Solscan & Burn Transparency Widget')}
              </h2>
            </div>
            <a
              href={`https://solscan.io/token/${encodeURIComponent(kltMintAddress)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-amber-400 hover:text-amber-300 whitespace-nowrap"
            >
              Solscan
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <p className="text-slate-400">{t('Tokens Brûlés (Incinérés)', 'Permanently Burned')}</p>
              <p className="text-lg font-bold text-red-400 font-mono-tabular mt-0.5">30,000,000 $KLT</p>
              <p className="text-[11px] text-slate-500">30.00% {t('de l’offre fixe', 'of fixed supply')}</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <p className="text-slate-400">{t('Offre en Circulation', 'Circulating + Locked')}</p>
              <p className="text-lg font-bold text-white font-mono-tabular mt-0.5">70,000,000 $KLT</p>
              <p className="text-[11px] text-slate-500">LP Lock Raydium · 24 mois</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>{t('Mint Authority Révoquée', 'Mint Authority Revoked')}</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>{t('Freeze Authority Révoquée', 'Freeze Authority Revoked')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Swap & Stake Tabs */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-6">
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 border border-slate-800 rounded-lg mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('swap')}
            className={`inline-flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'swap' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowDownUp className="w-3.5 h-3.5" />
            {t('Swap Raydium / Pump.fun', 'Raydium / Pump.fun Swap')}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('stake')}
            className={`inline-flex items-center justify-center gap-2 py-2.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'stake' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            {t('Staking $KLT (15% APY)', '$KLT Staking (15% APY)')}
          </button>
        </div>

        {activeTab === 'swap' ? (
          <form onSubmit={handleSwap} className="space-y-5">
            <div>
              <label htmlFor="swap-pay" className="block text-xs font-medium text-slate-300 mb-2">
                {t('Vous payez', 'You Pay')}
              </label>
              <div className="flex gap-2">
                <input
                  id="swap-pay"
                  type="number"
                  step="any"
                  min="0"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono-tabular text-base focus:outline-none focus:border-amber-500"
                />
                <select
                  value={payAsset}
                  onChange={(e) => setPayAsset(e.target.value as 'SOL' | 'USDC')}
                  className="px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm font-semibold focus:outline-none focus:border-amber-500"
                >
                  <option value="SOL">SOL</option>
                  <option value="USDC">USDC</option>
                </select>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">{t('Vous recevez estimé', 'Estimated Receive')}</p>
                <p className="text-2xl font-bold text-amber-400 font-mono-tabular mt-1">
                  {estimatedKltOut.toLocaleString('en-US', { maximumFractionDigits: 2 })} $KLT
                </p>
              </div>
              <div className="text-right text-xs text-slate-400 font-mono-tabular">
                <p>1 KLT = ${kltPriceUsd.toFixed(4)}</p>
                <p>Slippage: 0.5%</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={!solanaConnected || numericPay <= 0}
              className="w-full py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm transition-colors disabled:opacity-40"
            >
              {solanaConnected
                ? t('Exécuter le Swap sur Solana', 'Execute Swap on Solana')
                : t('Connectez votre wallet pour swapper', 'Connect wallet to swap')}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
                <p className="text-xs text-slate-400">{t('$KLT Stakés', 'Staked $KLT')}</p>
                <p className="text-xl font-bold text-white font-mono-tabular mt-1">
                  {stakedKlt.toLocaleString('en-US', { maximumFractionDigits: 2 })} KLT
                </p>
              </div>
              <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
                <p className="text-xs text-slate-400">{t('Rendement Annuel', 'Annual Yield')}</p>
                <p className="text-xl font-bold text-emerald-400 font-mono-tabular mt-1">15.00% APY</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs text-slate-400">{t('Récompenses', 'Pending Rewards')}</p>
                  <p className="text-xl font-bold text-amber-400 font-mono-tabular mt-1">
                    {stakingRewardsKlt.toFixed(2)} KLT
                  </p>
                </div>
                <button
                  type="button"
                  onClick={claimStakingRewards}
                  disabled={stakingRewardsKlt <= 0}
                  className="px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold disabled:opacity-40 whitespace-nowrap"
                >
                  {t('Réclamer', 'Claim')}
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="stake-input" className="text-xs font-medium text-slate-300">
                  {t('Montant $KLT à staker / débloquer', 'Amount of $KLT to Stake / Unstake')}
                </label>
                <span className="text-xs text-slate-400 font-mono-tabular">
                  {t('Solde liquide', 'Liquid')}: {totalKltBalance.toLocaleString('en-US', { maximumFractionDigits: 2 })} KLT
                </span>
              </div>
              <input
                id="stake-input"
                type="number"
                step="any"
                min="0"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono-tabular text-base focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => stakeKlt(parseFloat(stakeAmount) || 0)}
                className="inline-flex items-center justify-center gap-2 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm transition-colors"
              >
                <Coins className="w-4 h-4" />
                {t('Staker $KLT (15% APY)', 'Stake $KLT (15% APY)')}
              </button>
              <button
                type="button"
                onClick={() => unstakeKlt(parseFloat(stakeAmount) || 0)}
                className="inline-flex items-center justify-center gap-2 py-3 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-sm transition-colors"
              >
                <CheckCircle2 className="w-4 h-4 text-slate-400" />
                {t('Débloquer (Unstake)', 'Unstake $KLT')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
