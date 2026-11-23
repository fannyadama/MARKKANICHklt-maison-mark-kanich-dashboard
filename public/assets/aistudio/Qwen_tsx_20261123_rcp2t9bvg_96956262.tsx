// hooks/useWeb3Feature.ts
import { useState, useEffect } from 'react';

export function useWeb3Feature() {
  const [globalEnabled, setGlobalEnabled] = useState(false);
  const [userEnabled, setUserEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Le kill-switch admin est-il ON ?
    fetch('/api/flags/FEATURE_WEB3')
      .then(r => r.json())
      .then(d => setGlobalEnabled(d.value))
      // 2. L'utilisateur a-t-il activé le mode Web3 ?
      .then(() => fetch('/api/users/me/preferences'))
      .then(r => r.json())
      .then(d => setUserEnabled(d.web3ModeEnabled))
      .catch(() => setGlobalEnabled(false)) // fail-safe : OFF si erreur
      .finally(() => setLoading(false));
  }, []);

  // Le wallet ne s'affiche QUE si admin ON ET utilisateur ON
  return { showWallet: globalEnabled && userEnabled, loading, setUserEnabled };
}