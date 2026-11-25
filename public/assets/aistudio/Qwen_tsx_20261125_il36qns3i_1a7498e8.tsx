// src/components/NFTAccessMarketplace.tsx
import React, { useState } from 'react';

interface AccessNFT {
  id: string;
  name: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  priceKLT: number;
  benefits: string[];
  pillar: string; // Ex: Fashion, Villagia, Cosmétique
  imageEmoji: string;
  supply: number;
  minted: number;
}

const NFT_TIERS: AccessNFT[] = [
  {
    id: 'NFT-001',
    name: 'Pass Fashion Artisan',
    tier: 'Silver',
    priceKLT: 5000,
    benefits: ['-15% sur toute la collection Mark Kanich Fashion', 'Accès prioritaire aux défilés privés', 'Consultation style annuelle'],
    pillar: 'Luxe & Lifestyle',
    imageEmoji: '👗',
    supply: 500,
    minted: 142,
  },
  {
    id: 'NFT-002',
    name: 'Pass Villagia Investor',
    tier: 'Gold',
    priceKLT: 25000,
    benefits: ['Accès aux avant-premières immobilières', 'Réduction de 2% sur les frais de notaire', 'Invitation aux galas annuels'],
    pillar: 'Immobilier',
    imageEmoji: '🏢',
    supply: 100,
    minted: 87,
  },
  {
    id: 'NFT-003',
    name: 'Pass Cosmétique VIP',
    tier: 'Bronze',
    priceKLT: 1500,
    benefits: ['Box trimestrielle Mark Kanich Cosmétique', 'Accès aux ventes flash', 'Programme de fidélité x2'],
    pillar: 'Luxe & Lifestyle',
    imageEmoji: '💄',
    supply: 1000,
    minted: 650,
  },
  {
    id: 'NFT-004',
    name: 'Pass Gouvernance Platinum',
    tier: 'Platinum',
    priceKLT: 100000,
    benefits: ['5x pouvoir de vote DAO', 'Accès direct au conseil KIIS Global', 'Partage des revenus Beldozac Finance'],
    pillar: 'Technologie & Finance',
    imageEmoji: '👑',
    supply: 20,
    minted: 12,
  },
];

export default function NFTAccessMarketplace() {
  const [selectedNFT, setSelectedNFT] = useState<AccessNFT | null>(null);
  const [userBalance] = useState(12500); // Solde $KLT de l'utilisateur

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Bronze': return 'border-orange-300 bg-orange-50 text-orange-700';
      case 'Silver': return 'border-gray-300 bg-gray-50 text-gray-700';
      case 'Gold': return 'border-klt-gold-400 bg-klt-gold-50 text-klt-gold-700';
      case 'Platinum': return 'border-klt-teal-400 bg-klt-teal-50 text-klt-teal-700';
      default: return 'border-gray-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-klt-paper rounded-2xl shadow-card">
      {/* En-tête */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-klt-teal-700 flex items-center gap-2">
          🎟️ Marketplace NFT • Tiers d'Accès
        </h2>
        <p className="text-gray-600 mt-1">
          Débloquez des avantages VIP exclusifs dans l'écosystème Maison Mark Kanich. Ces NFT sont vérifiables sur Solana.
        </p>
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-klt-teal-200 rounded-lg text-sm">
          <span className="text-gray-500">Votre solde :</span>
          <span className="font-bold text-klt-teal-700">{userBalance.toLocaleString()} $KLT</span>
        </div>
      </div>

      {/* Grille des NFTs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {NFT_TIERS.map((nft) => (
          <div 
            key={nft.id} 
            onClick={() => setSelectedNFT(nft)}
            className={`bg-white rounded-xl border-2 p-5 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 ${
              selectedNFT?.id === nft.id ? 'border-klt-teal-500 ring-2 ring-klt-teal-200' : 'border-gray-100'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="text-4xl">{nft.imageEmoji}</div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getTierColor(nft.tier)}`}>
                {nft.tier.toUpperCase()}
              </span>
            </div>
            
            <h3 className="font-bold text-gray-900 mb-1">{nft.name}</h3>
            <p className="text-xs text-gray-500 mb-4">{nft.pillar}</p>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Prix</span>
                <span className="font-semibold text-klt-teal-700">{nft.priceKLT.toLocaleString()} $KLT</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-klt-teal-500 h-1.5 rounded-full" 
                  style={{ width: `${(nft.minted / nft.supply) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] text-gray-500">
                <span>{nft.minted} mintés</span>
                <span>sur {nft.supply}</span>
              </div>
            </div>

            <button className="w-full py-2 bg-klt-ink text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition">
              Voir les avantages
            </button>
          </div>
        ))}
      </div>

      {/* Modal / Panneau de détail (Affiché quand un NFT est sélectionné) */}
      {selectedNFT && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedNFT(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="text-5xl">{selectedNFT.imageEmoji}</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedNFT.name}</h3>
                  <p className="text-sm text-gray-500">{selectedNFT.pillar} • Tier {selectedNFT.tier}</p>
                </div>
              </div>
              <button onClick={() => setSelectedNFT(null)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>

            <div className="bg-klt-teal-50 p-4 rounded-xl mb-6">
              <p className="text-xs font-semibold text-klt-teal-700 mb-2 uppercase tracking-wide">Avantages Exclusifs</p>
              <ul className="space-y-2">
                {selectedNFT.benefits.map((benefit, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-klt-teal-500 mt-0.5">✓</span> {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs text-gray-500">Prix d'achat</p>
                <p className="text-2xl font-bold text-klt-teal-700">{selectedNFT.priceKLT.toLocaleString()} $KLT</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Disponibilité</p>
                <p className="font-semibold text-gray-900">{selectedNFT.supply - selectedNFT.minted} restants</p>
              </div>
            </div>

            <button 
              className={`w-full py-3 rounded-xl font-bold text-white transition ${
                userBalance >= selectedNFT.priceKLT 
                  ? 'bg-klt-teal-600 hover:bg-klt-teal-500' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
              disabled={userBalance < selectedNFT.priceKLT}
            >
              {userBalance >= selectedNFT.priceKLT ? '🔐 Mint ce NFT (Solana)' : 'Solde insuffisant'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}