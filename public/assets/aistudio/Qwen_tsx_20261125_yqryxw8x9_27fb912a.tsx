// src/components/ReferralProgram.tsx
import React, { useState, useEffect } from 'react';

// Types basés sur votre table users (nettoyée)
interface ReferredUser {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  status: 'pending' | 'active' | 'paid';
  rewardAmount: number;
}

interface ReferralStats {
  totalReferred: number;
  pendingRewards: number;
  totalEarned: number;
}

export default function ReferralProgram() {
  const [stats, setStats] = useState<ReferralStats>({ totalReferred: 0, pendingRewards: 0, totalEarned: 0 });
  const [referredUsers, setReferredUsers] = useState<ReferredUser[]>([]);
  const [copied, setCopied] = useState(false);

  // Simule l'appel API vers votre backend (qui doit exclure les @test.com)
  useEffect(() => {
    // fetch('/api/referrals/my-stats').then(...)
    // Données mockées pour l'exemple visuel (basées sur vos vrais futurs utilisateurs)
    setStats({ totalReferred: 12, pendingRewards: 450, totalEarned: 1200 });
    setReferredUsers([
      { id: 1045, name: "Jean K.", email: "jean.k@example.ci", createdAt: "2026-11-10", status: "active", rewardAmount: 150 },
      { id: 1089, name: "Amina D.", email: "amina.d@example.ci", createdAt: "2026-11-18", status: "pending", rewardAmount: 0 },
    ]);
  }, []);

  const referralLink = `https://dashboard.markkanich.com/register?ref=USER_${1}`; // Remplacer 1 par l'ID réel

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-klt-paper rounded-2xl shadow-card">
      {/* En-tête */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-klt-teal-700 flex items-center gap-2">
          🦜 Programme de Parrainage KLT
        </h2>
        <p className="text-gray-600 mt-1">
          Invitez votre réseau à rejoindre l'écosystème Maison Mark Kanich et gagnez des récompenses en $KLT.
        </p>
      </div>

      {/* Cartes de Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard label="Parrainages Actifs" value={stats.totalReferred.toString()} icon="👥" color="bg-klt-teal-50 text-klt-teal-700" />
        <StatCard label="Récompenses en Attente" value={`${stats.pendingRewards} $KLT`} icon="⏳" color="bg-klt-gold-50 text-klt-gold-700" />
        <StatCard label="Total Gagné à Vie" value={`${stats.totalEarned} $KLT`} icon="🏆" color="bg-klt-orange-50 text-klt-orange-700" />
      </div>

      {/* Générateur de Lien */}
      <div className="bg-white p-6 rounded-xl border border-klt-teal-200 mb-8">
        <h3 className="font-semibold text-gray-800 mb-3">Votre Lien de Parrainage Unique</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-600 font-mono text-sm truncate">
            {referralLink}
          </div>
          <button
            onClick={handleCopy}
            className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 min-w-[140px]
              ${copied ? 'bg-green-500 text-white' : 'klt-btn-cta'}`}
          >
            {copied ? '✅ Copié !' : '📋 Copier le lien'}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          * Les récompenses sont versées automatiquement en $KLT lorsque votre filleul souscrit à un plan payant (ex: ImmoScale AI ou KIIS CashFlow).
        </p>
      </div>

      {/* Liste des Filleuls (Excluant les comptes @test.com côté backend) */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-semibold text-gray-800">Vos Filleuls Récents</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Nom</th>
                <th className="px-6 py-3">Date d'inscription</th>
                <th className="px-6 py-3">Statut</th>
                <th className="px-6 py-3 text-right">Récompense</th>
              </tr>
            </thead>
            <tbody>
              {referredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Aucun filleul pour le moment. Partagez votre lien !
                  </td>
                </tr>
              ) : (
                referredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 text-gray-600">{new Date(user.createdAt).toLocaleDateString('fr-FR')}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-klt-teal-600">
                      {user.rewardAmount > 0 ? `+${user.rewardAmount} $KLT` : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- Sous-composants pour la propreté du code ---

function StatCard({ label, value, icon, color }: { label: string; value: string; icon: string; color: string }) {
  return (
    <div className={`p-5 rounded-xl border border-gray-100 shadow-sm ${color}`}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-2xl">{icon}</span>
     9</div>
      <p className="text-sm opacity-80 mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    active: "bg-klt-teal-50 text-klt-teal-700 border-klt-teal-200",
    paid: "bg-green-100 text-green-800 border-green-200",
  };
  const labels = { pending: "En attente", active: "Actif", paid: "Récompensé" };
  
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
      {labels[status as keyof typeof labels]}
    </span>
  );
}