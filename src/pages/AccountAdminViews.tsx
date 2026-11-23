import React, { useState } from 'react';
import {
  AlertTriangle,
  Check,
  Copy,
  Globe,
  KeyRound,
  Link2Off,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Terminal,
  Trash2,
  Wallet,
} from 'lucide-react';
import { useKLTStore } from '../context/KLTStoreContext';
import { FX_RATES, PSP_COMPARISON_MATRIX, SUBSCRIPTION_PLANS } from '../data/kltSeedData';
import { FiatCurrency } from '../types/klt';

export const SettingsProfileView: React.FC = () => {
  const {
    t,
    user,
    updateUserProfile,
    setUserRole,
    featureWeb3,
    setFeatureWeb3,
    web3ModeEnabled,
    setWeb3ModeEnabled,
    customDomain,
    setCustomDomain,
    reopenOnboarding,
    resetDemoState,
    setRoute,
    solanaConnected,
    solanaAddress,
    walletProvider,
    openWalletModal,
    disconnectWallet,
    verifyWalletSignature,
    showWeb3Wallet,
  } = useKLTStore();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [domainInput, setDomainInput] = useState(customDomain);
  const [showOpenId, setShowOpenId] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name: name.trim() || user.name, email: email.trim() || user.email });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          {t('Paramètres & Profil du Compte', 'Account Profile & Settings')}
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          {t(
            'Identité Maison Mark Kanich, domaine custom Paddle, isolation Web3 et rôle RBAC.',
            'Maison Mark Kanich identity, Paddle custom domain, Web3 opt-in, and RBAC role.'
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSave} className="lg:col-span-2 bg-[#0F172A] border border-slate-800 rounded-xl p-6 space-y-5">
          <h2 className="text-base font-semibold text-white">{t('Informations du Compte', 'Account Information')}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="prof-name" className="block text-xs text-slate-400 mb-1.5">
                {t('Nom complet', 'Full Name')}
              </label>
              <input
                id="prof-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label htmlFor="prof-email" className="block text-xs text-slate-400 mb-1.5">
                Email
              </label>
              <input
                id="prof-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label htmlFor="prof-curr" className="block text-slate-400 mb-1.5">
                {t('Devise d’affichage par défaut', 'Default Display Currency')}
              </label>
              <select
                id="prof-curr"
                value={user.preferredCurrency}
                onChange={(e) => updateUserProfile({ preferredCurrency: e.target.value as FiatCurrency })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-500"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="XOF">XOF (FCFA)</option>
              </select>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-slate-400">{t('Méthode & OpenID (masqué)', 'Auth & OpenID (masked)')}</p>
                <button
                  type="button"
                  onClick={() => setShowOpenId((v) => !v)}
                  className="text-amber-400 hover:text-amber-300 text-[11px]"
                >
                  {showOpenId ? t('Masquer', 'Hide') : t('Révéler', 'Reveal')}
                </button>
              </div>
              <div className="px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono-tabular text-slate-300 truncate">
                {user.loginMethod} · {showOpenId ? user.openId : '••••••••••••••••••••'}
              </div>
            </div>
          </div>

          {/* Domain & Web3 Controls */}
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <div>
              <label htmlFor="custom-domain-prof" className="block text-xs text-slate-400 mb-1.5">
                {t('Domaine Custom Production (Validation Paddle)', 'Production Custom Domain (Paddle)')}
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="custom-domain-prof"
                  type="text"
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 font-mono-tabular text-xs text-white focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={() => setCustomDomain(domainInput)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white whitespace-nowrap"
                >
                  <Globe className="w-3.5 h-3.5 text-amber-400" />
                  {t('Appliquer', 'Apply')}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <button
                type="button"
                onClick={() => setWeb3ModeEnabled(!web3ModeEnabled)}
                className="p-3 rounded-lg border border-slate-800 bg-slate-900/70 hover:border-amber-500/40 flex items-center justify-between text-left"
              >
                <div>
                  <p className="font-semibold text-white">{t('Opt-In Wallet Web3 ($KLT)', 'Web3 Wallet Opt-In ($KLT)')}</p>
                  <p className="text-[11px] text-slate-400">{t('Phantom, Solflare & Staking', 'Phantom, Solflare & Staking')}</p>
                </div>
                <span className={web3ModeEnabled ? 'text-emerald-400 font-semibold' : 'text-slate-400'}>
                  {web3ModeEnabled ? 'ON' : 'OFF'}
                </span>
              </button>

              {user.role === 'admin' && (
                <button
                  type="button"
                  onClick={() => setFeatureWeb3(!featureWeb3)}
                  className="p-3 rounded-lg border border-slate-800 bg-slate-900/70 hover:border-amber-500/40 flex items-center justify-between text-left"
                >
                  <div>
                    <p className="font-semibold text-white">FEATURE_WEB3 (Kill-Switch)</p>
                    <p className="text-[11px] text-slate-400">{t('Flag global Stipulor vs KLT', 'Global Stipulor vs KLT flag')}</p>
                  </div>
                  <span className={featureWeb3 ? 'text-emerald-400 font-semibold' : 'text-red-400 font-semibold'}>
                    {featureWeb3 ? 'ON' : 'OFF'}
                  </span>
                </button>
              )}
            </div>

            {/* Profile-Linked Phantom / Solflare Wallet */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-amber-400" />
                  <span className="font-semibold text-white">
                    {t('Wallet Solana Lié au Profil', 'Profile-Linked Solana Wallet')}
                  </span>
                </div>
                {solanaConnected ? (
                  <span className="text-emerald-400 font-medium">
                    {walletProvider} · {user.linkedWallet?.signatureVerified ? t('Signature vérifiée', 'Signature verified') : t('Connecté', 'Connected')}
                  </span>
                ) : (
                  <span className="text-slate-400">{t('Aucun wallet lié', 'No wallet linked')}</span>
                )}
              </div>

              {solanaConnected ? (
                <div className="space-y-2.5">
                  <p className="font-mono-tabular text-slate-300 break-all bg-slate-950/70 border border-slate-800 rounded-lg px-3 py-2">
                    {user.linkedWallet?.address || solanaAddress}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={openWalletModal}
                      disabled={!showWeb3Wallet}
                      className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:border-amber-500 text-slate-200 font-medium disabled:opacity-40 whitespace-nowrap"
                    >
                      {t('Changer / Gérer Wallet', 'Switch / Manage Wallet')}
                    </button>
                    {!user.linkedWallet?.signatureVerified && (
                      <button
                        type="button"
                        onClick={() => void verifyWalletSignature()}
                        className="px-3 py-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 font-medium whitespace-nowrap"
                      >
                        {t('Signer preuve de propriété', 'Sign ownership proof')}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={disconnectWallet}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 font-medium whitespace-nowrap"
                    >
                      <Link2Off className="w-3.5 h-3.5" />
                      {t('Dissocier', 'Unlink')}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-slate-400">
                    {t(
                      'Connectez Phantom ou Solflare pour signer vos transactions SPL, staking et DAO.',
                      'Connect Phantom or Solflare to authorize SPL swaps, staking, and DAO votes.'
                    )}
                  </p>
                  <button
                    type="button"
                    onClick={openWalletModal}
                    disabled={!showWeb3Wallet}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-semibold whitespace-nowrap"
                  >
                    <Wallet className="w-3.5 h-3.5" />
                    {t('Connecter Wallet', 'Connect Wallet')}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold transition-colors"
            >
              {t('Enregistrer les modifications', 'Save Changes')}
            </button>
          </div>
        </form>

        {/* Role & Security Links */}
        <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-6 space-y-5">
          <div>
            <h2 className="text-base font-semibold text-white">{t('Rôle & Accès RBAC', 'Role & RBAC Access')}</h2>
            <p className="text-xs text-slate-400 mt-1">
              {t('Basculez entre Administrateur (Devnet Ops & FAQ Admin) et Trader.', 'Switch between Administrator and Standard Trader views.')}
            </p>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 border border-slate-800 rounded-lg mt-3">
              <button
                type="button"
                onClick={() => setUserRole('admin')}
                className={`py-2 text-xs font-semibold rounded-md transition-colors ${
                  user.role === 'admin' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => setUserRole('user')}
                className={`py-2 text-xs font-semibold rounded-md transition-colors ${
                  user.role === 'user' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                Trader
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-2">
            <button
              type="button"
              onClick={() => setRoute('2fa')}
              className="w-full text-left px-3 py-2 rounded-lg border border-slate-800 hover:bg-slate-900 text-xs text-slate-200 flex items-center justify-between"
            >
              <span>{t('Double Authentification (2FA)', 'Two-Factor Auth (2FA)')}</span>
              <span className={user.twoFactorEnabled ? 'text-emerald-400' : 'text-amber-400'}>
                {user.twoFactorEnabled ? 'ON' : 'OFF'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setRoute('login-history')}
              className="w-full text-left px-3 py-2 rounded-lg border border-slate-800 hover:bg-slate-900 text-xs text-slate-200"
            >
              {t('Historique des connexions →', 'Login History →')}
            </button>
            <button
              type="button"
              onClick={() => {
                reopenOnboarding();
                setRoute('dashboard');
              }}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-amber-500/30 text-amber-300 hover:bg-amber-500/10 text-xs font-medium"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {t('Relancer l’onboarding Pingouin', 'Relaunch Penguin Onboarding')}
            </button>
            <button
              type="button"
              onClick={resetDemoState}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-medium mt-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {t('Réinitialiser les données démo', 'Reset Demo State')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SecurityAuthView: React.FC<{ initialTab?: '2fa' | 'sessions' }> = ({ initialTab = '2fa' }) => {
  const { t, user, updateUserProfile, loginSessions, revokeLoginSession, revokeAllOtherSessions, notify } =
    useKLTStore();
  const [tab, setTab] = useState<'2fa' | 'sessions'>(initialTab);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const backupCodes = ['KLT-8492-AX', 'KLT-3910-QM', 'KLT-7721-ZR', 'KLT-5504-BN'];

  const copyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    notify(t('Code de secours copié.', 'Backup code copied.'), 'info');
    window.setTimeout(() => setCopiedCode(null), 1800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {t('Sécurité 2FA & Sessions de Connexion', '2FA Security & Login Sessions')}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {t('Protection TOTP, codes de récupération et audit des appareils connectés.', 'TOTP protection, backup recovery codes, and connected device audit.')}
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
          <button
            type="button"
            onClick={() => setTab('2fa')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md ${
              tab === '2fa' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t('Authentification 2FA', '2FA Settings')}
          </button>
          <button
            type="button"
            onClick={() => setTab('sessions')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md ${
              tab === 'sessions' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t('Historique Connexions', 'Login History')}
          </button>
        </div>
      </div>

      {tab === '2fa' ? (
        <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <KeyRound className="w-6 h-6 text-amber-400" />
              <div>
                <h2 className="text-base font-semibold text-white">
                  {t('Authentification à Deux Facteurs (TOTP)', 'Two-Factor Authentication (TOTP)')}
                </h2>
                <p className="text-xs text-slate-400">
                  {user.twoFactorEnabled
                    ? t('Actif · Votre compte administrateur est protégé par 2FA.', 'Active · Your account is protected by 2FA.')
                    : t('Inactif · Activez le 2FA pour sécuriser vos retraits.', 'Inactive · Enable 2FA to protect withdrawals.')}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => updateUserProfile({ twoFactorEnabled: !user.twoFactorEnabled })}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                user.twoFactorEnabled
                  ? 'border border-red-500/40 text-red-400 hover:bg-red-500/10'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {user.twoFactorEnabled ? t('Désactiver 2FA', 'Disable 2FA') : t('Activer 2FA', 'Enable 2FA')}
            </button>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-medium text-slate-300">
              {t('Codes de secours hors-ligne (cliquez pour copier)', 'Offline Backup Codes (click to copy)')}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {backupCodes.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => copyCode(c)}
                  className="p-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/40 font-mono-tabular text-xs text-white flex items-center justify-between"
                >
                  <span>{c}</span>
                  {copiedCode === c ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">
              {t('Appareils & Connexions Récentes', 'Recent Logins & Devices')}
            </h2>
            <button
              type="button"
              onClick={revokeAllOtherSessions}
              className="px-3 py-1.5 rounded-lg border border-red-500/40 text-red-400 hover:bg-red-500/10 text-xs font-medium"
            >
              {t('Révoquer autres sessions', 'Revoke Other Sessions')}
            </button>
          </div>

          <div className="divide-y divide-slate-800">
            {loginSessions.map((s) => (
              <div key={s.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{s.device}</span>
                    {s.isCurrent && <span className="text-xs text-emerald-400 font-medium">· Session actuelle</span>}
                    {s.isSuspicious && (
                      <span className="inline-flex items-center gap-1 text-xs text-red-400 font-medium">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Suspecte
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 font-mono-tabular mt-0.5">
                    {s.location} · IP {s.ip} · {s.method} · {s.timestamp}
                  </p>
                </div>

                {!s.isCurrent && (
                  <button
                    type="button"
                    onClick={() => revokeLoginSession(s.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-300 hover:text-red-400 hover:border-red-500/40 self-start sm:self-center"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {t('Révoquer', 'Revoke')}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const DevnetOpsView: React.FC = () => {
  const { t, user, devnet, requestDevnetAirdrop, runDevnetQuoteOrSwap, notify, setRoute } = useKLTStore();
  const [amountRaw, setAmountRaw] = useState('30000000000000');

  if (user.role !== 'admin') {
    return (
      <div className="max-w-2xl mx-auto bg-[#0F172A] border border-red-500/30 rounded-xl p-6 text-center space-y-4">
        <ShieldCheck className="w-10 h-10 text-red-400 mx-auto" />
        <h2 className="text-lg font-semibold text-white">
          {t('Accès réservé aux Administrateurs', 'Administrator Access Required')}
        </h2>
        <p className="text-sm text-slate-400">
          {t(
            'Activez le rôle Administrateur dans les Paramètres pour accéder au contrôle du payer Solana Devnet.',
            'Switch to Administrator role in Settings to access Solana Devnet payer controls.'
          )}
        </p>
        <button
          type="button"
          onClick={() => setRoute('settings')}
          className="px-4 py-2 rounded-lg bg-amber-500 text-slate-950 text-xs font-semibold"
        >
          {t('Aller aux Paramètres', 'Go to Settings')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-mono-tabular text-emerald-400">KLT / DEVNET OPS</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            {t('Contrôle du Payer Solana & Pool Raydium', 'Solana Payer Control & Raydium Pool')}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {t('Interface administrateur · Environnement Solana Devnet.', 'Administrator console · Solana Devnet environment.')}
          </p>
        </div>

        <button
          type="button"
          onClick={requestDevnetAirdrop}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold whitespace-nowrap"
        >
          <Terminal className="w-4 h-4" />
          {t('Faucet Airdrop +1 SOL', 'Faucet Airdrop +1 SOL')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5 space-y-3">
          <h2 className="text-sm font-semibold text-white">{t('Portefeuille Payer Devnet', 'Devnet Payer Wallet')}</h2>
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between gap-2">
            <span className="font-mono-tabular text-xs text-slate-300 truncate">{devnet.payerAddress}</span>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(devnet.payerAddress);
                notify(t('Adresse payer copiée.', 'Payer address copied.'), 'info');
              }}
              className="p-1.5 text-slate-400 hover:text-white"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-2xl font-bold text-emerald-400 font-mono-tabular">
            {devnet.payerSolBalance.toFixed(4)} SOL
          </p>
        </div>

        <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5 space-y-3 text-xs">
          <h2 className="text-sm font-semibold text-white">{t('Statut Pool Raydium Devnet', 'Raydium Devnet Pool Status')}</h2>
          <p className="text-slate-400 font-mono-tabular truncate">Pool ID: {devnet.poolId}</p>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Reserve A (SOL)</span>
              <p className="font-mono-tabular text-white font-semibold mt-0.5">86.42 SOL</p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400">Reserve B ($KLT)</span>
              <p className="font-mono-tabular text-amber-400 font-semibold mt-0.5">30,000,000 KLT</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-6 space-y-4">
        <h2 className="text-base font-semibold text-white">
          {t('Simulation Quote & Exécution Swap Raydium', 'Raydium Quote Simulation & Swap Execution')}
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={amountRaw}
            onChange={(e) => setAmountRaw(e.target.value)}
            className="flex-1 px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 font-mono-tabular text-xs text-white focus:outline-none focus:border-amber-500"
            placeholder="Base units (ex: 30000000000000)"
          />
          <button
            type="button"
            onClick={() => runDevnetQuoteOrSwap(devnet.mintA, amountRaw, false)}
            className="px-4 py-2.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-200 whitespace-nowrap"
          >
            {t('Générer Quote (Sans signature)', 'Generate Quote (Dry Run)')}
          </button>
          <button
            type="button"
            onClick={() => runDevnetQuoteOrSwap(devnet.mintA, amountRaw, true)}
            className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white whitespace-nowrap"
          >
            {t('Signer & Soumettre Swap', 'Sign & Submit Swap')}
          </button>
        </div>

        {devnet.lastQuote && (
          <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono-tabular space-y-1">
            <p className="text-slate-400">Timestamp: {devnet.lastQuote.timestamp}</p>
            <p className="text-white">
              Output estimé: <span className="text-amber-400">{devnet.lastQuote.estimatedOutKlt.toLocaleString()} $KLT</span> · Impact: {devnet.lastQuote.priceImpactPct}%
            </p>
            {devnet.lastQuote.txSignature && (
              <p className="text-emerald-400">Tx Signature: {devnet.lastQuote.txSignature}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const SubscriptionCheckoutView: React.FC = () => {
  const { t, language, subscriptionPlan, billingCycle, setSubscription, setRoute, notify } = useKLTStore();
  const [cycle, setCycle] = useState<'monthly' | 'yearly'>(billingCycle);
  const [psp, setPsp] = useState<'paddle' | 'paystack' | 'cinetpay'>('paddle');

  const handleCheckout = (planId: 'free' | 'pro' | 'vip') => {
    setSubscription(planId, cycle);
    if (planId !== 'free') {
      const pspLabel =
        psp === 'paddle'
          ? 'Paddle (USD/EUR)'
          : psp === 'paystack'
          ? 'Paystack (FCFA / Wave / OM / Carte)'
          : 'CinetPay (Wave / Orange Money / MTN)';
      notify(
        t(`Checkout ${pspLabel} initialisé pour le plan ${planId.toUpperCase()}.`, `${pspLabel} checkout initialized.`),
        'success'
      );
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="text-center space-y-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          {t('Formules Stipulor SaaS & Accès Privilège', 'Stipulor SaaS Plans & Privilege Access')}
        </h1>
        <p className="text-sm text-slate-400">
          {t(
            'Paiement international via Paddle ou local en FCFA via Paystack / CinetPay (Wave, Orange Money, MTN MoMo).',
            'International billing via Paddle or local FCFA via Paystack / CinetPay (Wave, Orange Money, MTN MoMo).'
          )}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="inline-flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
            <button
              type="button"
              onClick={() => setCycle('monthly')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md ${
                cycle === 'monthly' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('Mensuel', 'Monthly')}
            </button>
            <button
              type="button"
              onClick={() => setCycle('yearly')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md ${
                cycle === 'yearly' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('Annuel (-20%)', 'Yearly (-20%)')}
            </button>
          </div>

          <div className="inline-flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
            {(
              [
                { id: 'paddle', label: 'Paddle (USD)' },
                { id: 'paystack', label: 'Paystack (FCFA/Card)' },
                { id: 'cinetpay', label: 'CinetPay (Wave/OM)' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setPsp(opt.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                  psp === opt.id ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const price = cycle === 'monthly' ? plan.monthlyPriceUsd : plan.yearlyPriceUsd;
          const priceXof = Math.round(price * FX_RATES.XOF);
          const isActive = subscriptionPlan === plan.id && billingCycle === cycle;
          return (
            <div
              key={plan.id}
              className={`bg-[#0F172A] rounded-xl p-6 flex flex-col justify-between border ${
                plan.highlighted ? 'border-amber-500/60' : 'border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white">
                    {language === 'fr' ? plan.name : plan.nameEn}
                  </h2>
                  <span className="text-xs font-mono-tabular text-amber-400 font-semibold">
                    {plan.stakingApyBoost}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {language === 'fr' ? plan.audienceFr : plan.audienceEn}
                </p>

                <p className="text-3xl font-bold text-white font-mono-tabular mt-5">
                  {psp === 'paddle' ? `$${price}` : `${priceXof.toLocaleString('fr-FR')} FCFA`}
                  <span className="text-xs font-normal text-slate-400">
                    /{cycle === 'monthly' ? t('mois', 'mo') : t('an', 'yr')}
                  </span>
                </p>

                <ul className="mt-5 space-y-2.5 text-xs text-slate-300">
                  {(language === 'fr' ? plan.featuresFr : plan.featuresEn).map((feat) => (
                    <li key={feat} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => handleCheckout(plan.id)}
                disabled={isActive}
                className={`mt-6 w-full py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 cursor-default'
                    : plan.highlighted
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                    : 'border border-slate-700 bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                {isActive
                  ? t('Plan Actif', 'Current Plan')
                  : psp === 'paddle'
                  ? t('Payer avec Paddle', 'Checkout with Paddle')
                  : psp === 'paystack'
                  ? t('Payer via Paystack (FCFA)', 'Pay via Paystack (FCFA)')
                  : t('Payer via CinetPay (Wave/OM)', 'Pay via CinetPay (Wave/OM)')}
              </button>
            </div>
          );
        })}
      </div>

      {/* Distinct Refund Policy Notice required for Paddle */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4 text-xs">
        <p className="text-slate-300">
          {t(
            'Conformité Paddle : droit de rétractation de 14 jours disponible sur une page dédiée distincte des CGV.',
            'Paddle compliance: 14-day withdrawal policy hosted on a dedicated standalone page.'
          )}
        </p>
        <button
          type="button"
          onClick={() => setRoute('remboursement')}
          className="px-3.5 py-2 rounded-lg border border-amber-500/40 text-amber-400 hover:bg-amber-500/10 font-semibold whitespace-nowrap"
        >
          {t('Consulter /remboursement →', 'View /remboursement →')}
        </button>
      </div>

      {/* PSP Comparison Table */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5 overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="py-2 pr-4">{t('Critère PSP', 'PSP Criterion')}</th>
              <th className="py-2 pr-4 text-white">Paddle</th>
              <th className="py-2 pr-4 text-amber-400">Paystack</th>
              <th className="py-2 text-emerald-400">CinetPay</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/70">
            {PSP_COMPARISON_MATRIX.map((row) => (
              <tr key={row.criterionEn}>
                <td className="py-2.5 pr-4 font-medium text-slate-300">
                  {language === 'fr' ? row.criterionFr : row.criterionEn}
                </td>
                <td className="py-2.5 pr-4 text-slate-300">{row.paddle}</td>
                <td className="py-2.5 pr-4 text-slate-200">{row.paystack}</td>
                <td className="py-2.5 text-slate-200">{row.cinetpay}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
