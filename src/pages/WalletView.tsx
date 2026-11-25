import React, { useState } from 'react';
import { Check, Copy, Eye, EyeOff, Plus, Star, Trash2, Wallet } from 'lucide-react';
import { useKLTStore } from '../context/KLTStoreContext';
import { FX_RATES } from '../data/kltSeedData';
import { VirtualVisaCardSection } from '../components/VirtualVisaCardSection';

export const WalletView: React.FC = () => {
  const {
    t,
    wallets,
    totalKltBalance,
    stakedKlt,
    kltPriceUsd,
    hideBalances,
    toggleHideBalances,
    createWallet,
    setDefaultWallet,
    deleteWallet,
    notify,
    solanaConnected,
    walletProvider,
    openWalletModal,
  } = useKLTStore();

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [newLabel, setNewLabel] = useState('');
  const [newNetwork, setNewNetwork] = useState<'Solana Mainnet' | 'Solana Devnet'>('Solana Mainnet');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const defaultWallet = wallets.find((w) => w.isDefault) || wallets[0];
  const totalUsd = totalKltBalance * kltPriceUsd;
  const totalEur = totalUsd * FX_RATES.EUR;
  const totalXof = totalUsd * FX_RATES.XOF;

  const copyAddress = (id: string, addr: string) => {
    navigator.clipboard?.writeText(addr);
    setCopiedId(id);
    notify(t('Adresse Solana copiée.', 'Solana address copied.'), 'info');
    window.setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createWallet(newLabel, newNetwork);
    setNewLabel('');
    setShowCreateForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {t('Portefeuille $KLT & Coffres Solana', '$KLT Wallet & Decentralized Vaults')}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {t('Gestion multi-portefeuilles SPL, carte virtuelle Visa KLT et récompenses.', 'SPL multi-wallet management, KLT virtual Visa card, and rewards.')}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={toggleHideBalances}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-700 bg-slate-900 text-xs font-medium text-slate-200 hover:bg-slate-800 whitespace-nowrap"
          >
            {hideBalances ? <Eye className="w-4 h-4 text-amber-400" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
            {hideBalances ? t('Afficher', 'Show') : t('Masquer', 'Hide')}
          </button>
          <button
            type="button"
            onClick={openWalletModal}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border text-xs font-semibold transition-colors whitespace-nowrap ${
              solanaConnected
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                : 'border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
            }`}
          >
            <Wallet className="w-4 h-4" />
            {solanaConnected
              ? `${walletProvider} ${t('Lié', 'Linked')}`
              : t('Connecter Wallet', 'Connect Wallet')}
          </button>
          <button
            type="button"
            onClick={() => setShowCreateForm((v) => !v)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            {t('Nouveau portefeuille', 'New Wallet')}
          </button>
        </div>
      </div>

      {/* Main Wallet Summary */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-6 flex flex-col justify-between space-y-6">
        <div>
          <p className="text-xs font-medium text-slate-400">
            {t('Solde Cumulé Disponible', 'Combined Available Balance')}
          </p>
          <p className="text-3xl sm:text-4xl font-bold text-white font-mono-tabular mt-2">
            {hideBalances ? '•••••• KLT' : `${totalKltBalance.toLocaleString('en-US', { maximumFractionDigits: 4 })} KLT`}
          </p>
          <p className="text-sm text-amber-400 font-mono-tabular mt-1">
            {hideBalances
              ? '••••••'
              : `≈ $${totalUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD · €${totalEur.toLocaleString('en-US', { maximumFractionDigits: 2 })} · ${Math.round(totalXof).toLocaleString('fr-FR')} FCFA`}
          </p>
        </div>

        {defaultWallet && (
          <div className="space-y-2">
            <p className="text-xs text-slate-400">
              {t('Adresse Solana Principale', 'Default Solana Address')} ({defaultWallet.network})
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono-tabular text-xs text-slate-300 truncate">
                {defaultWallet.walletAddress}
              </div>
              <button
                type="button"
                onClick={() => copyAddress(defaultWallet.id, defaultWallet.walletAddress)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs font-medium text-slate-200 whitespace-nowrap"
              >
                {copiedId === defaultWallet.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedId === defaultWallet.id ? t('Copié', 'Copied') : t('Copier', 'Copy')}
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs">
          <div>
            <p className="text-slate-400">{t('$KLT Staké', 'Staked $KLT')}</p>
            <p className="text-base font-bold text-white font-mono-tabular mt-1">
              {hideBalances ? '••••' : `${stakedKlt.toLocaleString()} KLT`}
            </p>
          </div>
          <div>
            <p className="text-slate-400">{t('Bonus Parrainage', 'Referral Tier')}</p>
            <p className="text-base font-bold text-emerald-400 font-mono-tabular mt-1">+1,250 KLT</p>
          </div>
          <div>
            <p className="text-slate-400">{t('Points Fidélité', 'Loyalty Points')}</p>
            <p className="text-base font-bold text-amber-400 font-mono-tabular mt-1">
              {Math.floor(totalKltBalance).toLocaleString()} pts
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Virtual Visa Card & $KLT Anchor Escrow Recharge */}
      <VirtualVisaCardSection />

      {/* Create Wallet Form */}
      {showCreateForm && (
        <form onSubmit={handleCreate} className="bg-[#0F172A] border border-amber-500/30 rounded-xl p-5 flex flex-col sm:flex-row items-end gap-4">
          <div className="flex-1 w-full">
            <label htmlFor="wallet-label" className="block text-xs text-slate-400 mb-1.5">
              {t('Nom du portefeuille', 'Wallet Label')}
            </label>
            <input
              id="wallet-label"
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder={t('Ex: Trésorerie Beldozac', 'e.g. Beldozac Treasury')}
              className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
              required
            />
          </div>
          <div className="w-full sm:w-48">
            <label htmlFor="wallet-network" className="block text-xs text-slate-400 mb-1.5">
              {t('Réseau', 'Network')}
            </label>
            <select
              id="wallet-network"
              value={newNetwork}
              onChange={(e) => setNewNetwork(e.target.value as 'Solana Mainnet' | 'Solana Devnet')}
              className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
            >
              <option value="Solana Mainnet">Solana Mainnet</option>
              <option value="Solana Devnet">Solana Devnet</option>
            </select>
          </div>
          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm whitespace-nowrap"
          >
            {t('Générer', 'Generate')}
          </button>
        </form>
      )}

      {/* Decentralized Wallets List */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
        <h2 className="text-base font-semibold text-white mb-4">
          {t('Portefeuilles Blockchain Enregistrés', 'Registered Blockchain Wallets')} ({wallets.length})
        </h2>

        <div className="divide-y divide-slate-800">
          {wallets.map((w) => (
            <div key={w.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-amber-400 shrink-0">
                  <Wallet className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-white truncate">{w.label}</p>
                    {w.isDefault && (
                      <span className="text-[11px] font-medium text-amber-400">
                        · {t('Principal', 'Default')}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 font-mono-tabular truncate mt-0.5">
                    {w.walletAddress} · {w.network}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-4 shrink-0">
                <div className="text-right font-mono-tabular">
                  <p className="text-sm font-bold text-white">
                    {hideBalances ? '••••' : `${w.kltBalance.toLocaleString()} KLT`}
                  </p>
                  <p className="text-xs text-slate-400">{w.solBalance.toFixed(2)} SOL</p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => copyAddress(w.id, w.walletAddress)}
                    className="p-2 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
                    title={t('Copier l’adresse', 'Copy address')}
                  >
                    {copiedId === w.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  {!w.isDefault && (
                    <button
                      type="button"
                      onClick={() => setDefaultWallet(w.id)}
                      className="p-2 rounded-lg border border-slate-800 text-slate-400 hover:text-amber-400 hover:bg-slate-800"
                      title={t('Définir par défaut', 'Set as default')}
                    >
                      <Star className="w-4 h-4" />
                    </button>
                  )}
                  {wallets.length > 1 && (
                    <button
                      type="button"
                      onClick={() => deleteWallet(w.id)}
                      className="p-2 rounded-lg border border-slate-800 text-slate-400 hover:text-red-400 hover:bg-slate-800"
                      title={t('Supprimer', 'Delete')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
