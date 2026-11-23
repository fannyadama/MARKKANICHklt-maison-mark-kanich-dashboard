import React, { useState } from 'react';
import { ArrowDownUp, CheckCircle2, Coins, Lock, Wallet } from 'lucide-react';
import { useKLTStore } from '../context/KLTStoreContext';

export const SolanaHubView: React.FC = () => {
  const {
    t,
    assets,
    kltPriceUsd,
    totalKltBalance,
    stakedKlt,
    stakingRewardsKlt,
    solanaConnected,
    solanaAddress,
    toggleSolanaConnection,
    swapTokens,
    stakeKlt,
    unstakeKlt,
    claimStakingRewards,
  } = useKLTStore();

  const [activeTab, setActiveTab] = useState<'swap' | 'stake'>('swap');
  const [payAsset, setPayAsset] = useState<'SOL' | 'USDC'>('SOL');
  const [payAmount, setPayAmount] = useState('2.5');
  const [stakeAmount, setStakeAmount] = useState('5000');

  const solPrice = assets.find((a) => a.symbol === 'SOL')?.priceUsd || 198.4;
  const numericPay = parseFloat(payAmount) || 0;
  const estimatedKltOut = ((payAsset === 'SOL' ? numericPay * solPrice : numericPay) / kltPriceUsd);

  const handleSwap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!solanaConnected) return;
    swapTokens(payAsset, numericPay);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {t('Solana Trading Hub · Pump.fun & Raydium', 'Solana Trading Hub · Pump.fun & Raydium')}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {t('Échangez instantanément sur la bonding curve ou stakez vos $KLT jusqu’à 15% APY.', 'Swap directly on the bonding curve or stake $KLT up to 15% APY.')}
          </p>
        </div>

        <button
          type="button"
          onClick={toggleSolanaConnection}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold border transition-colors whitespace-nowrap ${
            solanaConnected
              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
              : 'border-amber-500 bg-amber-500 text-slate-950 hover:bg-amber-400'
          }`}
        >
          <Wallet className="w-4 h-4" />
          {solanaConnected
            ? `${solanaAddress.slice(0, 6)}...${solanaAddress.slice(-4)}`
            : t('Connecter Phantom / Solflare', 'Connect Phantom / Solflare')}
        </button>
      </div>

      {/* Bonding Curve Status Strip */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <span className="text-xs font-semibold text-white">
            {t('Progression Bonding Curve Pump.fun → Migration Raydium', 'Pump.fun Bonding Curve → Raydium Migration')}
          </span>
          <span className="text-xs font-mono-tabular text-amber-400 font-semibold">
            82.4 / 85.0 SOL (96.9%)
          </span>
        </div>
        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-amber-500 rounded-full" style={{ width: '96.9%' }} />
        </div>
        <p className="text-xs text-slate-400 mt-2">
          {t(
            'Sécurité Anti-Rug Pull native : à 85 SOL, la liquidité migre automatiquement sur Raydium et les tokens LP sont brûlés.',
            'Native Anti-Rug security: at 85 SOL, liquidity auto-migrates to Raydium and LP tokens are burned.'
          )}
        </p>
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
