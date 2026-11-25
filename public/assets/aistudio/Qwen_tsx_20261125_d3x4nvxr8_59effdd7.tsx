// src/components/DAOGovernance.tsx
import React, { useState, useEffect } from 'react';

interface Proposal {
  id: string;
  title: string;
  description: string;
  category: 'Technologie' | 'Finance' | 'Immobilier' | 'Luxe' | 'Communauté';
  status: 'Active' | 'Passed' | 'Rejected' | 'Pending';
  votesFor: number;
  votesAgainst: number;
  votesAbstain: number;
  endDate: string;
  proposer: string;
}

// Données mockées (à remplacer par des appels API vers votre smart contract de gouvernance)
const MOCK_PROPOSALS: Proposal[] = [
  {
    id: 'PROP-001',
    title: 'Intégration de Paystack pour les paiements Mobile Money en Afrique de l\'Ouest',
    description: 'Proposition d\'intégrer Paystack comme PSP principal pour faciliter les paiements en FCFA via Wave, Orange Money et MTN MoMo, en complément de Paddle pour les cartes internationales.',
    category: 'Finance',
    status: 'Active',
    votesFor: 1250000,
    votesAgainst: 45000,
    votesAbstain: 12000,
    endDate: '2026-12-15T23:59:59Z',
    proposer: '0x742d...8f3a',
  },
  {
    id: 'PROP-002',
    title: 'Lancement du programme de bourses Beldozac Finance pour 50 startups ivoiriennes',
    description: 'Allocation de 5 000 000 $KLT du pool Communauté & Partenariats pour financer 50 startups en phase seed dans les secteurs de l\'AgriTech et de la FinTech.',
    category: 'Finance',
    status: 'Active',
    votesFor: 890000,
    votesAgainst: 120000,
    votesAbstain: 8000,
    endDate: '2026-12-20T23:59:59Z',
    proposer: '0x9a1b...2c4d',
  },
  {
    id: 'PROP-003',
    title: 'Partenariat avec Villagia Intercontinentale pour la tokenisation du projet "Résidence Iroko"',
    description: 'Utilisation de la blockchain Solana pour tokeniser 20% du projet immobilier "Résidence Iroko" à Yopougon, permettant l\'investissement fractionné via $KLT.',
    category: 'Immobilier',
    status: 'Passed',
    votesFor: 2100000,
    votesAgainst: 80000,
    votesAbstain: 15000,
    endDate: '2026-11-10T23:59:59Z',
    proposer: '0x3f5e...7g9h',
  },
];

