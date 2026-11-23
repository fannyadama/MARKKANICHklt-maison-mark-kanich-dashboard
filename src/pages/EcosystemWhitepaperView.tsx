import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Check,
  CheckCircle2,
  Compass,
  Copy,
  Crown,
  Droplets,
  ExternalLink,
  FileText,
  Flame,
  Gem,
  Globe,
  Linkedin,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  Shield,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { useKLTStore } from '../context/KLTStoreContext';
import { BrandMark } from '../components/BrandMark';
import { SolscanTracker } from '../components/SolscanTracker';
import {
  ACCESS_TIERS,
  ECOSYSTEM_PILLARS,
  KLT_TOKEN_PILLARS,
  ROADMAP_PHASES,
  SIX_MAISONS,
  TOKENOMICS_ALLOCATION,
} from '../data/kltSeedData';

const CA_STORAGE_KEY = 'klt_custom_contract_address_v1';

interface PresentationViewProps {
  initialSection?: 'klt-token' | 'roadmap';
}

export const PresentationView: React.FC<PresentationViewProps> = ({ initialSection }) => {
  const { t, language, setRoute, notify } = useKLTStore();
  const [contractAddress, setContractAddress] = useState<string>(() => {
    try {
      return window.localStorage.getItem(CA_STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });
  const [copiedCa, setCopiedCa] = useState(false);
  const [activeProof, setActiveProof] = useState<'lp-lock' | 'burn' | 'vesting'>('lp-lock');
  const [activeGateway, setActiveGateway] = useState<
    'raydium' | 'dexscreener' | 'telegram' | 'twitter' | 'linkedin' | null
  >(null);

  const scrollToAnchor = (hashOrId: string) => {
    const cleanId = hashOrId.replace(/^#/, '');
    const el = document.getElementById(cleanId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    if (initialSection) {
      const timer = window.setTimeout(() => {
        scrollToAnchor(initialSection);
      }, 60);
      return () => window.clearTimeout(timer);
    }
  }, [initialSection]);

  const handleContractChange = (val: string) => {
    setContractAddress(val);
    try {
      window.localStorage.setItem(CA_STORAGE_KEY, val);
    } catch {
      // Ignore storage quota errors
    }
  };

  const handleCopyContract = async () => {
    const value = contractAddress.trim();
    if (!value) {
      notify(
        t(
          'Veuillez d’abord coller l’adresse du contrat Solana ($KLT) dans le champ dédié.',
          'Please paste the Solana ($KLT) contract address in the field first.'
        ),
        'warning',
        { category: 'system', title: 'Contract Address (CA)' }
      );
      return;
    }
    try {
      await navigator.clipboard.writeText(value);
      setCopiedCa(true);
      notify(
        t(`Adresse du contrat copiée : ${value}`, `Contract address copied: ${value}`),
        'success',
        { category: 'system', title: 'Contract Address (CA)' }
      );
      window.setTimeout(() => setCopiedCa(false), 2000);
    } catch {
      notify(
        t('Copie manuelle requise depuis le champ CA.', 'Please copy manually from the CA field.'),
        'info'
      );
    }
  };

  const handleProofClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    proof: 'lp-lock' | 'burn' | 'vesting'
  ) => {
    e.preventDefault();
    setActiveProof(proof);
    scrollToAnchor(proof);
  };

  const handleGatewayClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    gateway: 'raydium' | 'dexscreener' | 'telegram' | 'twitter' | 'linkedin'
  ) => {
    e.preventDefault();
    setActiveGateway(gateway);
    const labels: Record<typeof gateway, string> = {
      raydium: 'Raydium (#raydium)',
      dexscreener: 'DexScreener (#dexscreener)',
      telegram: 'Telegram Officiel (#telegram)',
      twitter: 'X / Twitter Officiel (#twitter)',
      linkedin: 'LinkedIn Maison Mark Kanich (#linkedin)',
    };
    scrollToAnchor(gateway === 'linkedin' ? 'acquerir' : gateway);
    notify(
      t(
        `Passerelle ${labels[gateway]} sélectionnée. Prête pour l’URL officielle.`,
        `${labels[gateway]} gateway selected. Ready for official URL.`
      ),
      'info',
      { category: 'system', title: t('Lien Officiel', 'Official Link') }
    );
  };

  const tokenomicsCards = [
    {
      percent: '35%',
      amount: '35M',
      titleFr: 'Liquidité Initiale — verrouillée sur Raydium',
      titleEn: 'Initial Liquidity — locked on Raydium',
      detailFr: '35 000 000 $KLT injectés pour garantir profondeur de marché et stabilité.',
      detailEn: '35,000,000 $KLT injected to guarantee market depth and stability.',
      icon: Droplets,
    },
    {
      percent: '30%',
      amount: '30M',
      titleFr: 'Brûlage Définitif (Burn) — détruits à jamais',
      titleEn: 'Permanent Burn — destroyed forever',
      detailFr: '30 000 000 $KLT retirés irréversiblement de la circulation pour ancrer la rareté.',
      detailEn: '30,000,000 $KLT irreversibly removed from supply to anchor scarcity.',
      icon: Flame,
    },
    {
      percent: '20%',
      amount: '20M',
      titleFr: 'Vesting Équipe — bloqué 24 mois, cliff 6 mois',
      titleEn: 'Team Vesting — locked 24 months, 6-month cliff',
      detailFr: '20 000 000 $KLT libérés progressivement afin d’aligner la Maison sur le long terme.',
      detailEn: '20,000,000 $KLT gradually unlocked to align the House with long-term execution.',
      icon: Lock,
    },
    {
      percent: '15%',
      amount: '15M',
      titleFr: 'Réserve Communauté — airdrops et partenariats',
      titleEn: 'Community Reserve — airdrops and partnerships',
      detailFr: '15 000 000 $KLT dédiés aux détenteurs, récompenses de staking et alliances stratégiques.',
      detailEn: '15,000,000 $KLT dedicated to holders, staking rewards, and strategic alliances.',
      icon: Users,
    },
  ];

  return (
    <div className="space-y-12 overflow-x-hidden">
      {/* Quick Section Sub-Navigation (Single-Line & Mobile Scrollable) */}
      <nav
        aria-label={t('Navigation de la Maison', 'Maison Sections')}
        className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-amber-500/20"
      >
        {[
          { id: 'six-maisons', labelFr: 'Les Six Maisons', labelEn: 'Six Houses' },
          { id: 'tokenomics', labelFr: 'Tokenomics $KLT', labelEn: '$KLT Tokenomics' },
          { id: 'securite', labelFr: 'Sécurité & Preuves', labelEn: 'Security & Proofs' },
          { id: 'acquerir', labelFr: 'Acquérir le $KLT', labelEn: 'Acquire $KLT' },
          { id: 'tiers', labelFr: 'Tiers d’Accès', labelEn: 'Access Tiers' },
          { id: 'klt-token', labelFr: 'Token $KLT', labelEn: '$KLT Token' },
          { id: 'roadmap', labelFr: 'Roadmap', labelEn: 'Roadmap' },
          { id: 'footer', labelFr: 'Contact', labelEn: 'Contact' },
        ].map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => {
              e.preventDefault();
              scrollToAnchor(item.id);
            }}
            className="min-h-[40px] inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-amber-300 hover:bg-amber-500/10 border border-transparent hover:border-amber-500/25 transition-colors whitespace-nowrap shrink-0"
          >
            {t(item.labelFr, item.labelEn)}
          </a>
        ))}
      </nav>

      {/* Hero — Maison de Luxe Africaine (Noir Profond, Or, Blanc) */}
      <section className="relative bg-[#050507] border border-amber-500/25 rounded-2xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        <div className="lg:col-span-2 space-y-5">
          <p className="text-xs font-medium text-amber-400 tracking-wide">
            Maison Mark Kanich · KIIS Global · Abidjan, Côte d’Ivoire
          </p>
          <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-white leading-tight">
            Kanich Luxury Token ($KLT)
          </h1>
          <p className="text-base text-slate-300 max-w-2xl leading-relaxed">
            {t(
              'Maison de luxe africaine et architecture financière souveraine sur Solana, reliant haute couture, cosmétique, immobilier, commerce et finance institutionnelle.',
              'African luxury house and sovereign financial architecture on Solana, uniting haute couture, cosmetics, real estate, commerce, and institutional finance.'
            )}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="#klt-token"
              onClick={(e) => {
                e.preventDefault();
                scrollToAnchor('klt-token');
              }}
              className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black text-sm font-semibold transition-colors whitespace-nowrap"
            >
              {t('Découvrir le Token $KLT', 'Discover $KLT Token')}
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#telegram"
              onClick={(e) => {
                e.preventDefault();
                scrollToAnchor('acquerir');
              }}
              className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-amber-500/40 bg-[#0B0B10] hover:border-amber-400 text-white text-sm font-semibold transition-colors whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4 text-amber-400" />
              {t('Rejoindre la Communauté', 'Join the Community')}
            </a>
            <button
              type="button"
              onClick={() => setRoute('whitepaper')}
              className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/15 bg-black/50 hover:border-white/30 text-slate-200 text-sm font-medium transition-colors whitespace-nowrap"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              {t('Livre Blanc v3.1.0', 'Whitepaper v3.1.0')}
            </button>
            <button
              type="button"
              onClick={() => setRoute('dashboard')}
              className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/15 bg-black/50 hover:border-white/30 text-slate-200 text-sm font-medium transition-colors whitespace-nowrap"
            >
              {t('Tableau de bord', 'Dashboard')}
            </button>
          </div>
        </div>

        <div className="relative flex flex-col items-center justify-center p-6 rounded-xl bg-[#0A0A0E] border border-amber-500/20 text-center">
          <div className="relative flex items-center justify-center">
            <div
              aria-hidden="true"
              className="klt-orbit-slow absolute -inset-3 rounded-full border border-dashed border-amber-400/30 pointer-events-none"
            />
            <div className="klt-float-subtle">
              <BrandMark size="xl" />
            </div>
          </div>
          <p className="font-serif-luxury text-base font-semibold text-amber-400 mt-5">
            {t('Emblème Officiel $KLT', 'Official $KLT Emblem')}
          </p>
          <p className="text-xs text-slate-400 mt-1 font-mono-tabular">
            Solana SPL · 100 000 000 Supply
          </p>
        </div>
      </section>

      {/* SECTION : LES SIX MAISONS */}
      <section id="six-maisons" className="scroll-mt-20 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <p className="text-xs font-medium text-amber-400">
              {t('Architecture du Groupe · Maison Mark Kanich', 'Group Architecture · Maison Mark Kanich')}
            </p>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white mt-1">
              {t('Les Six Maisons', 'The Six Houses')}
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-md">
            {t(
              'Six entités complémentaires ancrées dans l’économie réelle et fédérées par le jeton $KLT.',
              'Six complementary houses anchored in the real economy and united by the $KLT token.'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SIX_MAISONS.map((maison) => (
            <article
              key={maison.id}
              id={maison.id}
              className="bg-[#07070A] border border-white/10 hover:border-amber-500/40 rounded-xl p-6 flex flex-col justify-between gap-5 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono-tabular text-amber-400 font-semibold">{maison.index}</span>
                  <span>{t(maison.domainFr, maison.domainEn)}</span>
                </div>
                <h3 className="font-serif-luxury text-xl font-bold text-white">{maison.name}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {t(maison.descFr, maison.descEn)}
                </p>
              </div>

              <div className="pt-3 border-t border-white/10">
                <a
                  href={maison.targetAnchor}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToAnchor(maison.targetAnchor);
                  }}
                  className="min-h-[40px] inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                >
                  {t('En savoir plus', 'Learn more')}
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Récapitulatif sobre des 3 pôles (8 entités opérationnelles) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pt-2">
          {ECOSYSTEM_PILLARS.map((div) => (
            <div key={div.pole} className="bg-[#07070A] border border-white/10 rounded-xl p-5 space-y-3">
              <h3 className="text-xs font-semibold text-amber-400 border-b border-white/10 pb-2">
                {language === 'fr' ? div.pole : div.poleEn}
              </h3>
              <div className="space-y-2.5">
                {div.items.map((entity) => (
                  <div key={entity.name}>
                    <p className="text-sm font-semibold text-white">{entity.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      {language === 'fr' ? entity.descFr : entity.descEn}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 1 (après Les Six Maisons) : TOKENOMICS $KLT */}
      <section id="tokenomics" className="scroll-mt-20 space-y-6 bg-[#050507] border border-amber-500/25 rounded-2xl p-6 sm:p-8">
        <div className="space-y-2 border-b border-white/10 pb-5">
          <p className="text-xs font-medium text-amber-400">
            {t('TOKENOMICS $KLT', '$KLT TOKENOMICS')}
          </p>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white">
            {t(
              'Tokenomics $KLT : Rareté, Équité et Transparence',
              '$KLT Tokenomics: Scarcity, Fairness & Transparency'
            )}
          </h2>
          <p className="text-sm text-slate-300 font-mono-tabular">
            {t('Offre totale fixe de 100 000 000 $KLT.', 'Fixed total supply of 100,000,000 $KLT.')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tokenomicsCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.percent}
                className="bg-[#0B0B10] border border-white/10 hover:border-amber-500/40 rounded-xl p-5 flex flex-col justify-between gap-4 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-amber-400" />
                    </div>
                    <span className="font-mono-tabular text-lg font-bold text-amber-400">
                      {card.percent} ({card.amount})
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-white leading-snug">
                    {t(card.titleFr, card.titleEn)}
                  </h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {t(card.detailFr, card.detailEn)}
                </p>
              </div>
            );
          })}
        </div>

        {/* Barre de répartition proportionnelle sobre */}
        <div className="space-y-2 pt-2">
          <div className="h-2.5 w-full rounded-full overflow-hidden flex bg-black border border-white/10">
            <div className="bg-amber-400 h-full" style={{ width: '35%' }} title="35% Liquidité Initiale" />
            <div className="bg-amber-600 h-full" style={{ width: '30%' }} title="30% Brûlage Définitif" />
            <div className="bg-slate-300 h-full" style={{ width: '20%' }} title="20% Vesting Équipe" />
            <div className="bg-slate-600 h-full" style={{ width: '15%' }} title="15% Réserve Communauté" />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 font-mono-tabular">
            <span>35% Raydium LP · 30% Burn · 20% Vesting · 15% Communauté</span>
            <span className="text-amber-400">Total : 100 000 000 $KLT</span>
          </div>
        </div>
      </section>

      {/* SECTION 2 : SÉCURITÉ & PREUVES */}
      <section id="securite" className="scroll-mt-20 space-y-6 bg-[#07070A] border border-white/10 rounded-2xl p-6 sm:p-8">
        <div className="space-y-2 border-b border-white/10 pb-5">
          <p className="text-xs font-medium text-amber-400">
            {t('SÉCURITÉ & PREUVES', 'SECURITY & PROOFS')}
          </p>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white">
            {t('La Transparence est notre standard', 'Transparency is our standard')}
          </h2>
          <p className="text-sm text-slate-400">
            {t(
              'Vérifications on-chain Solana et garanties cryptographiques de la Maison Mark Kanich.',
              'Solana on-chain verifications and cryptographic safeguards of Maison Mark Kanich.'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Liste avec icônes de validation dorées */}
          <ul className="divide-y divide-white/10 border border-white/10 rounded-xl bg-[#0B0B10] px-5">
            <li className="py-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                <span className="text-sm font-medium text-white">
                  {t('Mint Authority Révoquée', 'Mint Authority Revoked')}
                </span>
              </div>
              <span className="text-xs text-amber-400 font-mono-tabular">On-chain</span>
            </li>
            <li className="py-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                <span className="text-sm font-medium text-white">
                  {t('Freeze Authority Révoquée', 'Freeze Authority Revoked')}
                </span>
              </div>
              <span className="text-xs text-amber-400 font-mono-tabular">On-chain</span>
            </li>
            <li className="py-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                <span className="text-sm font-medium text-white">
                  {t('LP Lock 24 mois', 'LP Lock 24 months')}
                </span>
              </div>
              <a
                href="#lp-lock"
                onClick={(e) => handleProofClick(e, 'lp-lock')}
                className="min-h-[36px] inline-flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 underline-offset-4 hover:underline whitespace-nowrap"
              >
                {t('Certificat LP', 'LP Certificate')}
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </li>
            <li className="py-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                <span className="text-sm font-medium text-white">
                  {t('Burn certifié', 'Certified Burn')}
                </span>
              </div>
              <a
                href="#burn"
                onClick={(e) => handleProofClick(e, 'burn')}
                className="min-h-[36px] inline-flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 underline-offset-4 hover:underline whitespace-nowrap"
              >
                {t('Preuve Burn (30M)', 'Burn Proof (30M)')}
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </li>
            <li className="py-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                <span className="text-sm font-medium text-white">
                  {t('Vesting public', 'Public Vesting')}
                </span>
              </div>
              <a
                href="#vesting"
                onClick={(e) => handleProofClick(e, 'vesting')}
                className="min-h-[36px] inline-flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 underline-offset-4 hover:underline whitespace-nowrap"
              >
                {t('Registre Vesting', 'Vesting Ledger')}
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </li>
          </ul>

          {/* Contract Address (CA) modifiable + bouton Copier + Détail preuve active */}
          <div className="space-y-4">
            <div className="bg-[#0B0B10] border border-amber-500/30 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <label htmlFor="klt-contract-address" className="text-xs font-semibold text-amber-400">
                  Contract Address (CA)
                </label>
                <span className="text-[11px] text-slate-400">Solana SPL</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  id="klt-contract-address"
                  type="text"
                  value={contractAddress}
                  onChange={(e) => handleContractChange(e.target.value)}
                  placeholder={t(
                    'Coller l’adresse du contrat Solana ($KLT)...',
                    'Paste Solana ($KLT) contract address...'
                  )}
                  className="flex-1 min-h-[44px] px-3.5 py-2 rounded-lg bg-[#050507] border border-white/15 focus:border-amber-400 focus:outline-none text-xs sm:text-sm text-white font-mono-tabular placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={handleCopyContract}
                  className="min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black text-xs font-semibold transition-colors whitespace-nowrap shrink-0"
                >
                  {copiedCa ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedCa ? t('Copié', 'Copied') : t('Copier', 'Copy')}
                </button>
              </div>
              <p className="text-xs text-slate-400">
                {t(
                  'Champ éditable : collez votre adresse officielle Solana pour la vérifier et la copier en un clic.',
                  'Editable field: paste your official Solana address to verify and copy in one click.'
                )}
              </p>
            </div>

            {/* Ancres de preuves #lp-lock, #burn, #vesting */}
            <div className="bg-[#0B0B10] border border-white/10 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>{t('Détail des Preuves Vérifiables', 'Verifiable Proof Details')}</span>
              </div>
              <div className="divide-y divide-white/10 text-xs">
                <div
                  id="lp-lock"
                  className={`py-2.5 scroll-mt-24 transition-colors ${
                    activeProof === 'lp-lock' ? 'text-amber-300' : 'text-slate-400'
                  }`}
                >
                  <span className="font-semibold text-white">LP Lock 24 mois (#lp-lock)</span> ·{' '}
                  {t(
                    'Liquidité initiale Raydium verrouillée 24 mois pour prévenir tout retrait prématuré.',
                    'Initial Raydium liquidity locked for 24 months preventing premature withdrawal.'
                  )}
                </div>
                <div
                  id="burn"
                  className={`py-2.5 scroll-mt-24 transition-colors ${
                    activeProof === 'burn' ? 'text-amber-300' : 'text-slate-400'
                  }`}
                >
                  <span className="font-semibold text-white">Burn certifié (#burn)</span> ·{' '}
                  {t(
                    '30 000 000 $KLT (30% de l’offre) envoyés vers l’adresse d’incinération Solana.',
                    '30,000,000 $KLT (30% of supply) permanently sent to the Solana incinerator address.'
                  )}
                </div>
                <div
                  id="vesting"
                  className={`py-2.5 scroll-mt-24 transition-colors ${
                    activeProof === 'vesting' ? 'text-amber-300' : 'text-slate-400'
                  }`}
                >
                  <span className="font-semibold text-white">Vesting public (#vesting)</span> ·{' '}
                  {t(
                    '20 000 000 $KLT Équipe soumis à un cliff de 6 mois et libération linéaire sur 24 mois.',
                    '20,000,000 $KLT Team allocation governed by a 6-month cliff and 24-month linear vesting.'
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Widget SolscanTracker : suivi temps réel contrat $KLT, burn et locks Solana */}
        <SolscanTracker
          contractAddress={contractAddress}
          onContractChange={handleContractChange}
        />
      </section>

      {/* SECTION 3 : OÙ ACQUÉRIR LE $KLT */}
      <section id="acquerir" className="scroll-mt-20 space-y-6 bg-[#050507] border border-amber-500/25 rounded-2xl p-6 sm:p-8">
        <div className="space-y-2 border-b border-white/10 pb-5">
          <p className="text-xs font-medium text-amber-400">
            {t('OÙ ACQUÉRIR LE $KLT', 'WHERE TO ACQUIRE $KLT')}
          </p>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white">
            {t('Accès Marché & Communauté Officielle', 'Market Access & Official Community')}
          </h2>
          <p className="text-sm text-slate-400">
            {t(
              'Sélectionnez une plateforme d’exécution Solana ou rejoignez les canaux officiels de la Maison.',
              'Select a Solana execution venue or join the House’s official channels.'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            id="raydium"
            href="#raydium"
            onClick={(e) => handleGatewayClick(e, 'raydium')}
            className="min-h-[56px] flex items-center justify-between gap-3 px-5 py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-semibold text-sm transition-colors"
          >
            <span className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 shrink-0" />
              {t('Acheter sur Raydium', 'Buy on Raydium')}
            </span>
            <ExternalLink className="w-4 h-4 shrink-0" />
          </a>

          <a
            id="dexscreener"
            href="#dexscreener"
            onClick={(e) => handleGatewayClick(e, 'dexscreener')}
            className="min-h-[56px] flex items-center justify-between gap-3 px-5 py-4 rounded-xl bg-[#0B0B10] border border-amber-500/40 hover:border-amber-400 text-white font-semibold text-sm transition-colors"
          >
            <span className="flex items-center gap-2.5">
              <BarChart3 className="w-4 h-4 text-amber-400 shrink-0" />
              {t('Voir sur DexScreener', 'View on DexScreener')}
            </span>
            <ExternalLink className="w-4 h-4 text-amber-400 shrink-0" />
          </a>

          <a
            id="telegram"
            href="#telegram"
            onClick={(e) => handleGatewayClick(e, 'telegram')}
            className="min-h-[56px] flex items-center justify-between gap-3 px-5 py-4 rounded-xl bg-[#0B0B10] border border-white/15 hover:border-amber-400 text-white font-semibold text-sm transition-colors"
          >
            <span className="flex items-center gap-2.5">
              <MessageCircle className="w-4 h-4 text-amber-400 shrink-0" />
              {t('Rejoindre le Telegram', 'Join Telegram')}
            </span>
            <ExternalLink className="w-4 h-4 text-slate-400 shrink-0" />
          </a>

          <a
            id="twitter"
            href="#twitter"
            onClick={(e) => handleGatewayClick(e, 'twitter')}
            className="min-h-[56px] flex items-center justify-between gap-3 px-5 py-4 rounded-xl bg-[#0B0B10] border border-white/15 hover:border-amber-400 text-white font-semibold text-sm transition-colors"
          >
            <span className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-amber-400 shrink-0" />
              {t('Suivre sur X', 'Follow on X')}
            </span>
            <ExternalLink className="w-4 h-4 text-slate-400 shrink-0" />
          </a>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-white/10 text-xs text-slate-400">
          <span>
            {activeGateway
              ? t(
                  `Canal actif : #${activeGateway} — utilisez également l’espace intégré ci-contre pour trader ou suivre le cours.`,
                  `Active channel: #${activeGateway} — you can also use the integrated workspace to trade or track rates.`
                )
              : t(
                  'Accès direct intégré disponible depuis votre espace Maison Mark Kanich.',
                  'Direct integrated access also available from your Maison Mark Kanich workspace.'
                )}
          </span>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setRoute('solana-trading')}
              className="min-h-[38px] px-3 py-1.5 rounded-lg border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 font-medium transition-colors whitespace-nowrap"
            >
              {t('Ouvrir Swap Solana', 'Open Solana Swap')}
            </button>
            <button
              type="button"
              onClick={() => setRoute('trade')}
              className="min-h-[38px] px-3 py-1.5 rounded-lg border border-white/15 text-slate-200 hover:bg-white/5 font-medium transition-colors whitespace-nowrap"
            >
              {t('Graphique Trading', 'Trading Chart')}
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 4 : LES TIERS D'ACCÈS */}
      <section id="tiers" className="scroll-mt-20 space-y-6">
        <div className="space-y-2 border-b border-white/10 pb-4">
          <p className="text-xs font-medium text-amber-400">
            {t('LES TIERS D’ACCÈS', 'ACCESS TIERS')}
          </p>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white">
            {t('Cercles & Privilèges de la Maison', 'Circles & Privileges of the House')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ACCESS_TIERS.map((tier) => {
            const isGold = tier.accent === 'gold';
            const isPlatinum = tier.accent === 'platinum';
            return (
              <div
                key={tier.id}
                className={`rounded-2xl p-6 flex flex-col justify-between gap-6 border transition-colors ${
                  isGold
                    ? 'bg-[#0C0A05] border-amber-400/60'
                    : isPlatinum
                    ? 'bg-[#090A0F] border-white/30'
                    : 'bg-[#060609] border-white/15'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-amber-400 font-medium">
                      {t(tier.levelFr, tier.levelEn)}
                    </span>
                    {isGold ? (
                      <Crown className="w-5 h-5 text-amber-400" />
                    ) : isPlatinum ? (
                      <Gem className="w-5 h-5 text-white" />
                    ) : (
                      <Shield className="w-5 h-5 text-slate-300" />
                    )}
                  </div>
                  <h3 className="font-serif-luxury text-2xl font-bold text-white tracking-wide">
                    {tier.title}
                  </h3>
                  <p className="font-mono-tabular text-xs text-amber-300">{tier.requirement}</p>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {t(tier.descFr, tier.descEn)}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setRoute(tier.id === 'black' ? 'buy' : 'solana-trading')}
                    className={`w-full min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                      isGold
                        ? 'bg-amber-400 hover:bg-amber-300 text-black'
                        : 'border border-white/20 hover:border-amber-400 text-white bg-black/50'
                    }`}
                  >
                    {tier.id === 'black'
                      ? t('Acquérir des $KLT', 'Acquire $KLT')
                      : t('Activer via Staking', 'Activate via Staking')}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION DÉDIÉE $KLT : PRÉSENTATION & 3 PILIERS */}
      <section id="klt-token" className="scroll-mt-20 space-y-6 bg-[#050507] border border-amber-500/25 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-white/10 pb-6">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-medium text-amber-400">
              {t('PRÉSENTATION DU JETON $KLT', '$KLT TOKEN SHOWCASE')}
            </p>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white">
              {t(
                'Un Actif Souverain au Cœur de la Maison Mark Kanich',
                'A Sovereign Asset at the Heart of Maison Mark Kanich'
              )}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {t(
                'Conçu sur Solana pour concilier l’exigence d’une Maison de luxe africaine et la rigueur mathématique de la finance décentralisée.',
                'Engineered on Solana to unite the standards of an African luxury house with the mathematical rigor of decentralized finance.'
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="#tokenomics"
              onClick={(e) => {
                e.preventDefault();
                scrollToAnchor('tokenomics');
              }}
              className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-amber-500/40 text-amber-300 hover:bg-amber-500/10 text-xs font-semibold transition-colors whitespace-nowrap"
            >
              {t('Voir Tokenomics', 'View Tokenomics')}
            </a>
            <a
              href="#acquerir"
              onClick={(e) => {
                e.preventDefault();
                scrollToAnchor('acquerir');
              }}
              className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black text-xs font-semibold transition-colors whitespace-nowrap"
            >
              {t('Où acquérir le $KLT', 'Where to acquire $KLT')}
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {KLT_TOKEN_PILLARS.map((pillar, idx) => (
            <div
              key={pillar.key}
              className="bg-[#0B0B10] border border-white/10 rounded-xl p-6 space-y-3"
            >
              <p className="font-mono-tabular text-xs text-amber-400">0{idx + 1}</p>
              <h3 className="font-serif-luxury text-xl font-bold text-white">
                {t(pillar.titleFr, pillar.titleEn)}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {t(pillar.descFr, pillar.descEn)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION ROADMAP : 4 PHASES */}
      <section id="roadmap" className="scroll-mt-20 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <p className="text-xs font-medium text-amber-400 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              {t('FEUILLE DE ROUTE 2026–2027', '2026–2027 ROADMAP')}
            </p>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white mt-1">
              {t('Déploiement en Quatre Phases', 'Four-Phase Execution Roadmap')}
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono-tabular">
            Q3 2026 → Q2 2027
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ROADMAP_PHASES.map((phase, idx) => (
            <div
              key={phase.quarter}
              className="bg-[#07070A] border border-white/10 hover:border-amber-500/40 rounded-xl p-5 space-y-4 transition-colors"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-mono-tabular text-xs font-bold text-amber-400">
                  {phase.quarter}
                </span>
                <span className="text-xs text-slate-400 font-mono-tabular">Phase 0{idx + 1}</span>
              </div>
              <h3 className="font-serif-luxury text-lg font-bold text-white">
                {language === 'fr' ? phase.titleFr : phase.titleEn}
              </h3>
              <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                {phase.pointsFr.map((pt) => (
                  <li key={pt} className="flex items-start gap-2">
                    <span aria-hidden="true" className="text-amber-400 mt-0.5">·</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER OFFICIEL */}
      <footer
        id="footer"
        className="scroll-mt-20 bg-[#050507] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="space-y-2">
            <p className="font-serif-luxury text-lg font-bold text-white">
              Maison Mark Kanich
            </p>
            <p className="text-xs text-slate-400 leading-relaxed flex items-start gap-2">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>145-146 Sideci Iroko, Yopougon, Abidjan, Côte d'Ivoire</span>
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-amber-400">
              {t('Contact Direct', 'Direct Contact')}
            </p>
            <a
              href="mailto:contact@markkanich.com"
              className="inline-flex items-center gap-2 text-sm text-white hover:text-amber-400 transition-colors"
            >
              <Mail className="w-4 h-4 text-amber-400" />
              contact@markkanich.com
            </a>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-amber-400">
              {t('Réseaux Officiels', 'Official Channels')}
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#twitter"
                aria-label="X (Twitter)"
                onClick={(e) => handleGatewayClick(e, 'twitter')}
                className="min-h-[40px] min-w-[40px] inline-flex items-center justify-center rounded-lg border border-white/15 bg-[#0B0B10] text-slate-200 hover:border-amber-400 hover:text-amber-400 transition-colors"
              >
                <span className="text-xs font-bold">𝕏</span>
              </a>
              <a
                href="#telegram"
                aria-label="Telegram"
                onClick={(e) => handleGatewayClick(e, 'telegram')}
                className="min-h-[40px] min-w-[40px] inline-flex items-center justify-center rounded-lg border border-white/15 bg-[#0B0B10] text-slate-200 hover:border-amber-400 hover:text-amber-400 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                id="linkedin"
                href="#linkedin"
                aria-label="LinkedIn"
                onClick={(e) => handleGatewayClick(e, 'linkedin')}
                className="min-h-[40px] min-w-[40px] inline-flex items-center justify-center rounded-lg border border-white/15 bg-[#0B0B10] text-slate-200 hover:border-amber-400 hover:text-amber-400 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <p>
              Le $KLT est un token utilitaire. Les crypto-actifs comportent des risques. DYOR.
            </p>
            <button
              type="button"
              onClick={() => setRoute('remboursement')}
              className="text-amber-400 hover:text-amber-300 underline underline-offset-2 whitespace-nowrap"
            >
              {t('Politique de Remboursement (/remboursement)', 'Refund Policy (/remboursement)')}
            </button>
          </div>
          <p className="text-slate-300 font-medium whitespace-nowrap">
            © 2026 Maison Mark Kanich / KIIS Global
          </p>
        </div>
      </footer>
    </div>
  );
};

export const WhitepaperView: React.FC = () => {
  const { t, language, notify } = useKLTStore();
  const [activeSection, setActiveSection] = useState('resume');

  const sections = [
    { id: 'resume', labelFr: '1. Résumé Exécutif', labelEn: '1. Executive Summary' },
    { id: 'vision', labelFr: '2. La Vision', labelEn: '2. The Vision' },
    { id: 'piliers', labelFr: '3. Les Huit Piliers', labelEn: '3. Eight Pillars' },
    { id: 'tokenomics', labelFr: '4. Tokenomics $KLT', labelEn: '4. $KLT Tokenomics' },
    { id: 'pumpfun', labelFr: '5. Stratégie Pump.fun', labelEn: '5. Pump.fun Strategy' },
    { id: 'securite', labelFr: '6. Sécurité 7 Couches', labelEn: '6. 7-Layer Security' },
    { id: 'roadmap', labelFr: '7. Feuille de Route', labelEn: '7. Roadmap' },
    { id: 'contact', labelFr: '8. Contact & Légal', labelEn: '8. Contact & Legal' },
  ];

  const scrollTo = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handlePrint = () => {
    window.print();
    notify(t('Export PDF du Livre Blanc prêt.', 'Whitepaper PDF export ready.'), 'info');
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-6 flex flex-wrap items-center justify-between gap-4 print-only-light">
        <div className="flex items-center gap-4">
          <BrandMark size="lg" />
          <div>
            <p className="text-xs text-amber-400 font-mono-tabular">
              DOCUMENT OFFICIEL · VERSION 3.1.0 (ÉDITION PUMP.FUN) · 20 NOVEMBRE 2026
            </p>
            <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white mt-1">
              {t('Livre Blanc — Maison Mark Kanich ($KLT)', 'Official Whitepaper — Maison Mark Kanich ($KLT)')}
            </h1>
          </div>
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="no-print inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold transition-colors whitespace-nowrap"
        >
          <FileText className="w-4 h-4" />
          {t('Télécharger en PDF', 'Download PDF')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-6 items-start">
        <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-6 sm:p-8 space-y-8 print-only-light">
          <div className="p-4 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
            <strong className="text-amber-400">{t('Avertissement Légal : ', 'Legal Disclaimer: ')}</strong>
            {t(
              'Ce document est fourni à titre strictement informatif. Le Kanich Luxury Token ($KLT) est un actif numérique utilitaire émis sur la blockchain Solana. Il ne constitue ni une offre de titres financiers, ni un conseil en investissement (DYOR).',
              'Provided strictly for informational purposes. Kanich Luxury Token ($KLT) is a utility digital asset issued on Solana. It does not constitute financial advice or a securities offering (DYOR).'
            )}
          </div>

          <section id="resume" className="space-y-3 scroll-mt-20">
            <h2 className="font-serif-luxury text-xl font-bold text-amber-400 border-b border-slate-800 pb-2">
              {t('1. Résumé Exécutif', '1. Executive Summary')}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              La <strong className="text-white">Maison Mark Kanich</strong> est un écosystème entrepreneurial holistique conçu pour combler le fossé entre l’économie réelle africaine (immobilier, luxe, commerce, IA) et la finance décentralisée (DeFi).
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">
              Piloté par <strong className="text-white">KIIS Global</strong> depuis Abidjan, l’écosystème introduit le <strong className="text-amber-400">Kanich Luxury Token ($KLT)</strong> sur Solana : le vecteur de valeur unificateur de huit entités opérationnelles, lancé via <strong className="text-white">Pump.fun</strong> pour une transparence absolue.
            </p>
          </section>

          <section id="vision" className="space-y-3 scroll-mt-20">
            <h2 className="font-serif-luxury text-xl font-bold text-amber-400 border-b border-slate-800 pb-2">
              {t('2. La Vision', '2. The Vision')}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Nous croyons que l’Afrique de demain ne se construira pas en important des modèles financiers étrangers, mais en créant les siens — ancrés dans ses réalités, portés par sa jeunesse, et propulsés par la blockchain.
            </p>
          </section>

          <section id="piliers" className="space-y-4 scroll-mt-20">
            <h2 className="font-serif-luxury text-xl font-bold text-amber-400 border-b border-slate-800 pb-2">
              {t('3. Les Huit Piliers de l’Écosystème', '3. The Eight Ecosystem Pillars')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {ECOSYSTEM_PILLARS.map((div) => (
                <div key={div.pole} className="p-4 rounded-lg bg-slate-900/70 border border-slate-800 space-y-2.5">
                  <h3 className="text-xs font-bold text-amber-400">{language === 'fr' ? div.pole : div.poleEn}</h3>
                  {div.items.map((item) => (
                    <div key={item.name} className="text-xs">
                      <p className="font-semibold text-white">{item.name}</p>
                      <p className="text-slate-400">{language === 'fr' ? item.descFr : item.descEn}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>

          <section id="tokenomics" className="space-y-4 scroll-mt-20">
            <h2 className="font-serif-luxury text-xl font-bold text-amber-400 border-b border-slate-800 pb-2">
              {t('4. Tokenomics du $KLT', '4. $KLT Tokenomics')}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Blockchain</span>
                <p className="font-semibold text-white mt-0.5">Solana (SPL)</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400">{t('Offre Totale', 'Total Supply')}</span>
                <p className="font-semibold text-white font-mono-tabular mt-0.5">100 000 000</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Staking APY</span>
                <p className="font-semibold text-emerald-400 font-mono-tabular mt-0.5">15%</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400">{t('Lancement', 'Launchpad')}</span>
                <p className="font-semibold text-amber-400 mt-0.5">Pump.fun</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-amber-400">
                    <th className="py-2.5 pr-4">{t('Allocation', 'Allocation')}</th>
                    <th className="py-2.5 pr-4 text-right">%</th>
                    <th className="py-2.5 pr-4 text-right">{t('Montant', 'Amount')}</th>
                    <th className="py-2.5">{t('Mécanisme de Sécurité', 'Security Mechanism')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  {TOKENOMICS_ALLOCATION.map((row) => (
                    <tr key={row.labelFr}>
                      <td className="py-3 pr-4 font-semibold text-white">
                        {language === 'fr' ? row.labelFr : row.labelEn}
                      </td>
                      <td className="py-3 pr-4 text-right font-mono-tabular text-amber-400 font-semibold">
                        {row.percent}%
                      </td>
                      <td className="py-3 pr-4 text-right font-mono-tabular text-white">{row.amount}</td>
                      <td className="py-3 text-slate-300">
                        {language === 'fr' ? row.mechanismFr : row.mechanismEn}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="pumpfun" className="space-y-3 scroll-mt-20">
            <h2 className="font-serif-luxury text-xl font-bold text-amber-400 border-b border-slate-800 pb-2">
              {t('5. Stratégie de Lancement : Pump.fun & Raydium', '5. Launch Strategy: Pump.fun & Raydium')}
            </h2>
            <ul className="space-y-2 text-sm text-slate-300 list-disc pl-5">
              <li>
                <strong className="text-white">Sécurité Anti-Rug Pull native :</strong> À ~85–90 SOL accumulés, la liquidité migre automatiquement vers Raydium et les tokens LP sont brûlés. Risque de rug pull = 0%.
              </li>
              <li>
                <strong className="text-white">Transparence totale :</strong> L’offre et les transactions sont vérifiables en temps réel sur Solscan.
              </li>
              <li>
                <strong className="text-white">Bonding Curve :</strong> Prix dicté mathématiquement jusqu’au listing public Raydium (~65 000 $ Market Cap).
              </li>
            </ul>
          </section>

          <section id="securite" className="space-y-3 scroll-mt-20">
            <h2 className="font-serif-luxury text-xl font-bold text-amber-400 border-b border-slate-800 pb-2">
              {t('6. Sécurité : Standard « Zéro Compromis »', '6. Zero-Compromise Security Standard')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-lg bg-slate-900/70 border border-slate-800 space-y-1.5">
                <p className="font-semibold text-white mb-2">{t('Sécurité Blockchain Solana', 'Solana Blockchain Security')}</p>
                <p className="text-emerald-400">· Mint Authority Révoquée</p>
                <p className="text-emerald-400">· Freeze Authority Révoquée</p>
                <p className="text-emerald-400">· Liquidité Verrouillée et Brûlée (Auto)</p>
                <p className="text-emerald-400">· Brûlage Pré-lancement de 30%</p>
              </div>
              <div className="p-4 rounded-lg bg-slate-900/70 border border-slate-800 space-y-1.5 text-slate-300">
                <p className="font-semibold text-white mb-2">{t('Infrastructure 7 Couches', '7-Layer Infrastructure')}</p>
                <p>1. Device Fingerprinting (SHA-256)</p>
                <p>2. Chiffrement AES-256-GCM</p>
                <p>3. Multi-Signature Treasury</p>
                <p>4. Détection de Fraude par IA · 5. RLS · 6. Audits · 7. Bug Bounty</p>
              </div>
            </div>
          </section>

          <section id="roadmap" className="space-y-4 scroll-mt-20">
            <h2 className="font-serif-luxury text-xl font-bold text-amber-400 border-b border-slate-800 pb-2">
              {t('7. Feuille de Route (Roadmap)', '7. Roadmap')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ROADMAP_PHASES.map((phase) => (
                <div key={phase.quarter} className="p-4 rounded-lg bg-slate-900/70 border border-slate-800">
                  <p className="text-xs font-mono-tabular font-bold text-amber-400">
                    {phase.quarter} — {language === 'fr' ? phase.titleFr : phase.titleEn}
                  </p>
                  <ul className="mt-2 space-y-1 text-xs text-slate-300 list-disc pl-4">
                    {phase.pointsFr.map((pt) => (
                      <li key={pt}>{pt}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section id="contact" className="pt-4 border-t border-slate-800 text-xs text-slate-400 space-y-1 scroll-mt-20">
            <p className="font-semibold text-white">MAISON MARK KANICH / KIIS GLOBAL</p>
            <p>145-146 Sideci Iroko, Yopougon, Abidjan, Côte d’Ivoire</p>
            <p>contact@markkanich.com · +225 07 15 94 60 56 · markkanich.com</p>
            <p className="text-slate-500 pt-2">
              DOCUMENT CONFIDENTIEL · PROPRIÉTÉ DE ADAMA F. SHEICKNER · © 2026 Maison Mark Kanich.
            </p>
          </section>
        </div>

        {/* Sticky Section Index */}
        <aside className="no-print hidden lg:block sticky top-20 bg-[#0F172A] border border-slate-800 rounded-xl p-4 space-y-1">
          <p className="text-xs font-semibold text-slate-400 px-2 pb-2 border-b border-slate-800">
            {t('Sommaire', 'Table of Contents')}
          </p>
          {sections.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => scrollTo(s.id)}
              className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                activeSection === s.id
                  ? 'bg-amber-500/15 text-amber-300 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {t(s.labelFr, s.labelEn)}
            </button>
          ))}
        </aside>
      </div>
    </div>
  );
};
