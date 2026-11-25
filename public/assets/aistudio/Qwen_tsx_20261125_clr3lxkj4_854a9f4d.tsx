// src/components/CardRecharge.tsx
import React, { useState, useMemo } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { BN, Program, AnchorProvider, web3 } from '@coral-xyz/anchor';
import { getAssociatedTokenAddressSync, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { useNotification } from './NotificationSystem'; // Votre système de notifications

// IDL et Program ID (à générer via `anchor build` et placer dans src/idl/)
import idl from '../idl/klt_card_escrow.json';
const PROGRAM_ID = new PublicKey(process.env.VITE_KLT_ESCROW_PROGRAM_ID!);
const KLT_MINT = new PublicKey(process.env.VITE_KLT_MINT_ADDRESS!);

export default function CardRecharge() {
  const { publicKey, sendTransaction, wallet } = useWallet();
  const { connection } = useConnection();
  const { addNotification } = useNotification();
  
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentBalance, setCurrentBalance] = useState({ klt: 0, fiat: 0 });

  // Initialisation du provider Anchor
  const provider = useMemo(() => {
    if (!wallet || !connection) return null;
    return new AnchorProvider(connection, wallet as any, { commitment: 'confirmed' });
  }, [wallet, connection]);

  const program = useMemo(() => {
    if (!provider) return null;
    return new Program(idl as any, PROGRAM_ID, provider);
  }, [provider]);

  // Dérivation des PDA (Program Derived Addresses)
  const [vaultPda] = useMemo(() => {
    if (!publicKey) return [null, null];
    return PublicKey.findProgramAddressSync(
      [Buffer.from('vault'), publicKey.toBuffer()],
      PROGRAM_ID
    );
  }, [publicKey]);

  const userTokenAccount = useMemo(() => {
    if (!publicKey) return null;
    return getAssociatedTokenAddressSync(KLT_MINT, publicKey);
  }, [publicKey]);

  const vaultTokenAccount = useMemo(() => {
    if (!vaultPda) return null;
    return getAssociatedTokenAddressSync(KLT_MINT, vaultPda);
  }, [vaultPda]);

  const handleRecharge = async () => {
    if (!publicKey || !program || !amount || parseFloat(amount) <= 0) {
      addNotification({ type: 'warning', title: 'Montant invalide', message: 'Veuillez entrer un montant supérieur à 0.', duration: 4000 });
      return;
    }

    setIsProcessing(true);
    try {
      // 1. Convertir le montant en lamports du token (6 décimales)
      const amountLamports = new BN(parseFloat(amount) * 10 ** 6);

      // 2. Construire la transaction Anchor (appel à deposit_klt)
      const tx = await program.methods
        .depositKlt(amountLamports)
        .accounts({
          user: publicKey,
          vault: vaultPda,
          userTokenAccount: userTokenAccount,
          vaultTokenAccount: vaultTokenAccount,
          mint: KLT_MINT,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .transaction();

      // 3. Envoyer la transaction au wallet pour signature
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
      tx.recentBlockhash = blockhash;
      tx.feePayer = publicKey;

      const signedTx = await wallet.adapter.signTransaction(tx);
      const txSignature = await connection.sendRawTransaction(signedTx.serialize());
      
      addNotification({ type: 'info', title: 'Transaction envoyée', message: 'Confirmation en cours sur Solana...', duration: 3000 });

      // 4. Attendre la confirmation
      await connection.confirmTransaction({
        signature: txSignature,
        blockhash,
        lastValidBlockHeight,
      }, 'confirmed');

      addNotification({ type: 'info', title: 'Transaction confirmée', message: 'Mise à jour du solde carte...', duration: 3000 });

      // 5. Appeler le backend pour créditer le solde fiat
      const response = await fetch('/api/card/recharge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({
          txSignature,
          amountKLT: parseFloat(amount),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setCurrentBalance({
          klt: parseFloat(data.newBalances.kltLocked) / 10 ** 6,
          fiat: parseFloat(data.newBalances.fiatUSD),
        });
        addNotification({ type: 'success', title: 'Rechargement réussi !', message: `${data.newBalances.fiatUSD} $ ajoutés à votre carte.`, duration: 5000 });
        setAmount('');
      } else {
        throw new Error(data.error || 'Erreur backend');
      }

    } catch (error: any) {
      console.error('Erreur rechargement:', error);
      addNotification({ 
        type: 'error', 
        title: 'Échec du rechargement', 
        message: error.message || 'La transaction a été annulée ou a échoué.', 
        duration: 6000 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!publicKey) {
    return (
      <div className="p-6 bg-klt-ink rounded-2xl border border-klt-teal-500/30 text-center">
        <p className="text-gray-400 mb-4">Connectez votre wallet Solana pour recharger votre carte.</p>
        <button className="klt-btn-cta px-6 py-3 rounded-lg font-semibold">🔗 Connecter Wallet</button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-klt-ink rounded-2xl border border-klt-teal-500/30 text-white">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-klt-teal-400">💰 Recharger la Carte</h3>
        <div className="text-right">
          <p className="text-xs text-gray-400">Solde Carte</p>
          <p className="text-xl font-bold text-klt-gold-400">${currentBalance.fiat.toFixed(2)}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Montant en $KLT</label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-klt-teal-500 transition"
              disabled={isProcessing}
            />
            <button 
              onClick={() => setAmount((currentBalance.klt).toString())}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-klt-teal-400 hover:text-klt-teal-300 font-semibold"
            >
              MAX
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Taux estimé : 1 $KLT ≈ 0.70 $ • Min: 100 $KLT
          </p>
        </div>

        <button
          onClick={handleRecharge}
          disabled={isProcessing || !amount || parseFloat(amount) <= 0}
          className="w-full py-3 bg-klt-teal-600 hover:bg-klt-teal-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold rounded-lg transition flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Traitement en cours...
            </>
          ) : (
            '⚡ Recharger la Carte'
          )}
        </button>

        <div className="pt-4 border-t border-gray-800">
          <p className="text-xs text-gray-500 text-center">
            🔒 Vos $KLT sont verrouillés dans le Smart Contract Anchor. 
            Vous pouvez les retirer à tout moment via la section "Retrait".
          </p>
        </div>
      </div>
    </div>
  );
}