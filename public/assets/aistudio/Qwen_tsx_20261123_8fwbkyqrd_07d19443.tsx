// components/SolanaWallet.tsx
import { FC, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

// Styles par défaut de Solana (à importer dans votre _app.tsx ou layout.tsx)
import '@solana/wallet-adapter-react-ui/styles.css';

export const SolanaWallet: FC<{ children: React.ReactNode }> = ({ children }) => {
  // Utiliser 'mainnet-beta' pour la production, 'devnet' pour les tests
  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="flex flex-col items-center p-4 bg-gray-900 text-white rounded-lg">
            <h3 className="text-lg font-bold mb-4 text-teal-400">Connexion Web3 KLT</h3>
            <WalletMultiButton className="!bg-teal-600 hover:!bg-teal-500 !rounded-lg !font-semibold" />
            <div className="mt-4 w-full">{children}</div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};