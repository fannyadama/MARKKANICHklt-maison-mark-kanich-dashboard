import React, { useEffect, useState } from 'react';
import {
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  KeyRound,
  Link2Off,
  ShieldCheck,
  Wallet,
  X,
} from 'lucide-react';
import { useKLTStore } from '../context/KLTStoreContext';
import { SolanaWalletProvider } from '../types/klt';

interface DetectedProviders {
  phantom: boolean;
  solflare: boolean;
}

function detectBrowserProviders(): DetectedProviders {
  if (typeof window === 'undefined') return { phantom: false, solflare: false };
  const w = window as unknown as {
    phantom?: { solana?: { isPhantom?: boolean } };
    solana?: { isPhantom?: boolean };
    solflare?: { isSolflare?: boolean };
  };
  return {
    phantom: Boolean(w.phantom?.solana?.isPhantom || w.solana?.isPhantom),
    solflare: Boolean(w.solflare?.isSolflare || w.solflare),
  };
}

export const ConnectWalletModal: React.FC = () => {
  const {
    t,
    user,
    walletModalOpen,
    closeWalletModal,
    solanaConnected,
    solanaAddress,
    walletProvider,
    connectWalletWithProvider,
    disconnectWallet,
    verifyWalletSignature,
    notify,
  } = useKLTStore();

  const [detected, setDetected] = useState<DetectedProviders>(() => detectBrowserProviders());
  const [selectedNetwork, setSelectedNetwork] = useState<'Solana Mainnet' | 'Solana Devnet'>(
    user.linkedWallet?.network ?? 'Solana Mainnet'
  );
  const [verifySignature, setVerifySignature] = useState<boolean>(true);
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);
  const [customProvider, setCustomProvider] = useState<SolanaWalletProvider>('Phantom');
  const [customAddress, setCustomAddress] = useState<string>('');
  const [connectingProvider, setConnectingProvider] = useState<SolanaWalletProvider | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!walletModalOpen) return;
    setDetected(detectBrowserProviders());
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeWalletModal();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [closeWalletModal, walletModalOpen]);

  if (!walletModalOpen) return null;

  const linked = user.linkedWallet;
  const activeAddress = linked?.address || solanaAddress;

  const handleConnect = async (provider: SolanaWalletProvider) => {
    setConnectingProvider(provider);
    try {
      await connectWalletWithProvider(provider, {
        verifySignature,
        network: selectedNetwork,
      });
    } finally {
      setConnectingProvider(null);
    }
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setConnectingProvider(customProvider);
    try {
      const ok = await connectWalletWithProvider(customProvider, {
        customAddress,
        verifySignature,
        network: selectedNetwork,
      });
      if (ok) {
        setCustomAddress('');
        setShowCustomInput(false);
      }
    } finally {
      setConnectingProvider(null);
    }
  };

  const handleCopyAddress = () => {
    if (!activeAddress) return;
    navigator.clipboard?.writeText(activeAddress);
    setCopied(true);
    notify(t('Adresse Solana copiée.', 'Solana address copied.'), 'info');
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div
      className="no-print fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={closeWalletModal}
      role="dialog"
      aria-modal="true"
      aria-labelledby="connect-wallet-modal-title"
    >
      <div
        className="w-full max-w-lg bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h2 id="connect-wallet-modal-title" className="text-base font-semibold text-white">
                {t('Connecter un Wallet Solana', 'Connect Solana Wallet')}
              </h2>
              <p className="text-xs text-slate-400">
                {t('Liez Phantom ou Solflare à votre profil', 'Link Phantom or Solflare to your profile')} · {user.name}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeWalletModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label={t('Fermer', 'Close')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[82vh] overflow-y-auto">
          {/* Active Profile Connection Summary */}
          {solanaConnected && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs font-semibold text-emerald-300">
                    {t(`Lié au profil : ${walletProvider}`, `Linked to profile: ${walletProvider}`)}
                  </span>
                </div>
                <span className="text-[11px] font-mono-tabular text-slate-300">
                  {linked?.network || 'Solana Mainnet'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2 rounded-lg bg-slate-950/70 border border-slate-800 font-mono-tabular text-xs text-slate-200 truncate">
                  {activeAddress}
                </div>
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="min-h-[34px] inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs text-slate-200 whitespace-nowrap"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? t('Copié', 'Copied') : t('Copier', 'Copy')}
                </button>
                <a
                  href={`https://solscan.io/account/${activeAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[34px] inline-flex items-center justify-center px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs text-amber-400"
                  title="Solscan"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                <span className="inline-flex items-center gap-1.5 text-slate-300">
                  <ShieldCheck
                    className={`w-3.5 h-3.5 ${
                      linked?.signatureVerified ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  />
                  {linked?.signatureVerified
                    ? t('Preuve de propriété signée', 'Ownership signature verified')
                    : t('Signature non encore vérifiée', 'Ownership signature pending')}
                </span>

                <div className="flex items-center gap-2">
                  {!linked?.signatureVerified && (
                    <button
                      type="button"
                      onClick={() => void verifyWalletSignature()}
                      className="px-2.5 py-1 rounded-md border border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 font-medium whitespace-nowrap"
                    >
                      {t('Signer preuve', 'Verify ownership')}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={disconnectWallet}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-red-500/30 text-red-400 hover:bg-red-500/10 font-medium whitespace-nowrap"
                  >
                    <Link2Off className="w-3 h-3" />
                    {t('Dissocier', 'Disconnect')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Network & Signature Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label htmlFor="wallet-network-select" className="block text-slate-400 mb-1.5">
                {t('Réseau Solana cible', 'Target Solana Network')}
              </label>
              <select
                id="wallet-network-select"
                value={selectedNetwork}
                onChange={(e) =>
                  setSelectedNetwork(e.target.value as 'Solana Mainnet' | 'Solana Devnet')
                }
                className="w-full min-h-[38px] px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Solana Mainnet">Solana Mainnet</option>
                <option value="Solana Devnet">Solana Devnet</option>
              </select>
            </div>

            <div className="flex items-end">
              <label className="w-full min-h-[38px] px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between gap-2 cursor-pointer">
                <span className="text-slate-300">
                  {t('Vérifier signature profil', 'Sign ownership proof')}
                </span>
                <input
                  type="checkbox"
                  checked={verifySignature}
                  onChange={(e) => setVerifySignature(e.target.checked)}
                  className="accent-amber-500 w-4 h-4"
                />
              </label>
            </div>
          </div>

          {/* Provider Cards: Phantom & Solflare */}
          <div className="space-y-2.5">
            <p className="text-xs font-medium text-slate-300">
              {t('Choisissez votre fournisseur Solana', 'Select your Solana wallet provider')}
            </p>

            {/* Phantom */}
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/70 hover:border-amber-500/40 transition-colors flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">Phantom</span>
                  <span
                    className={`text-[11px] font-medium ${
                      detected.phantom ? 'text-emerald-400' : 'text-slate-400'
                    }`}
                  >
                    {detected.phantom
                      ? t('Extension détectée', 'Extension detected')
                      : t('Mode session / navigateur', 'Browser / Session ready')}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {t(
                    'Signature SPL, staking 15% APY et swaps Raydium',
                    'SPL signing, 15% APY staking & Raydium swaps'
                  )}
                </p>
              </div>

              <button
                type="button"
                disabled={connectingProvider !== null}
                onClick={() => void handleConnect('Phantom')}
                className={`min-h-[38px] px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  solanaConnected && walletProvider === 'Phantom'
                    ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                }`}
              >
                {connectingProvider === 'Phantom'
                  ? t('Connexion...', 'Connecting...')
                  : solanaConnected && walletProvider === 'Phantom'
                  ? t('Reconnecter', 'Reconnect')
                  : t('Connecter', 'Connect')}
              </button>
            </div>

            {/* Solflare */}
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/70 hover:border-amber-500/40 transition-colors flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">Solflare</span>
                  <span
                    className={`text-[11px] font-medium ${
                      detected.solflare ? 'text-emerald-400' : 'text-slate-400'
                    }`}
                  >
                    {detected.solflare
                      ? t('Extension détectée', 'Extension detected')
                      : t('Mode session / navigateur', 'Browser / Session ready')}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {t(
                    'Compatible Ledger, coffres Solana et gouvernance DAO',
                    'Ledger-ready, Solana vaults & DAO governance'
                  )}
                </p>
              </div>

              <button
                type="button"
                disabled={connectingProvider !== null}
                onClick={() => void handleConnect('Solflare')}
                className={`min-h-[38px] px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  solanaConnected && walletProvider === 'Solflare'
                    ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                }`}
              >
                {connectingProvider === 'Solflare'
                  ? t('Connexion...', 'Connecting...')
                  : solanaConnected && walletProvider === 'Solflare'
                  ? t('Reconnecter', 'Reconnect')
                  : t('Connecter', 'Connect')}
              </button>
            </div>
          </div>

          {/* Optional Manual Address Binding */}
          <div className="pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setShowCustomInput((v) => !v)}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium inline-flex items-center gap-1.5"
            >
              <KeyRound className="w-3.5 h-3.5" />
              {showCustomInput
                ? t('Masquer la saisie d’adresse manuelle', 'Hide manual address linking')
                : t('Lier une adresse publique Solana spécifique', 'Link a specific Solana public key')}
            </button>

            {showCustomInput && (
              <form onSubmit={handleCustomSubmit} className="mt-3 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <select
                    value={customProvider}
                    onChange={(e) => setCustomProvider(e.target.value as SolanaWalletProvider)}
                    aria-label={t('Fournisseur', 'Provider')}
                    className="min-h-[40px] px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Phantom">Phantom</option>
                    <option value="Solflare">Solflare</option>
                  </select>
                  <input
                    type="text"
                    value={customAddress}
                    onChange={(e) => setCustomAddress(e.target.value)}
                    placeholder={t('Adresse Base58 Solana...', 'Solana Base58 address...')}
                    className="sm:col-span-2 min-h-[40px] px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 font-mono-tabular text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!customAddress.trim() || connectingProvider !== null}
                    className="min-h-[36px] px-4 py-1.5 rounded-lg border border-amber-500/40 bg-amber-500/15 hover:bg-amber-500/25 disabled:opacity-40 text-xs font-semibold text-amber-300 whitespace-nowrap"
                  >
                    {t('Valider et lier l’adresse', 'Validate & Link Address')}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Non-custodial Security Notice */}
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              {t(
                'Connexion non-custodiale : Maison Mark Kanich n’accède jamais à votre phrase secrète ni à vos clés privées. Chaque signature on-chain requiert votre approbation explicite.',
                'Non-custodial connection: Maison Mark Kanich never accesses your seed phrase or private keys. Every on-chain interaction requires your explicit approval.'
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