export default function DAOGovernance() {
  const [proposals, setProposals] = useState<Proposal[]>(MOCK_PROPOSALS);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [userVote, setUserVote] = useState<'for' | 'against' | 'abstain' | null>(null);
  const [votingPower, setVotingPower] = useState(15000); // Solde $KLT de l'utilisateur (mock)

  const handleVote = (proposalId: string, voteType: 'for' | 'against' | 'abstain') => {
    // Logique de vote (à connecter au smart contract de gouvernance)
    console.log(`Vote ${voteType} pour la proposition ${proposalId} avec ${votingPower} $KLT`);
    setUserVote(voteType);
    
    // Mise à jour optimiste de l'UI
    setProposals((prev) =>
      prev.map((p) => {
        if (p.id === proposalId) {
          return {
            ...p,
            votesFor: voteType === 'for' ? p.votesFor + votingPower : p.votesFor,
            votesAgainst: voteType === 'against' ? p.votesAgainst + votingPower : p.votesAgainst,
            votesAbstain: voteType === 'abstain' ? p.votesAbstain + votingPower : p.votesAbstain,
          };
        }
        return p;
      })
    );
  };

  const calculateProgress = (votesFor: number, votesAgainst: number, votesAbstain: number) => {
    const total = votesFor + votesAgainst + votesAbstain;
    if (total === 0) return { for: 0, against: 0, abstain: 0 };
    return {
      for: (votesFor / total) * 100,
      against: (votesAgainst / total) * 100,
      abstain: (votesAbstain / total) * 100,
    };
  };

  const getStatusColor = (status: Proposal['status']) => {
    switch (status) {
      case 'Active': return 'bg-klt-teal-100 text-klt-teal-700 border-klt-teal-200';
      case 'Passed': return 'bg-green-100 text-green-700 border-green-200';
      case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
      case 'Pending': return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow-lg border border-teal-100">
      {/* En-tête */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-teal-700 flex items-center gap-2">
            🗳️ Gouvernance DAO Maison Mark Kanich
          </h2>
          <p className="text-gray-600 mt-1">
            Participez aux décisions stratégiques de l'écosystème avec vos $KLT
          </p>
        </div>
        <div className="bg-teal-50 px-4 py-2 rounded-lg border border-teal-200">
          <p className="text-xs text-teal-600">Votre pouvoir de vote</p>
          <p className="text-xl font-bold text-teal-800">{votingPower.toLocaleString()} $KLT</p>
        </div>
      </div>

      {/* Liste des propositions */}
      <div className="space-y-4">
        {proposals.map((proposal) => {
          const progress = calculateProgress(proposal.votesFor, proposal.votesAgainst, proposal.votesAbstain);
          const isSelected = selectedProposal?.id === proposal.id;

          return (
            <div
              key={proposal.id}
              className={`border rounded-xl p-5 transition-all cursor-pointer ${
                isSelected ? 'border-teal-500 bg-teal-50 shadow-md' : 'border-gray-200 bg-white hover:border-teal-300'
              }`}
              onClick={() => setSelectedProposal(proposal)}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(proposal.status)}`}>
                      {proposal.status}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                      {proposal.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{proposal.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">Proposé par {proposal.proposer} • Fin: {new Date(proposal.endDate).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>

              {/* Barre de progression des votes */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Pour: {proposal.votesFor.toLocaleString()}</span>
                  <span>Contre: {proposal.votesAgainst.toLocaleString()}</span>
                  <span>Abstention: {proposal.votesAbstain.toLocaleString()}</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden flex">
                  <div className="h-full bg-teal-500" style={{ width: `${progress.for}%` }}></div>
                  <div className="h-full bg-red-500" style={{ width: `${progress.against}%` }}></div>
                  <div className="h-full bg-gray-400" style={{ width: `${progress.abstain}%` }}></div>
                </div>
              </div>

              {/* Boutons de vote (affichés si la proposition est sélectionnée et active) */}
              {isSelected && proposal.status === 'Active' && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-3">Votre vote :</p>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleVote(proposal.id, 'for'); }}
                      disabled={userVote !== null}
                      className={`py-2 px-4 rounded-lg font-semibold transition ${
                        userVote === 'for' ? 'bg-teal-500 text-white' : 'bg-teal-100 text-teal-700 hover:bg-teal-200 disabled:opacity-50'
                      }`}
                    >
                      ✅ Pour
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleVote(proposal.id, 'against'); }}
                      disabled={userVote !== null}
                      className={`py-2 px-4 rounded-lg font-semibold transition ${
                        userVote === 'against' ? 'bg-red-500 text-white' : 'bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50'
                      }`}
                    >
                      ❌ Contre
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleVote(proposal.id, 'abstain'); }}
                      disabled={userVote !== null}
                      className={`py-2 px-4 rounded-lg font-semibold transition ${
                        userVote === 'abstain' ? 'bg-gray-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50'
                      }`}
                    >
                      ⚪ Abstention
                    </button>
                  </div>
                  {userVote && (
                    <p className="text-xs text-teal-600 mt-2">
                      ✅ Votre vote a été enregistré avec succès.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pied de page informatif */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-600">
        <p className="font-semibold mb-1">ℹ️ Comment fonctionne la gouvernance ?</p>
        <p>
          Chaque $KLT détenu vous donne 1 voix. Les propositions sont soumises par les membres de la communauté 
          et doivent atteindre un quorum de 10% de l'offre en circulation pour être validées. 
          Les décisions adoptées sont exécutées automatiquement via les smart contracts de l'écosystème.
        </p>
      </div>
    </div>
  );
}