// src/components/VirtualVisaCard.tsx
import React, { useState } from 'react';

// Données mockées (à connecter à l'API du partenaire carte en Q4 2026)
const CARD_DATA = {
  cardNumber: '•••• •••• •••• 4242',
  holderName: 'ADAMA F. SHEICKNER',
  expiry: '12/28',
  cvv: '•••',
  kltBalance: 12500.00,
  fiatEquivalent: 8750.00, // Taux simulé
  isFrozen: false,
};

const TRANSACTIONS = [
  { id: 1, merchant: 'Mark Kanich Fashion', category: 'Luxe', amount: -450.00, date: '24 Nov 2026', icon: '👗' },
  { id: 2, merchant: 'ImmoScale AI (Abonnement)', category: 'SaaS', amount: -99.00, date: '22 Nov 2026', icon: '🏠' },
  { id: 3, merchant: 'Villagia Intercontinentale', category: 'Immobilier', amount: -1200.00, date: '18 Nov 2026', icon: '🏢' },
  { id: 4, merchant: 'Recharge $KLT', category: 'Top-up', amount: 5000.00, date: '15 Nov 2026', icon: '💰' },
];

export default function VirtualVisaCard() {
  const [isFrozen, setIsFrozen] = useState(CARD_DATA.isFrozen);
  const [showCvv, setShowCvv] = useState(false);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-klt-paper rounded-2xl shadow-card">
      {/* En-tête */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-klt-teal-700 flex items-center gap-2">💳 Carte Virtuelle KLT</h2>
          <p className="text-gray-600 text-sm mt-1">Payez dans le monde entier avec vos $KLT (Conversion temps réel)</p>
        </div>
        <span className="px-3 py-1 bg-klt-gold-400/20 text-klt-gold-700 text-xs font-bold rounded-full border border-klt-gold-400/30">
          VISA • Q4 2026
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Représentation visuelle de la carte */}
        <div className="lg:col-span-1">
          <div className={`relative w-full aspect-[1.586/1] rounded-2xl p-6 text-white shadow-2xl overflow-hidden transition-all duration-500 ${
            isFrozen ? 'bg-gray-800 grayscale' : 'bg-gradient-to-br from-klt-ink via-gray-900 to-klt-teal-900'
          }`}>
            {/* Motif de fond subtil */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-klt-gold-400/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-klt-teal-500/10 rounded-full blur-2xl"></div>

            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="flex justify-between items-start">
                <span className="text-xl font-bold italic tracking-wider text-klt-gold-400">KLT PAY</span>
                <span className="text-sm font-semibold">VISA</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-6 bg-klt-gold-400 rounded-md"></div>
                  <span className="text-xs text-gray-400">Chip</span>
                </div>
                <p className="text-lg font-mono tracking-widest">{CARD_DATA.cardNumber}</p>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase">Titulaire</p>
                  <p className="text-sm font-semibold tracking-wide">{CARD_DATA.holderName}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 uppercase">Expire</p>
                  <p className="text-sm font-semibold">{CARD_DATA.expiry}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions rapides */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <button 
              onClick={() => setIsFrozen(!isFrozen)}
              className={`py-2.5 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2 ${
                isFrozen ? 'bg-klt-teal-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {isFrozen ? '🔓 Dégeler' : '❄️ Geler'}
            </button>
            <button className="py-2.5 bg-gray-200 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-300 transition">
              👁️ Afficher CVV
            </button>
          </div>
        </div>

        {/* Solde et Historique */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cartes de solde */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-xl border border-klt-teal-100 shadow-sm">
              <p className="text-xs text-gray-500 mb-1">Solde $KLT</p>
              <p className="text-2xl font-bold text-klt-teal-700">{CARD_DATA.kltBalance.toLocaleString()} <span className="text-sm text-gray-400">KLT</span></p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-klt-gold-100 shadow-sm">
              <p className="text-xs text-gray-500 mb-1">Équivalent Fiat (Est.)</p>
              <p className="text-2xl font-bold text-klt-gold-600">${CARD_DATA.fiatEquivalent.toLocaleString()} <span className="text-sm text-gray-400">USD</span></p>
            </div>
          </div>

          {/* Historique des transactions */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h3 className="font-semibold text-gray-800 text-sm">Transactions Récentes</h3>
              <button className="text-xs text-klt-teal-600 hover:underline">Voir tout</button>
            </div>
            <div className="divide-y divide-gray-100">
              {TRANSACTIONS.map((tx) => (
                <div key={tx.id} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-klt-teal-50 flex items-center justify-center text-lg">
                      {tx.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{tx.merchant}</p>
                      <p className="text-xs text-gray-500">{tx.date} • {tx.category}</p>
                    </div>
                  </div>
                  <span className={`font-bold text-sm ${tx.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)} $
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}