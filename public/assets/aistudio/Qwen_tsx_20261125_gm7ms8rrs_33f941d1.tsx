// src/context/KLTStoreContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';

interface WalletContextType {
  isConnecting: boolean;
  connectionError: string | null;
  handleConnect: () => Promise<void>;
  walletAddress: string | null;
}

const KLTStoreContext = createContext<WalletContextType | undefined>(undefined);

export const KLTStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { connection } = useConnection();
  const { connect, disconnect, publicKey, wallet } = useWallet();
  
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const handleConnect = useCallback(async () => {
    setIsConnecting(true);
    setConnectionError(null);

    try {
      // Vérification préventive : l'utilisateur a-t-il un wallet sélectionné ?
      if (!wallet) {
        throw new Error("Veuillez d'abord sélectionner un portefeuille (Phantom, Solflare, etc.).");
      }

      // Tentative de connexion avec timeout pour éviter les blocages infinis
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Délai de connexion dépassé. Vérifiez votre extension.")), 10000)
      );

      await Promise.race([connect(), timeoutPromise]);
      
      // Vérification post-connexion
      if (!publicKey) {
        throw new Error("Connexion établie, mais aucune adresse publique détectée.");
      }

    } catch (error: any) {
      console.error("Erreur de connexion wallet:", error);
      // Message utilisateur convivial, pas de crash de l'app
      setConnectionError(error.message || "Impossible de se connecter au portefeuille. Veuillez réessayer.");
    } finally {
      setIsConnecting(false);
    }
  }, [connect, wallet, publicKey]);

  return (
    <KLTStoreContext.Provider value={{ 
      isConnecting, 
      connectionError, 
      handleConnect, 
      walletAddress: publicKey ? publicKey.toBase58() : null 
    }}>
      {children}
    </KLTStoreContext.Provider>
  );
};

export const useKLTWallet = () => {
  const context = useContext(KLTStoreContext);
  if (!context) throw new Error("useKLTWallet doit être utilisé dans un KLTStoreProvider");
  return context;
};