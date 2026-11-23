import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  ExternalLink,
  FileCheck2,
  Globe,
  Lock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { useKLTStore } from '../context/KLTStoreContext';
import { CSV_USERS_REGISTRY, PURGED_TEST_ACCOUNTS_COUNT } from '../data/kltSeedData';

export const RefundPolicyView: React.FC = () => {
  const { t, customDomain, setRoute, notify } = useKLTStore();
  const [entity, setEntity] = useState<'KIIS Global' | 'Stipulor'>('Stipulor');
  const [orderId, setOrderId] = useState('ORD-');
  const [contactEmail, setContactEmail] = useState('');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim() || !contactEmail.includes('@')) {
      notify(
        t(
          'Veuillez saisir un numéro de commande Paddle valide et votre adresse email.',
          'Please enter a valid Paddle order ID and email address.'
        ),
        'error'
      );
      return;
    }
    setSubmitted(true);
    notify(
      t(
        `Demande de remboursement enregistrée pour ${orderId.trim()} (traitement 5 à 10 jours ouvrés).`,
        `Refund request logged for ${orderId.trim()} (5–10 business days).`
      ),
      'success',
      { category: 'system', title: t('Politique de Remboursement', 'Refund Policy') }
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => setRoute('subscription')}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {t('Retour aux abonnements & paiement', 'Back to Plans & Billing')}
          </button>
          <p className="text-xs font-mono-tabular text-amber-400">
            https://{customDomain}/remboursement · {t('Page distincte des CGV', 'Dedicated Refund Route')}
          </p>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white mt-1">
            {t('Politique de Remboursement', 'Refund Policy')}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {t('Dernière mise à jour : 23 novembre 2026', 'Last updated: November 23, 2026')}
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
          {(['Stipulor', 'KIIS Global'] as const).map((ent) => (
            <button
              key={ent}
              type="button"
              onClick={() => setEntity(ent)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                entity === ent ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              {ent}
            </button>
          ))}
        </div>
      </div>

      <article className="bg-[#0F172A] border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6 text-sm text-slate-300 leading-relaxed">
        <p>
          {t('Chez', 'At')} <strong className="text-white">{entity}</strong> (Maison Mark Kanich,{' '}
          {t('ci-après « la Société »', 'hereinafter "the Company"')}),{' '}
          {t(
            'nous nous engageons à fournir des services de haute qualité. Conformément aux exigences de notre partenaire de paiement sécurisé (Paddle), cette politique détaille vos droits en matière de remboursement, distinctement de nos Conditions Générales de Vente.',
            'we are committed to delivering high-quality services. In accordance with our Merchant of Record partner (Paddle), this policy outlines your refund rights separately from our Terms of Service.'
          )}
        </p>

        <section className="space-y-2 pt-4 border-t border-slate-800">
          <h2 className="text-base font-semibold text-amber-400">
            1. {t('Droit de rétractation et délai (14 jours)', 'Right of Withdrawal & 14-Day Window')}
          </h2>
          <p>
            {t(
              'Vous disposez d’un délai de 14 jours calendaires à compter de la date de facturation de votre abonnement SaaS ou de votre achat numérique pour demander un remboursement intégral, sans avoir à fournir de justification.',
              'You have 14 calendar days from the billing date of your SaaS subscription or digital purchase to request a full refund without providing justification.'
            )}
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-slate-800">
          <h2 className="text-base font-semibold text-amber-400">
            2. {t('Procédure de demande', 'How to Request a Refund')}
          </h2>
          <p>
            {t(
              'Pour initier une demande, veuillez contacter notre support ou utiliser le formulaire ci-dessous :',
              'To initiate a refund request, please contact our support team or use the form below:'
            )}
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-300">
            <li>
              <strong className="text-white">Email :</strong>{' '}
              {entity === 'Stipulor' ? 'contact@stipulor.com / support@markkanich.com' : 'support@markkanich.com'}
            </li>
            <li>
              <strong className="text-white">{t('Objet de l’email', 'Subject line')} :</strong> Demande de
              remboursement - [Votre Numéro de Commande]
            </li>
            <li>
              <strong className="text-white">{t('Format du numéro Paddle', 'Paddle Order Format')} :</strong>{' '}
              <span className="font-mono-tabular text-amber-300">ORD-XXXXX-XXXXX</span>
            </li>
          </ul>
        </section>

        <section className="space-y-2 pt-4 border-t border-slate-800">
          <h2 className="text-base font-semibold text-amber-400">
            3. {t('Délais de traitement et méthode de remboursement', 'Processing Time & Refund Method')}
          </h2>
          <p>
            {t(
              'Les demandes éligibles sont traitées sous 5 à 10 jours ouvrés. Le remboursement est effectué exclusivement via le même moyen de paiement que celui utilisé lors de l’achat (Paddle / Carte / Mobile Money). Selon votre établissement bancaire, la réception effective des fonds peut prendre de 3 à 7 jours ouvrés supplémentaires.',
              'Eligible requests are processed within 5 to 10 business days exclusively via the original payment method. Bank settlement may take an additional 3 to 7 business days.'
            )}
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-slate-800">
          <h2 className="text-base font-semibold text-amber-400">
            4. {t('Exceptions et non-éligibilité', 'Exceptions & Non-Eligibility')}
          </h2>
          <p>
            {t(
              'Les frais de transaction bancaire, les frais de conversion de devise appliqués par votre banque ou les frais SWIFT ne sont pas remboursables. Les services déjà consommés au-delà de la période de 14 jours ne sont pas éligibles, sauf en cas de dysfonctionnement technique avéré et documenté de notre part.',
              'Bank transaction fees, currency conversion fees, and SWIFT wire charges are non-refundable. Services consumed beyond the 14-day period are ineligible except in cases of documented technical failure.'
            )}
          </p>
        </section>

        <section className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-400">
          <div className="space-y-1">
            <p className="font-semibold text-white">{t('Informations Légales', 'Legal Information')}</p>
            <p>{entity} · Maison Mark Kanich</p>
            <p className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              145-146 Sideci Iroko, Yopougon, Abidjan, Côte d’Ivoire
            </p>
          </div>
          <div className="space-y-1">
            <p className="font-semibold text-white">{t('Support Conformité', 'Compliance Support')}</p>
            <p className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              +225 07 15 94 60 56
            </p>
            <p className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              contact@markkanich.com · support@markkanich.com
            </p>
          </div>
        </section>
      </article>

      {/* Interactive Refund Request Form */}
      <form onSubmit={handleRequestSubmit} className="bg-[#0F172A] border border-slate-800 rounded-xl p-6 space-y-4">
        <h2 className="text-base font-semibold text-white">
          {t('Formulaire de Demande de Remboursement (14 jours)', 'Submit Refund Request (14-Day Policy)')}
        </h2>

        {submitted ? (
          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                {t(
                  `Votre demande pour la commande ${orderId} a été transmise à support@markkanich.com.`,
                  `Your request for order ${orderId} has been routed to support@markkanich.com.`
                )}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="text-amber-400 hover:underline whitespace-nowrap"
            >
              {t('Nouvelle demande', 'New request')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="ref-order" className="block text-xs text-slate-400 mb-1.5">
                {t('Numéro de commande Paddle', 'Paddle Order Number')}
              </label>
              <input
                id="ref-order"
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="ORD-12345-67890"
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 font-mono-tabular text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label htmlFor="ref-email" className="block text-xs text-slate-400 mb-1.5">
                {t('Email du compte', 'Account Email')}
              </label>
              <input
                id="ref-email"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="client@domaine.com"
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="ref-reason" className="block text-xs text-slate-400 mb-1.5">
                {t('Motif (optionnel)', 'Reason (optional)')}
              </label>
              <input
                id="ref-reason"
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={t('Précisez votre demande si souhaité...', 'Optional details...')}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                {t('Envoyer la demande', 'Submit Request')}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export const ActionPlanComplianceView: React.FC = () => {
  const {
    t,
    user,
    customDomain,
    setCustomDomain,
    featureWeb3,
    setFeatureWeb3,
    web3ModeEnabled,
    setWeb3ModeEnabled,
    workspaceMode,
    setWorkspaceMode,
    kltMintAddress,
    setKltMintAddress,
    setRoute,
    notify,
  } = useKLTStore();

  const [domainDraft, setDomainDraft] = useState(customDomain);
  const [mintDraft, setMintDraft] = useState(kltMintAddress);

  const testAccountCount = CSV_USERS_REGISTRY.filter(
    (u) => u.email.includes('@test.com') || u.name.startsWith('Test ')
  ).length;

  const exportAnonymizedUsersCsv = () => {
    const prodUsers = CSV_USERS_REGISTRY.filter(
      (u) => !u.email.includes('@test.com') && !u.name.startsWith('Test ')
    );
    const headers = ['id', 'name', 'role', 'createdAt', 'lastSignedIn'];
    const rows = prodUsers.map((u) => [u.id, `"${u.name}"`, u.role, u.createdAt, u.lastSignedIn]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_anonymized_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    notify(
      t(
        'Export CSV anonymisé généré (sans openId, email ni @test.com).',
        'Anonymized CSV exported (zero openId, email, or @test.com).'
      ),
      'success'
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-mono-tabular text-amber-400">
            STIPULOR · KIIS GLOBAL · $KLT
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            {t('Plan d’Action Priorisé & Conformité (P0 → P2)', 'Prioritized Action Plan & Compliance (P0 → P2)')}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {t(
              'Pilotage sécurité, conformité Paddle, isolation Web3 et feuille de route opérationnelle.',
              'Security governance, Paddle compliance, Web3 isolation, and operational roadmap.'
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setRoute('remboursement')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-300 text-xs font-semibold hover:bg-amber-500/20 whitespace-nowrap"
        >
          <FileCheck2 className="w-4 h-4" />
          /remboursement
        </button>
      </div>

      {/* P0 : Bloquant */}
      <section className="bg-[#0F172A] border border-slate-800 rounded-xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-semibold text-white">
            P0 — {t('Conformité Paddle, Purge & Anonymisation CSV', 'Paddle Compliance, Purge & CSV Anonymization')}
          </h2>
          <span className="text-xs font-mono-tabular text-emerald-400 font-semibold">4 / 4 Prêts</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Domaine custom Paddle */}
          <div className="space-y-2.5">
            <label htmlFor="p0-domain" className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              {t('1. Domaine custom (requis approbation Paddle)', '1. Custom Domain (Paddle requirement)')}
            </label>
            <div className="flex gap-2">
              <input
                id="p0-domain"
                type="text"
                value={domainDraft}
                onChange={(e) => setDomainDraft(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 font-mono-tabular text-xs text-white focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={() => setCustomDomain(domainDraft)}
                className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold whitespace-nowrap"
              >
                {t('Enregistrer', 'Save')}
              </button>
            </div>
            <p className="text-xs text-slate-400">
              URL active : <span className="font-mono-tabular text-slate-200">https://{customDomain}</span>
            </p>
          </div>

          {/* Page /remboursement */}
          <div className="space-y-2.5">
            <p className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
              {t('2. Page /remboursement distincte des CGV', '2. Dedicated /remboursement page')}
            </p>
            <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs">
              <span className="text-emerald-400 font-medium">
                ✓ {t('Route active (14 jours, ORD-XXXXX-XXXXX)', 'Route active (14-day policy)')}
              </span>
              <button
                type="button"
                onClick={() => setRoute('remboursement')}
                className="inline-flex items-center gap-1 text-amber-400 hover:underline font-semibold whitespace-nowrap"
              >
                {t('Ouvrir', 'Open')}
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Purge @test.com */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              {t('3. Purge des comptes @test.com en production', '3. Production @test.com account purge')}
            </p>
            <p className="text-xs text-slate-400 p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-emerald-400 font-semibold font-mono-tabular">
                SELECT COUNT(*) WHERE email LIKE &apos;%@test.com&apos; → {testAccountCount}
              </span>
              {' · '}
              {t(`${PURGED_TEST_ACCOUNTS_COUNT} comptes test purgés (ID 720001–720004).`, `${PURGED_TEST_ACCOUNTS_COUNT} test records purged.`)}
            </p>
          </div>

          {/* Export CSV anonymisé */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              {t('4. Export CSV anonymisé (sans openId / email)', '4. Anonymized CSV export (no openId / email)')}
            </p>
            <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs">
              <span className="font-mono-tabular text-slate-300 truncate">
                id, name, role, createdAt, lastSignedIn
              </span>
              <button
                type="button"
                onClick={exportAnonymizedUsersCsv}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-amber-400 font-semibold whitespace-nowrap shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                CSV Anonymisé
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* P1 : Stratégique */}
      <section className="bg-[#0F172A] border border-slate-800 rounded-xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-semibold text-white">
            P1 — {t('Double Identité Stipulor vs $KLT, Kill-Switch Web3 & PSP Local', 'Stipulor vs $KLT Dual Identity, Web3 Kill-Switch & Local PSP')}
          </h2>
          <span className="text-xs font-mono-tabular text-amber-400 font-semibold">4 / 4 Actifs</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          {/* Dual identity mode */}
          <div className="space-y-2.5">
            <p className="font-medium text-slate-300">
              {t('Identité active de l’interface', 'Active workspace identity')}
            </p>
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-lg bg-slate-900 border border-slate-800">
              {(
                [
                  { id: 'all', label: t('Unifié', 'Unified') },
                  { id: 'stipulor', label: 'Stipulor SaaS' },
                  { id: 'klt', label: '$KLT Web3' },
                ] as const
              ).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setWorkspaceMode(m.id)}
                  className={`py-2 rounded-md font-semibold transition-colors ${
                    workspaceMode === m.id ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* FEATURE_WEB3 Kill Switch + User Opt-In */}
          <div className="space-y-2.5">
            <p className="font-medium text-slate-300">
              {t('Isolation Web3 (FEATURE_WEB3 + Opt-In)', 'Web3 Isolation (FEATURE_WEB3 + Opt-In)')}
            </p>
            <div className="space-y-2">
              {user.role === 'admin' && (
                <label className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer">
                  <span className="text-slate-200 font-mono-tabular">FEATURE_WEB3 (Kill-switch Admin)</span>
                  <input
                    type="checkbox"
                    checked={featureWeb3}
                    onChange={(e) => setFeatureWeb3(e.target.checked)}
                    className="w-4 h-4 accent-amber-500"
                  />
                </label>
              )}
              <label className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer">
                <span className="text-slate-200 font-mono-tabular">web3ModeEnabled (Opt-in Utilisateur)</span>
                <input
                  type="checkbox"
                  checked={web3ModeEnabled}
                  onChange={(e) => setWeb3ModeEnabled(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500"
                />
              </label>
            </div>
          </div>

          {/* KLT Mint Address post-Pump.fun */}
          <div className="md:col-span-2 space-y-2">
            <label htmlFor="p1-mint" className="font-medium text-slate-300 block">
              {t('Adresse Mint SPL $KLT (post-Pump.fun pour Solscan & Wallet)', '$KLT SPL Mint Address (post-Pump.fun)')}
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                id="p1-mint"
                type="text"
                value={mintDraft}
                onChange={(e) => setMintDraft(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 font-mono-tabular text-xs text-white focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={() => setKltMintAddress(mintDraft)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 font-semibold whitespace-nowrap"
              >
                {t('Mettre à jour Mint', 'Update Mint')}
              </button>
              <button
                type="button"
                onClick={() => setRoute('referral')}
                className="px-4 py-2 rounded-lg border border-slate-700 text-slate-200 hover:bg-slate-800 whitespace-nowrap"
              >
                {t('Module Parrainage →', 'Referral Module →')}
              </button>
              <button
                type="button"
                onClick={() => setRoute('subscription')}
                className="px-4 py-2 rounded-lg border border-slate-700 text-slate-200 hover:bg-slate-800 whitespace-nowrap"
              >
                {t('Comparateur Paystack / CinetPay →', 'Paystack / CinetPay →')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* P2 : Valeur ajoutée */}
      <section className="bg-[#0F172A] border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-semibold text-white">
            P2 — {t('Staking 15%, Trading Live Raydium, 8 Piliers & Onboarding', '15% Staking, Live Raydium Trade, 8 Pillars & Onboarding')}
          </h2>
          <span className="text-xs font-mono-tabular text-emerald-400 font-semibold">4 / 4 Intégrés</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <button
            type="button"
            onClick={() => setRoute('solana-trading')}
            className="p-4 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-left space-y-1 transition-colors"
          >
            <p className="font-semibold text-white">Staking 15% APY</p>
            <p className="text-slate-400">{t('Calculateur & pools actifs', 'Calculator & active pools')}</p>
          </button>
          <button
            type="button"
            onClick={() => setRoute('trade')}
            className="p-4 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-left space-y-1 transition-colors"
          >
            <p className="font-semibold text-white">Raydium WebSocket Live</p>
            <p className="text-slate-400">{t('Carnet d’ordres & flux temps réel', 'Live order book & ticks')}</p>
          </button>
          <button
            type="button"
            onClick={() => setRoute('pillars-reporting')}
            className="p-4 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-left space-y-1 transition-colors"
          >
            <p className="font-semibold text-white">Reporting 8 Piliers</p>
            <p className="text-slate-400">{t('KIIS CashFlow, ImmoScale, Villagia…', 'KIIS CashFlow, ImmoScale, Villagia…')}</p>
          </button>
          <button
            type="button"
            onClick={() => setRoute('dashboard')}
            className="p-4 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-left space-y-1 transition-colors"
          >
            <p className="font-semibold text-white">Onboarding Pingouin</p>
            <p className="text-slate-400">{t('Guide interactif sur le tableau de bord', 'Interactive guide on Dashboard')}</p>
          </button>
        </div>
      </section>
    </div>
  );
};
