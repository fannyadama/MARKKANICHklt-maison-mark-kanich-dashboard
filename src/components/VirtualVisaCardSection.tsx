import React, { useState } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  Eye,
  EyeOff,
  Lock,
  ShieldCheck,
  Snowflake,
  Unlock,
} from 'lucide-react';
import { useKLTStore } from '../context/KLTStoreContext';

export const VirtualVisaCardSection: React.FC = () => {
  const {
    t,
    user,
    kltPriceUsd,
    totalKltBalance,
    hideBalances,
    visaCard,
    toggleVisaCardFreeze,
    depositToVisaCard,
    withdrawFromVisaCard,
    solanaConnected,
    openWalletModal,
    setRoute,
  } = useKLTStore();

  const [showCvv, setShowCvv] = useState(false);
  const [escrowMode, setEscrowMode] = useState<'deposit' | 'withdraw'>('deposit');
  const [escrowInput, setEscrowInput] = useState('500');
  const [showAllTx, setShowAllTx] = useState(false);

  const fiatEquivalent = visaCard.kltEscrowBalance * kltPriceUsd;
  const numericAmount = parseFloat(escrowInput) || 0;
  const estimatedUsd = numericAmount * kltPriceUsd;
  const displayedTx = showAllTx ? visaCard.transactions : visaCard.transactions.slice(0, 4);

  const handleEscrowSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (escrowMode === 'deposit') {
      const ok = depositToVisaCard(numericAmount);
      if (ok) setEscrowInput('');
    } else {
      const ok = withdrawFromVisaCard(numericAmount);
      if (ok) setEscrowInput('');
    }
  };

  return (
    <section
      id="virtual-visa-card"
      className="bg-[#0F172A] border border-slate-800 rounded-xl p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <p className="text-xs font-medium text-amber-400">
            {t('KLT PAY · COFFRE ESCROW ANCHOR', 'KLT PAY · ANCHOR ESCROW VAULT')}
          </p>
          <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
            {t('Carte Visa Virtuelle & Rechargement $KLT', 'Virtual Visa Card & $KLT Escrow Recharge')}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {t(
              'Verrouillez des $KLT dans le coffre escrow Solana pour alimenter votre carte Visa virtuelle en temps réel.',
              'Lock $KLT in the Solana escrow vault to fund your virtual Visa card in real time.'
            )}
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono-tabular">
          <span className={visaCard.isFrozen ? 'text-sky-400 font-semibold' : 'text-emerald-400 font-semibold'}>
            {visaCard.isFrozen ? t('Statut : Gelée', 'Status: Frozen') : t('Statut : Active · Q4 2026', 'Status: Active · Q4 2026')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Column 1: Interactive Virtual Card + Controls */}
        <div className="lg:col-span-5 space-y-4">
          <div
            className={`relative w-full aspect-[1.586/1] rounded-xl p-6 border overflow-hidden transition-all duration-300 flex flex-col justify-between ${
              visaCard.isFrozen
                ? 'bg-slate-900 border-sky-500/40 opacity-85'
                : 'bg-gradient-to-br from-[#131C31] via-[#0B1221] to-[#1A1610] border-amber-500/40'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-serif-luxury text-base font-bold tracking-wide text-amber-400">
                  MAISON MARK KANICH
                </p>
                <p className="text-[11px] text-slate-400 font-mono-tabular mt-0.5">
                  KLT PAY · SOLANA ESCROW
                </p>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-bold tracking-wider text-white">VISA</span>
              </div>
            </div>

            <div className="space-y-2.5 my-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="w-9 h-6 rounded bg-amber-400/20 border border-amber-400/40" />
                {visaCard.isFrozen && (
                  <span className="text-sky-300 font-semibold inline-flex items-center gap-1">
                    <Snowflake className="w-3.5 h-3.5" />
                    {t('Carte Gelée', 'Card Frozen')}
                  </span>
                )}
              </div>
              <p className="font-mono-tabular text-lg sm:text-xl tracking-widest text-white">
                4539 •••• •••• {visaCard.lastFour}
              </p>
            </div>

            <div className="flex items-end justify-between text-xs">
              <div>
                <span className="text-[10px] text-slate-500 block">{t('TITULAIRE', 'CARDHOLDER')}</span>
                <span className="text-slate-100 font-semibold tracking-wide">{user.name.toUpperCase()}</span>
              </div>
              <div className="flex items-center gap-5 font-mono-tabular text-right">
                <div>
                  <span className="text-[10px] text-slate-500 block">EXP</span>
                  <span className="text-slate-200">{visaCard.expiry}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">CVV</span>
                  <span className="text-amber-400 font-semibold">{showCvv ? visaCard.cvv : '•••'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card Controls */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={toggleVisaCardFreeze}
              className={`inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border text-xs font-semibold transition-colors whitespace-nowrap ${
                visaCard.isFrozen
                  ? 'border-sky-500/40 bg-sky-500/15 text-sky-300 hover:bg-sky-500/25'
                  : 'border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800'
              }`}
            >
              {visaCard.isFrozen ? <Unlock className="w-3.5 h-3.5" /> : <Snowflake className="w-3.5 h-3.5" />}
              {visaCard.isFrozen ? t('Dégeler carte', 'Unfreeze Card') : t('Geler carte', 'Freeze Card')}
            </button>

            <button
              type="button"
              onClick={() => setShowCvv((prev) => !prev)}
              className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-colors whitespace-nowrap"
            >
              {showCvv ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5 text-amber-400" />}
              {showCvv ? t('Masquer CVV', 'Hide CVV') : t('Afficher CVV', 'Reveal CVV')}
            </button>
          </div>

          {/* Escrow Balances Summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
              <p className="text-xs text-slate-400">{t('Escrow $KLT Carte', 'Card $KLT Escrow')}</p>
              <p className="text-lg font-bold text-white font-mono-tabular mt-1">
                {hideBalances ? '••••••' : `${visaCard.kltEscrowBalance.toLocaleString('en-US', { maximumFractionDigits: 2 })} KLT`}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
              <p className="text-xs text-slate-400">{t('Pouvoir d’Achat USD', 'USD Spending Limit')}</p>
              <p className="text-lg font-bold text-amber-400 font-mono-tabular mt-1">
                {hideBalances ? '••••' : `$${fiatEquivalent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              </p>
            </div>
          </div>
        </div>

        {/* Column 2: Escrow Recharge/Withdraw Form + Card Transactions */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card Escrow Form */}
          <form onSubmit={handleEscrowSubmit} className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-white">
                  {t('Coffre Escrow Carte (klt_card_escrow)', 'Card Escrow Vault (klt_card_escrow)')}
                </h3>
              </div>

              <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg">
                <button
                  type="button"
                  onClick={() => setEscrowMode('deposit')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                    escrowMode === 'deposit' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t('Recharger ($KLT)', 'Deposit ($KLT)')}
                </button>
                <button
                  type="button"
                  onClick={() => setEscrowMode('withdraw')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                    escrowMode === 'withdraw' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t('Retirer ($KLT)', 'Withdraw ($KLT)')}
                </button>
              </div>
            </div>

            {!solanaConnected ? (
              <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-xs text-slate-300">
                  {t(
                    'Connectez votre portefeuille Phantom ou Solflare pour signer un dépôt ou retrait escrow.',
                    'Connect your Phantom or Solflare wallet to sign an escrow deposit or withdrawal.'
                  )}
                </p>
                <button
                  type="button"
                  onClick={openWalletModal}
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold whitespace-nowrap shrink-0"
                >
                  {t('Connecter Wallet', 'Connect Wallet')}
                </button>
              </div>
            ) : (
              <>
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <label htmlFor="visa-escrow-amount" className="text-slate-300 font-medium">
                      {escrowMode === 'deposit'
                        ? t('Montant $KLT à verrouiller', '$KLT Amount to Lock')
                        : t('Montant $KLT à retirer vers votre wallet', '$KLT Amount to Withdraw to Wallet')}
                    </label>
                    <span className="text-slate-400 font-mono-tabular">
                      {escrowMode === 'deposit'
                        ? `${t('Disponible', 'Available')}: ${totalKltBalance.toLocaleString('en-US', { maximumFractionDigits: 2 })} KLT`
                        : `${t('En escrow', 'In escrow')}: ${visaCard.kltEscrowBalance.toLocaleString('en-US', { maximumFractionDigits: 2 })} KLT`}
                    </span>
                  </div>

                  <div className="relative flex items-center gap-2">
                    <input
                      id="visa-escrow-amount"
                      type="number"
                      min="0"
                      step="any"
                      value={escrowInput}
                      onChange={(e) => setEscrowInput(e.target.value)}
                      placeholder="100.00"
                      className="flex-1 px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono-tabular text-sm focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setEscrowInput(
                          escrowMode === 'deposit'
                            ? String(Math.floor(totalKltBalance))
                            : String(Math.floor(visaCard.kltEscrowBalance))
                        )
                      }
                      className="px-3 py-2.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-amber-400 whitespace-nowrap"
                    >
                      MAX
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 mt-2 font-mono-tabular">
                    <span>
                      {t('Taux temps réel', 'Live rate')}: 1 $KLT = ${kltPriceUsd.toFixed(4)} USD · Min: 100 $KLT
                    </span>
                    <span className="text-emerald-400 font-semibold">
                      ≈ ${estimatedUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    {t('Escrow non-custodial réversible à tout moment', 'Non-custodial escrow withdrawable anytime')}
                  </span>

                  <button
                    type="submit"
                    disabled={numericAmount <= 0 || visaCard.isFrozen}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 text-xs font-semibold transition-colors whitespace-nowrap"
                  >
                    {escrowMode === 'deposit'
                      ? t('Verrouiller & Recharger la Carte', 'Lock & Recharge Card')
                      : t('Retirer vers mon Wallet', 'Withdraw to Wallet')}
                  </button>
                </div>
              </>
            )}
          </form>

          {/* Recent Card Transactions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">
                {t('Opérations Récentes sur la Carte', 'Recent Card Activity')}
              </h3>
              <div className="flex items-center gap-3 text-xs">
                {visaCard.transactions.length > 4 && (
                  <button
                    type="button"
                    onClick={() => setShowAllTx((v) => !v)}
                    className="text-amber-400 hover:underline font-medium whitespace-nowrap"
                  >
                    {showAllTx ? t('Réduire', 'Show less') : t('Tout afficher', 'View all')}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setRoute('solana-trading')}
                  className="text-slate-400 hover:text-white whitespace-nowrap"
                >
                  {t('Staking VIP →', 'VIP Staking →')}
                </button>
              </div>
            </div>

            <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl bg-slate-900/50">
              {displayedTx.map((tx) => {
                const isCredit = tx.amountUsd > 0;
                return (
                  <div key={tx.id} className="px-4 py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                          isCredit
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : 'bg-slate-900 border-slate-700 text-slate-300'
                        }`}
                      >
                        {isCredit ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{tx.merchant}</p>
                        <p className="text-[11px] text-slate-400 font-mono-tabular truncate">
                          {tx.date} · {t(tx.categoryFr, tx.categoryEn)}
                          {tx.txHash ? ` · ${tx.txHash}` : ''}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-bold font-mono-tabular whitespace-nowrap ${
                        isCredit ? 'text-emerald-400' : 'text-white'
                      }`}
                    >
                      {isCredit ? '+' : ''}
                      ${tx.amountUsd.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
