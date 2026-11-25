// src/components/ReferralProgram.tsx
import React, { useState, useEffect } from 'react';

interface ReferredUser {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  status: 'pending' | 'active' | 'paid';
  rewardAmount: number;
}

export default function ReferralProgram() {
  const [stats, setStats] = useState({ totalReferred: 0, pendingRewards: 0, totalEarned: 0 });
  const [referredUsers, setReferredUsers] = useState<ReferredUser[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Simulation d'appel API. 
    // ⚠️ CÔTÉ BACKEND : La requête SQL DOIT inclure : 
    // WHERE referrer_id = $userId AND email NOT LIKE '%@test.com' AND id NOT IN (720001, 720002, 720003, 720004)
    setStats({ totalReferred: 12, pendingRewards: 450, totalEarned: 1200 });
    setReferredUsers([
      { id: 1045, name: "Jean K.", email: "jean.k@example.ci", createdAt: "2026-11-10", status: "active", rewardAmount: 150 },
      { id: 1089, name: "Amina D.", email: "amina.d@example.ci", createdAt: "2026-11-18", status: "pending", rewardAmount: 0 },
    ]);
  }, []);

  const referralLink = `https://dashboard.markkanich.com/register?ref=USER_1`; // Remplacer 1 par l'ID réel de l'admin

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-lg border border-teal-100">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-teal-700 flex items-center gap-2">🦜 Programme de Parrainage KLT</h2>
        <p className="text-gray-600 mt-1">Invitez votre réseau à rejoindre l'écosystème Maison Mark Kanich et gagnez des récompenses en $KLT.</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-xl bg-teal-50 border border-teal-100">
          <p className="text-sm text-teal-600 mb-1">Parrainages Actifs</p>
          <p className="text-2xl font-bold text-teal-800">{stats.totalReferred}</p>
        </div>
        <div className="p-5 rounded-xl bg-yellow-50 border border-yellow-100">
          <p className="text-sm text-yellow-600 mb-1">Récompenses en Attente</p>
          <p className="text-2xl font-bold text-yellow-800">{stats.pendingRewards} $KLT</p>
        </div>
        <div className="p-5 rounded-xl bg-orange-50 border border-orange-100">
          <p className="text-sm text-orange-600 mb-1">Total Gagné à Vie</p>
          <p className="text-2xl font-bold text-orange-800">{stats.totalEarned} $KLT</p>
        </div>
      </div>

      {/* Lien de parrainage */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8">
        <h3 className="font-semibold text-gray-800 mb-3">Votre Lien de Parrainage Unique</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-600 font-mono text-sm truncate">
            {referralLink}
          </div>
          <button
            onClick={handleCopy}
            className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 min-w-[140px] text-white
              ${copied ? 'bg-green-500' : 'bg-orange-500 hover:bg-orange-600'}`}
          >
            {copied ? '✅ Copié !' : '📋 Copier le lien'}
          </button>
        </div>
      </div>

      {/* Tableau des filleuls (Les comptes @test.com sont exclus côté backend) */}
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
                <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Aucun filleul pour le moment.</td></tr>
              ) : (
                referredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 text-gray-600">{new Date(user.createdAt).toLocaleDateString('fr-FR')}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                        user.status === 'active' ? 'bg-teal-50 text-teal-700 border-teal-200' : 
                        user.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                        'bg-green-50 text-green-700 border-green-200'
                      }`}>
                        {user.status === 'active' ? 'Actif' : user.status === 'pending' ? 'En attente' : 'Récompensé'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-teal-600">
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