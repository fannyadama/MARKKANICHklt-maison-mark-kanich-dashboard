// components/KLTDashboardWallet.tsx
import { FC, useMemo, useEffect, useState } from 'react';
import { 
  ConnectionProvider, 
  WalletProvider, 
  useConnection, 
  useWallet 
} from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl, PublicKey } from '@solana/web3.js';
import { getAccount } from '@solana/spl-token';
import '@solana/wallet-adapter-react-ui/styles.css';

// ⚠️ REMPLACEZ CETTE ADRESSE PAR LA VRAIE ADRESSE DU TOKEN $KLT APRÈS L'IDO PUMP.FUN
const KLT_MINT_ADDRESS = "VOTRE_ADRESSE_MINT_KLT_ICI"; 

const WalletBalanceDisplay: FC = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [kltBalance, setKltBalance] = useState<number>(0);
  const [solBalance, setSolBalance] = useState<number>(0);

  useEffect(() => {
    if (!publicKey || !connection) return;

    const fetchBalances = async () => {
      try {
        // 1. Récupérer le solde SOL natif
        const solBal = await connection.getBalance(publicKey);
        setSolBalance(solBal / 1e9);

        // 2. Récupérer le solde $KLT (SPL Token)
        if (KLT_MINT_ADDRESS !== "VOTRE_ADRESSE_MINT_KLT_ICI") {
          const mintPublicKey = new PublicKey(KLT_MINT_ADDRESS);
          // Trouver l'adresse du compte token associé (ATA)
          const associatedToken = await getAccount(
            connection, 
            // Note: En prod, utilisez findAssociatedTokenAddress pour être plus robuste
            mintPublicKey, 
            publicKey
          );
          // Convertir les décimales (généralement 6 ou 9 pour les tokens SPL)
          const decimals = 6; 
          setKltBalance(Number(associatedToken.amount) / Math.pow(10, decimals));
        }
      } catch (error) {
        console.error("Erreur de lecture des soldes:", error);
      }
    };

    fetchBalances();
    // Rafraîchir toutes les 10 secondes pour le "temps réel"
    const interval = setInterval(fetchBalances, 10000);
    return () => clearInterval(interval);
  }, [publicKey, connection]);

  if (!publicKey) {
    return (
      <div className="flex flex-col items-center p-6 bg-gray-900 rounded-xl border border-teal-500/30">
        <h3 className="text-xl font-bold text-white mb-4">Tableau de Bord Web3 KLT</h3>
        <WalletMultiButton className="!bg-teal-600 hover:!bg-teal-500 !rounded-lg !font-semibold !text-white" />
        <p className="text-gray-400 text-sm mt-3">Connectez votre wallet pour voir vos actifs $KLT et SOL.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 rounded-xl border border-teal-500/30 text-white">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-teal-400">Mes Actifs KLT</h3>
        <WalletMultiButton className="!bg-gray-800 hover:!bg-gray-700 !rounded-lg !text-sm" />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg">
          <p className="text-gray-400 text-sm">Solde $KLT</p>
          <p className="text-2xl font-bold text-teal-300">
            {kltBalance.toLocaleString()} <span className="text-sm text-gray-500">KLT</span>
          </p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <p className="text-gray-400 text-sm">Solde SOL</p>
          <p className="text-2xl font-bold text-yellow-400">
            {solBalance.toFixed(4)} <span className="text-sm text-gray-500">SOL</span>
          </p>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-gray-500 text-center">
        Wallet: {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
      </div>
    </div>
  );
};

// Composant Wrapper principal à intégrer dans votre page Dashboard
export const KLTDashboardWallet: FC<{ children?: React.ReactNode }> = ({ children }) => {
  const network = WalletAdapterNetwork.Mainnet; // Mettre 'Devnet' pour les tests
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletBalanceDisplay />
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};