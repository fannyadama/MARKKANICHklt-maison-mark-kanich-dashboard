import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Sparkles, X } from 'lucide-react';
import { useKLTStore } from '../context/KLTStoreContext';
import { BrandMark } from './BrandMark';

export const PenguinOnboarding: React.FC = () => {
  const {
    t,
    onboardingDismissed,
    dismissOnboarding,
    solanaConnected,
    setRoute,
    workspaceMode,
    setWorkspaceMode,
  } = useKLTStore();
  const [step, setStep] = useState(0);

  if (onboardingDismissed) return null;

  const steps = [
    {
      titleFr: '1. Clarifier votre espace : Stipulor SaaS ou $KLT Web3',
      titleEn: '1. Choose your workspace: Stipulor SaaS or $KLT Web3',
      descFr:
        'Basculez entre vos outils SaaS (KIIS CashFlow, ImmoScale AI, facturation Paddle/FCFA) et votre portefeuille Solana $KLT sans surcharge visuelle.',
      descEn:
        'Switch cleanly between your SaaS tools (KIIS CashFlow, ImmoScale AI, Paddle/FCFA billing) and your Solana $KLT wallet.',
      actionLabelFr: workspaceMode === 'stipulor' ? 'Voir les 2 espaces' : 'Tester vue Stipulor SaaS',
      actionLabelEn: workspaceMode === 'stipulor' ? 'Show Unified View' : 'Try Stipulor SaaS View',
      onAction: () => setWorkspaceMode(workspaceMode === 'stipulor' ? 'all' : 'stipulor'),
    },
    {
      titleFr: '2. Connecter Phantom / Solflare & vérifier Solscan',
      titleEn: '2. Connect Phantom / Solflare & verify Solscan',
      descFr:
        'Liez votre wallet Solana en mode opt-in pour suivre vos soldes $KLT, la progression Pump.fun (85 SOL) et le burn certifié de 30M.',
      descEn:
        'Link your Solana wallet in opt-in mode to track $KLT balances, Pump.fun bonding curve (85 SOL), and the certified 30M burn.',
      actionLabelFr: solanaConnected ? 'Ouvrir Hub Solana' : 'Connecter Wallet Solana',
      actionLabelEn: solanaConnected ? 'Open Solana Hub' : 'Connect Solana Wallet',
      onAction: () => setRoute('solana-trading'),
    },
    {
      titleFr: '3. Activer le Staking 15% APY & les Alertes Prix',
      titleEn: '3. Enable 15% APY Staking & Price Alerts',
      descFr:
        'Estimez vos rendements annuels avec le calculateur et définissez vos seuils de prix $KLT pour recevoir des alertes toast en direct.',
      descEn:
        'Estimate your annual yields with the calculator and set custom $KLT price thresholds for real-time toast alerts.',
      actionLabelFr: 'Configurer une alerte prix',
      actionLabelEn: 'Configure Price Alert',
      onAction: () => {
        document.getElementById('price-alerts-config')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      },
    },
    {
      titleFr: '4. Partager votre lien de parrainage officiel',
      titleEn: '4. Share your official referral link',
      descFr:
        'Générez et partagez des invitations vérifiées (sans comptes @test.com) et suivez vos bonus de 250 $KLT par filleul actif.',
      descEn:
        'Generate and share verified partner invites and track your 250 $KLT bonus per active referral.',
      actionLabelFr: 'Ouvrir le module Parrainage',
      actionLabelEn: 'Open Referral Hub',
      onAction: () => setRoute('referral'),
    },
  ];

  const current = steps[step];

  return (
    <section className="bg-[#0B1220] border border-amber-500/30 rounded-xl p-5 sm:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="shrink-0 klt-float-subtle">
            <BrandMark size="lg" />
          </div>
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {t('Guide d’accueil Maison Mark Kanich', 'Maison Mark Kanich Onboarding Guide')}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-tabular">
                {step + 1} / {steps.length}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-semibold text-white">
              {t(current.titleFr, current.titleEn)}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {t(current.descFr, current.descEn)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={current.onAction}
            className="min-h-[40px] inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold transition-colors whitespace-nowrap"
          >
            {t(current.actionLabelFr, current.actionLabelEn)}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {step < steps.length - 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="min-h-[40px] px-3.5 py-2 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs font-medium text-slate-200 whitespace-nowrap"
            >
              {t('Étape suivante', 'Next step')}
            </button>
          ) : (
            <button
              type="button"
              onClick={dismissOnboarding}
              className="min-h-[40px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 text-xs font-semibold whitespace-nowrap"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {t('Terminer', 'Finish')}
            </button>
          )}

          <button
            type="button"
            onClick={dismissOnboarding}
            className="p-2 text-slate-400 hover:text-white rounded-lg"
            aria-label={t('Masquer le guide', 'Dismiss guide')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Step selector dots */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          {steps.map((s, idx) => (
            <button
              key={s.titleFr}
              type="button"
              onClick={() => setStep(idx)}
              className={`px-2.5 py-1 rounded text-[11px] font-mono-tabular transition-colors ${
                step === idx
                  ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              0{idx + 1}
            </button>
          ))}
        </div>
        <span className="text-[11px] text-slate-500">
          {t('Réactivable à tout moment depuis Paramètres', 'Re-open anytime from Settings')}
        </span>
      </div>
    </section>
  );
};
