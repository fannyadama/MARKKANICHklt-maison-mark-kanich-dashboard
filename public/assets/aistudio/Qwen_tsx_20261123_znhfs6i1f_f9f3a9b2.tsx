// components/OptInWallet.tsx
import { lazy, Suspense, useState } from 'react';
import { useWeb3Feature } from '../hooks/useWeb3Feature';

// ⚠️ Import DYNAMIQUE : @solana/* n'est chargé QUE si l'utilisateur active le mode
const KLTDashboardWallet = lazy(() => import('./KLTDashboardWallet'));

export default function OptInWallet() {
  const { showWallet, loading, setUserEnabled } = useWeb3Feature();
  const [error, setError] = useState(false);

  if (loading) return null;

  // ---- ÉTAT 1 : Mode Web3 NON activé → on propose une carte discrète (pas le wallet) ----
  if (!showWallet) {
    return (
      <div className="p-4 bg-gray-50 border border-dashed border-teal-300 rounded-lg text-sm">
        <p className="text-gray-600">
          🦜 <strong>Mode Web3 KLT</strong> — Suivez vos actifs $KLT, le staking 15% APY et la bonding curve Pump.fun.
        </p>
        <button
          onClick={() => {
            fetch('/api/users/me/preferences', {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ web3ModeEnabled: true }),
            }).then(() => setUserEnabled(true));
          }}
          className="mt-2 px-3 py-1.5 bg-teal-600 text-white rounded-md hover:bg-teal-500"
        >
          Activer le mode Web3
        </button>
      </div>
    );
  }

  // ---- ÉTAT 2 : Mode activé → on monte le wallet en lazy + ErrorBoundary ----
  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
        ⚠️ Module Web3 indisponible. Le reste du dashboard fonctionne normalement.
      </div>
    );
  }

  return (
    <Suspense fallback={<div className="p-4 animate-pulse bg-gray-100 rounded-lg">Chargement du wallet…</div>}>
      <div className="error-boundary-fallback" onError={() => setError(true)}>
        <KLTDashboardWallet />
      </div>
    </Suspense>
  );
}