// components/PumpFunBondingCurve.tsx
import { useEffect, useState } from 'react';

// ⚠️ Remplacez par l'adresse Mint $KLT post-création sur Pump.fun
const KLT_MINT_ADDRESS = "VOTRE_ADRESSE_MINT_KLT_ICI"; 
const RAYDIUM_MIGRATION_THRESHOLD_SOL = 85; // Seuil standard Pump.fun

interface BondingCurveData {
  totalSupply: number;
  virtualSolReserves: number; // SOL actuellement dans la bonding curve
  virtualTokenReserves: number;
  marketCapSol: number;
}

export default function PumpFunBondingCurve() {
  const [data, setData] = useState<BondingCurveData | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCurveData = async () => {
      try {
        // API publique de Pump.fun pour récupérer les réserves de la bonding curve
        const response = await fetch(`https://frontend-api.pump.fun/coins/${KLT_MINT_ADDRESS}`);
        if (!response.ok) throw new Error('API Pump.fun indisponible');
        
        const json = await response.json();
        
        // Conversion des lamports en SOL (1 SOL = 1e9 lamports)
        const solRaised = json.virtualSolReserves / 1e9; 
        const currentProgress = Math.min((solRaised / RAYDIUM_MIGRATION_THRESHOLD_SOL) * 100, 100);

        setData({
          totalSupply: json.totalSupply,
          virtualSolReserves: solRaised,
          virtualTokenReserves: json.virtualTokenReserves,
          marketCapSol: solRaised // Simplification pour l'affichage
        });
        setProgress(currentProgress);
      } catch (err) {
        console.error(err);
        setError(true);
      }
    };

    fetchCurveData();
    const interval = setInterval(fetchCurveData, 15000); // Refresh toutes les 15s
    return () => clearInterval(interval);
  }, []);

  if (error) return <div className="p-4 text-red-500 text-sm">⚠️ Impossible de charger la bonding curve.</div>;
  if (!data) return <div className="p-4 animate-pulse bg-gray-100 rounded-lg">Chargement des données Pump.fun...</div>;

  return (
    <div className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-teal-500/20 text-white shadow-xl">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-teal-400">Progression Raydium</h3>
          <p className="text-xs text-gray-400 mt-1">Migration automatique à {RAYDIUM_MIGRATION_THRESHOLD_SOL} SOL</p>
        </div>
        <span className="px-3 py-1 bg-teal-500/20 text-teal-300 text-xs font-semibold rounded-full border border-teal-500/30">
          LIVE
        </span>
      </div>

      {/* Barre de progression */}
      <div className="relative w-full h-4 bg-gray-700 rounded-full overflow-hidden mb-4">
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-teal-500 to-yellow-400 transition-all duration-1000 ease-out"
          style={{ width: `${progress}%` }}
        />
        {/* Marqueur du seuil */}
        <div className="absolute top-0 right-0 h-full w-1 bg-white/50" title="Seuil Raydium" />
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="bg-gray-800/50 p-3 rounded-lg">
          <p className="text-xs text-gray-400 mb-1">SOL Collectés</p>
          <p className="text-xl font-bold text-white">{data.virtualSolReserves.toFixed(2)} <span className="text-sm text-gray-500">SOL</span></p>
        </div>
        <div className="bg-gray-800/50 p-3 rounded-lg">
          <p className="text-xs text-gray-400 mb-1">Vers Raydium</p>
          <p className="text-xl font-bold text-yellow-400">{progress.toFixed(1)}<span className="text-sm">%</span></p>
        </div>
      </div>

      <p className="text-[10px] text-gray-500 text-center mt-4">
        Données vérifiables sur Solscan • Liquidity verrouillée et brûlée auto.
      </p>
    </div>
  );
}