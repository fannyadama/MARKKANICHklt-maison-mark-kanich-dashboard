// src/components/PumpFunBondingCurveWidget.tsx
import React, { useState, useEffect } from 'react';

// ⚠️ REMPLACEZ cette valeur par l'adresse réelle du Mint $KLT après sa création
const KLT_MINT_ADDRESS = import.meta.env.VITE_KLT_MINT_ADDRESS || "11111111111111111111111111111111";

// Constantes issues du Livre Blanc v3.1.0
const RAYDIUM_MIGRATION_THRESHOLD_SOL = 85; // Seuil de migration automatique
const TARGET_MARKET_CAP_USD = 65000; // ~65k $ à la complétion de la courbe

interface CurveData {
  solRaised: number;
  marketCapUsd: number;
  progressPercent: number;
  isMigrated: boolean;
}

export default function PumpFunBondingCurveWidget() {
  const [data, setData] = useState<CurveData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCurveData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Note : L'API publique de Pump.fun peut avoir des restrictions CORS en frontend pur.
        // En production, il est recommandé de passer par votre propre backend proxy 
        // ex: fetch('/api/pumpfun/curve?mint=' + KLT_MINT_ADDRESS)
        const response = await fetch(`https://frontend-api.pump.fun/coins/${KLT_MINT_ADDRESS}`);
        
        if (!response.ok) {
          throw new Error(`Erreur API: ${response.status}`);
        }

        const json = await response.json();
        
        // Conversion des lamports en SOL (1 SOL = 1e9 lamports)
        const solRaised = (json.virtualSolReserves || 0) / 1e9;
        const progressPercent = Math.min((solRaised / RAYDIUM_MIGRATION_THRESHOLD_SOL) * 100, 100);
        
        // Estimation simplifiée du Market Cap (ajuster selon la formule exacte de la courbe)
        const marketCapUsd = solRaised * (TARGET_MARKET_CAP_USD / RAYDIUM_MIGRATION_THRESHOLD_SOL);

        if (isMounted) {
          setData({
            solRaised,
            marketCapUsd,
            progressPercent,
            isMigrated: progressPercent >= 100
          });
        }
      } catch (err: any) {
        console.error("Erreur de récupération de la bonding curve:", err);
        if (isMounted) {
          // Fallback gracieux pour la démo si l'API échoue (CORS ou token non encore créé)
          setError("Données en cours de synchronisation ou token non encore actif sur Pump.fun.");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchCurveData();
    // Rafraîchissement toutes les 15 secondes pour le "temps réel"
    const interval = setInterval(fetchCurveData, 15000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // --- ÉTAT 1 : Chargement ---
  if (isLoading) {
    return (
      <div className="p-6 bg-klt-ink rounded-2xl border border-klt-teal-500/20 animate-pulse">
        <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-700 rounded w-full mb-6"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-16 bg-gray-700 rounded"></div>
          <div className="h-16 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  // --- ÉTAT 2 : Erreur ou Token non encore lancé ---
  if (error || !data) {
    return (
      <div className="p-6 bg-klt-ink rounded-2xl border border-klt-orange-500/30 text-center">
        <div className="text-3xl mb-3">⏳</div>
        <h3 className="text-lg font-bold text-white mb-2">Lancement à venir</h3>
        <p className="text-sm text-gray-400 mb-4">{error || "Le token $KLT n'est pas encore actif sur la bonding curve."}</p>
        <a 
          href="https://pump.fun" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-klt-teal-600 hover:bg-klt-teal-500 text-white text-sm font-semibold rounded-lg transition"
        >
          Voir sur Pump.fun ↗
        </a>
      </div>
    );
  }

  // --- ÉTAT 3 : Données affichées (Succès) ---
  return (
    <div className="p-6 bg-klt-ink rounded-2xl border border-klt-teal-500/30 shadow-card text-white relative overflow-hidden">
      {/* Effet de fond subtil */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-klt-teal-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>

      {/* En-tête */}
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <h3 className="text-lg font-bold text-klt-teal-400 flex items-center gap-2">
            Progression vers Raydium
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Migration automatique et burn LP à {RAYDIUM_MIGRATION_THRESHOLD_SOL} SOL
          </p>
        </div>
        <span className="px-2.5 py-1 bg-klt-teal-500/15 text-klt-teal-300 text-xs font-bold rounded-full border border-klt-teal-500/30 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-klt-teal-400 animate-pulse"></span>
          LIVE
        </span>
      </div>

      {/* Barre de progression */}
      <div className="relative w-full h-5 bg-gray-800 rounded-full overflow-hidden mb-6 border border-gray-700">
        <div 
          className="absolute top-0 left-0 h-full klt-progress transition-all duration-1000 ease-out flex items-center justify-end pr-2"
          style={{ width: `${data.progressPercent}%` }}
        >
          {data.progressPercent > 15 && (
            <span className="text-[10px] font-bold text-klt-ink">{data.progressPercent.toFixed(1)}%</span>
          )}
        </div>
        {/* Marqueur du seuil de migration */}
        <div 
          className="absolute top-0 h-full w-0.5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] z-10"
          style={{ left: '100%' }}
          title="Seuil de migration Raydium"
        ></div>
      </div>

      {/* Statistiques en grille */}
      <div className="grid grid-cols-2 gap-3 relative z-10">
        <div className="bg-gray-800/60 p-4 rounded-xl border border-gray-700/50">
          <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
            💰 SOL Collectés
          </p>
          <p className="text-2xl font-bold text-white">
            {data.solRaised.toFixed(2)} <span className="text-sm text-gray-500 font-normal">SOL</span>
          </p>
        </div>
        
        <div className="bg-gray-800/60 p-4 rounded-xl border border-gray-700/50">
          <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
            📈 Market Cap (Est.)
          </p>
          <p className="text-2xl font-bold text-klt-gold-400">
            {data.marketCapUsd.toLocaleString('en-US', { maximumFractionDigits: 0 })} <span className="text-sm text-gray-500 font-normal">$</span>
          </p>
        </div>
      </div>

      {/* Pied de carte : Transparence radicale */}
      <div className="mt-5 pt-4 border-t border-gray-800 flex justify-between items-center relative z-10">
        <p className="text-[11px] text-gray-500">
          Données vérifiables on-chain • Liquidité verrouillée
        </p>
        <a 
          href={`https://solscan.io/token/${KLT_MINT_ADDRESS}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[11px] text-klt-teal-400 hover:text-klt-teal-300 flex items-center gap-1 transition"
        >
          Voir sur Solscan ↗
        </a>
      </div>
    </div>
  );
}