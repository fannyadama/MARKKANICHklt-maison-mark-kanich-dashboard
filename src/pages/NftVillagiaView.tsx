import React, { useState } from 'react';
import {
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Coins,
  Crown,
  KeyRound,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { useKLTStore } from '../context/KLTStoreContext';
import { AccessNftTier } from '../types/klt';

export const NftVillagiaView: React.FC = () => {
  const {
    t,
    language,
    totalKltBalance,
    kltPriceUsd,
    accessNftTiers,
    ownedNftIds,
    mintAccessNft,
    villagiaDividend,
    claimVillagiaDividend,
    solanaConnected,
    solanaAddress,
    openWalletModal,
  } = useKLTStore();

  const [tierFilter, setTierFilter] = useState<'all' | AccessNftTier['tier']>('all');
  const [selectedNft, setSelectedNft] = useState<AccessNftTier | null>(null);
  const [showProofDetails, setShowProofDetails] = useState(false);

  const filteredNfts = accessNftTiers.filter((nft) =>
    tierFilter === 'all' ? true : nft.tier === tierFilter
  );

  const tierAccentClass = (tier: AccessNftTier['tier']) => {
    switch (tier) {
      case 'Platinum':
        return 'text-amber-300';
      case 'Gold':
        return 'text-amber-400';
      case 'Silver':
        return 'text-slate-200';
      default:
        return 'text-orange-300';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-amber-400">
            {t('SOLANA SPL · ACCÈS PRIVILÈGES & IMMOBILIER', 'SOLANA SPL · PRIVILEGE ACCESS & REAL ESTATE')}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-0.5">
            {t('Marketplace NFT Tiers d’Accès & Dividendes Villagia', 'NFT Access Tiers Marketplace & Villagia Dividends')}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {t(
              'Mintez vos Pass d’Accès Maison Mark Kanich et réclamez vos dividendes immobiliers USDC vérifiés par preuve Merkle.',
              'Mint Maison Mark Kanich Access Passes and claim Merkle-verified Villagia USDC real-estate dividends.'
            )}
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#0F172A] border border-slate-800 rounded-xl px-4 py-2.5">
          <div>
            <p className="text-[11px] text-slate-400">{t('Solde liquide', 'Liquid balance')}</p>
            <p className="text-sm font-bold text-amber-400 font-mono-tabular">
              {totalKltBalance.toLocaleString('en-US', { maximumFractionDigits: 2 })} $KLT
            </p>
          </div>
          <div className="h-7 w-px bg-slate-800" />
          <div>
            <p className="text-[11px] text-slate-400">{t('Pass détenus', 'Owned passes')}</p>
            <p className="text-sm font-bold text-emerald-400 font-mono-tabular">
              {ownedNftIds.length} / {accessNftTiers.length}
            </p>
          </div>
        </div>
      </div>

      {/* Section 1: Villagia Merkle USDC Dividend Distributor */}
      <section className="bg-[#0F172A] border border-slate-800 rounded-xl p-6 space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
              <Building2 className="w-4 h-4" />
              <span>VILLAGIA MERKLE DISTRIBUTOR · {villagiaDividend.epochLabel}</span>
            </div>
            <h2 className="text-lg font-bold text-white">{villagiaDividend.propertyTitle}</h2>
            <p className="text-xs text-slate-400">
              {t(
                'Distribution trimestrielle des loyers en USDC sur Solana avec vérification cryptographique Keccak-256.',
                'Quarterly USDC rental yield distribution on Solana with Keccak-256 Merkle proof verification.'
              )}
            </p>
          </div>

          <div className="text-right font-mono-tabular">
            <p className="text-xs text-slate-400">{t('Statut réclamation', 'Claim status')}</p>
            <p className={`text-sm font-semibold mt-0.5 ${villagiaDividend.hasClaimed ? 'text-emerald-400' : 'text-amber-400'}`}>
              {villagiaDividend.hasClaimed
                ? t('Réclamé sur Solana', 'Claimed on Solana')
                : t('Éligible à la réclamation', 'Eligible to Claim')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
            <p className="text-xs text-slate-400">{t('Dividendes Disponibles (Époque)', 'Available Dividends (Epoch)')}</p>
            <p className="text-2xl font-bold text-emerald-400 font-mono-tabular mt-1">
              ${villagiaDividend.eligibleUsdc.toFixed(2)} <span className="text-xs text-slate-400 font-normal">USDC</span>
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
            <p className="text-xs text-slate-400">{t('Total Dividendes Perçus', 'Lifetime Dividends Claimed')}</p>
            <p className="text-2xl font-bold text-white font-mono-tabular mt-1">
              ${villagiaDividend.claimedUsdc.toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-xs text-slate-400 font-normal">USDC</span>
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">{t('Preuve Merkle', 'Merkle Proof')}</span>
              <span className="text-emerald-400 font-mono-tabular font-semibold">
                {villagiaDividend.proofHashes.length} {t('nœuds vérifiés', 'verified nodes')}
              </span>
            </div>

            {!solanaConnected ? (
              <button
                type="button"
                onClick={openWalletModal}
                className="w-full py-2.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold transition-colors whitespace-nowrap"
              >
                {t('Connecter Wallet pour Réclamer', 'Connect Wallet to Claim')}
              </button>
            ) : (
              <button
                type="button"
                onClick={claimVillagiaDividend}
                disabled={villagiaDividend.hasClaimed || villagiaDividend.eligibleUsdc <= 0}
                className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-semibold transition-colors whitespace-nowrap"
              >
                {villagiaDividend.hasClaimed
                  ? t('Dividendes déjà réclamés', 'Dividends Already Claimed')
                  : t('Réclamer mes Dividendes USDC', 'Claim USDC Dividends')}
              </button>
            )}
          </div>
        </div>

        {/* Collapsible Cryptographic Merkle Details */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowProofDetails((v) => !v)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-amber-400 transition-colors"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            {t('Inspecter la Racine Merkle & Preuves Keccak-256', 'Inspect Merkle Root & Keccak-256 Proof')}
            {showProofDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showProofDetails && (
            <div className="mt-3 p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-2 text-xs font-mono-tabular">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="text-slate-400">Merkle Root:</span>
                <span className="text-amber-300 truncate">{villagiaDividend.merkleRoot}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="text-slate-400">Claimant PDA Seed:</span>
                <span className="text-slate-200 truncate">{solanaAddress}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="text-slate-400">USDC Mint:</span>
                <span className="text-slate-300 truncate">{villagiaDividend.usdcMint}</span>
              </div>
              {villagiaDividend.txSignature && (
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="text-slate-400">Claim Tx Signature:</span>
                  <span className="text-emerald-400">{villagiaDividend.txSignature}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-800 space-y-1">
                <p className="text-slate-400">Sibling Proof Hashes:</p>
                {villagiaDividend.proofHashes.map((h, idx) => (
                  <p key={h} className="text-slate-300 truncate">
                    [{idx}] {h}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Section 2: NFT Access Tiers Marketplace */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">
              {t('Marketplace NFT • Tiers d’Accès Maison Mark Kanich', 'NFT Marketplace • Maison Mark Kanich Access Tiers')}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {t(
                'Chaque Pass NFT débloque des privilèges vérifiables on-chain à travers les 8 piliers de l’écosystème.',
                'Each NFT Pass unlocks on-chain verifiable privileges across the 8 ecosystem pillars.'
              )}
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg overflow-x-auto">
            {(['all', 'Bronze', 'Silver', 'Gold', 'Platinum'] as const).map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => setTierFilter(tier)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                  tierFilter === tier ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tier === 'all' ? t('Tous', 'All') : tier}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredNfts.map((nft) => {
            const isOwned = ownedNftIds.includes(nft.id);
            const pctMinted = Math.min(100, (nft.minted / nft.supply) * 100);
            const estUsd = nft.priceKlt * kltPriceUsd;

            return (
              <div
                key={nft.id}
                className={`bg-[#0F172A] border rounded-xl p-5 flex flex-col justify-between space-y-4 transition-colors ${
                  isOwned ? 'border-emerald-500/40' : 'border-slate-800 hover:border-amber-500/40'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono-tabular">
                    <span className={`font-bold ${tierAccentClass(nft.tier)}`}>{nft.tier.toUpperCase()}</span>
                    <span className="text-slate-400">{nft.id}</span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white">
                      {language === 'fr' ? nft.name : nft.nameEn}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {language === 'fr' ? nft.pillarFr : nft.pillarEn}
                    </p>
                  </div>

                  <ul className="space-y-1.5 pt-2 border-t border-slate-800/80">
                    {(language === 'fr' ? nft.benefitsFr : nft.benefitsEn).slice(0, 2).map((b) => (
                      <li key={b} className="text-xs text-slate-300 flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="space-y-1.5">
                    <div className="flex items-baseline justify-between text-xs font-mono-tabular">
                      <span className="text-slate-400">{t('Prix', 'Price')}</span>
                      <span className="font-bold text-amber-400">
                        {nft.priceKlt.toLocaleString()} $KLT
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${pctMinted}%` }} />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400 font-mono-tabular">
                      <span>{nft.minted} {t('mintés', 'minted')}</span>
                      <span>≈ ${estUsd.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedNft(nft)}
                    className={`w-full py-2.5 px-3 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                      isOwned
                        ? 'border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                        : 'bg-slate-900 border border-slate-700 hover:border-amber-500 text-white'
                    }`}
                  >
                    {isOwned ? t('Pass Détenu · Détails', 'Owned · View Benefits') : t('Voir & Minter', 'Inspect & Mint')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* NFT Detail & Mint Modal */}
      {selectedNft && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedNft(null)}
        >
          <div
            className="w-full max-w-lg bg-[#0F172A] border border-slate-700 rounded-xl p-6 space-y-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className={`text-xs font-mono-tabular font-bold ${tierAccentClass(selectedNft.tier)}`}>
                  {selectedNft.tier.toUpperCase()} · {selectedNft.id}
                </p>
                <h3 className="text-xl font-bold text-white mt-0.5">
                  {language === 'fr' ? selectedNft.name : selectedNft.nameEn}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {language === 'fr' ? selectedNft.pillarFr : selectedNft.pillarEn}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNft(null)}
                className="p-1.5 text-slate-400 hover:text-white"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-2.5">
              <p className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5" />
                {t('Avantages Exclusifs Vérifiés', 'Verified Exclusive Benefits')}
              </p>
              <ul className="space-y-2">
                {(language === 'fr' ? selectedNft.benefitsFr : selectedNft.benefitsEn).map((benefit) => (
                  <li key={benefit} className="text-xs sm:text-sm text-slate-200 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono-tabular">
              <div>
                <p className="text-slate-400">{t('Prix de Mint', 'Mint Price')}</p>
                <p className="text-lg font-bold text-amber-400 mt-0.5">
                  {selectedNft.priceKlt.toLocaleString()} $KLT
                </p>
              </div>
              <div className="text-right">
                <p className="text-slate-400">{t('Disponibilité', 'Remaining Supply')}</p>
                <p className="text-lg font-bold text-white mt-0.5">
                  {selectedNft.supply - selectedNft.minted} / {selectedNft.supply}
                </p>
              </div>
            </div>

            {ownedNftIds.includes(selectedNft.id) ? (
              <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>
                  {t(
                    'Ce Pass NFT est actif dans votre coffre Solana et vos privilèges sont appliqués.',
                    'This NFT Pass is active in your Solana vault and privileges are applied.'
                  )}
                </span>
              </div>
            ) : !solanaConnected ? (
              <button
                type="button"
                onClick={() => {
                  setSelectedNft(null);
                  openWalletModal();
                }}
                className="w-full py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold transition-colors"
              >
                {t('Connecter votre Wallet pour Minter', 'Connect Wallet to Mint')}
              </button>
            ) : (
              <button
                type="button"
                disabled={totalKltBalance < selectedNft.priceKlt || selectedNft.minted >= selectedNft.supply}
                onClick={() => {
                  const ok = mintAccessNft(selectedNft.id);
                  if (ok) setSelectedNft(null);
                }}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 text-xs font-semibold transition-colors"
              >
                {totalKltBalance >= selectedNft.priceKlt ? (
                  <>
                    <Sparkles className="w-4 h-4" />
                    {t('Minter ce Pass NFT sur Solana', 'Mint NFT Pass on Solana')}
                  </>
                ) : (
                  <>
                    <Coins className="w-4 h-4" />
                    {t('Solde $KLT insuffisant', 'Insufficient $KLT Balance')}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
