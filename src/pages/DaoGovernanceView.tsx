import React, { useState } from 'react';
import { Check, Plus, ThumbsDown, ThumbsUp, X } from 'lucide-react';
import { useKLTStore } from '../context/KLTStoreContext';
import { DaoProposal } from '../types/klt';

export const DaoGovernanceView: React.FC = () => {
  const { t, language, daoProposals, totalKltBalance, stakedKlt, voteDaoProposal, createDaoProposal } =
    useKLTStore();
  const [filter, setFilter] = useState<'all' | DaoProposal['status']>('all');
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCat, setNewCat] = useState<DaoProposal['category']>('Écosystème');

  const votingPower = Math.max(1000, Math.round(totalKltBalance + stakedKlt));
  const filtered = daoProposals.filter((p) => (filter === 'all' ? true : p.status === filter));

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;
    createDaoProposal(newTitle.trim(), newDesc.trim(), newCat);
    setNewTitle('');
    setNewDesc('');
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {t('Gouvernance DAO $KLT', '$KLT DAO Governance')}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {t(
              'Participez aux décisions stratégiques de la Maison Mark Kanich et des 8 piliers.',
              'Vote on strategic proposals across Maison Mark Kanich and its 8 ecosystem pillars.'
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold transition-colors whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          {t('Nouvelle proposition', 'New Proposal')}
        </button>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
          <p className="text-xs text-slate-400">{t('Propositions Totales', 'Total Proposals')}</p>
          <p className="text-2xl font-bold text-white font-mono-tabular mt-1">{daoProposals.length}</p>
        </div>
        <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
          <p className="text-xs text-slate-400">{t('Votes Ouverts', 'Active Votes')}</p>
          <p className="text-2xl font-bold text-sky-400 font-mono-tabular mt-1">
            {daoProposals.filter((p) => p.status === 'Active').length}
          </p>
        </div>
        <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
          <p className="text-xs text-slate-400">{t('Adoptées / Exécutées', 'Passed / Executed')}</p>
          <p className="text-2xl font-bold text-emerald-400 font-mono-tabular mt-1">
            {daoProposals.filter((p) => p.status === 'Passed' || p.status === 'Executed').length}
          </p>
        </div>
        <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
          <p className="text-xs text-slate-400">{t('Votre Pouvoir de Vote', 'Your Voting Power')}</p>
          <p className="text-2xl font-bold text-amber-400 font-mono-tabular mt-1">
            {votingPower.toLocaleString()} KLT
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg w-fit">
        {(
          [
            { id: 'all', fr: 'Toutes', en: 'All' },
            { id: 'Active', fr: 'Actives', en: 'Active' },
            { id: 'Passed', fr: 'Adoptées', en: 'Passed' },
            { id: 'Executed', fr: 'Exécutées', en: 'Executed' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              filter === tab.id ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t(tab.fr, tab.en)}
          </button>
        ))}
      </div>

      {/* Proposals List */}
      <div className="space-y-4">
        {filtered.map((p) => {
          const totalVotes = p.votesFor + p.votesAgainst;
          const forPct = totalVotes > 0 ? Math.round((p.votesFor / totalVotes) * 100) : 0;
          return (
            <div key={p.id} className="bg-[#0F172A] border border-slate-800 rounded-xl p-6 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1 max-w-3xl">
                  <div className="text-xs text-slate-400 font-mono-tabular">
                    {p.id} · {p.category} · {t('Clôture', 'Ends')} {p.endsAt} · {p.author}
                  </div>
                  <h2 className="text-lg font-semibold text-white">
                    {language === 'fr' ? p.title : p.titleEn}
                  </h2>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {language === 'fr' ? p.description : p.descriptionEn}
                  </p>
                </div>

                <span
                  className={`text-xs font-semibold shrink-0 ${
                    p.status === 'Active'
                      ? 'text-sky-400'
                      : p.status === 'Passed' || p.status === 'Executed'
                      ? 'text-emerald-400'
                      : 'text-red-400'
                  }`}
                >
                  {p.status}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono-tabular">
                  <span className="text-emerald-400">
                    {t('Pour', 'For')}: {p.votesFor.toLocaleString()} KLT ({forPct}%)
                  </span>
                  <span className="text-red-400">
                    {t('Contre', 'Against')}: {p.votesAgainst.toLocaleString()} KLT ({100 - forPct}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
                  <div className="h-full bg-emerald-500" style={{ width: `${forPct}%` }} />
                  <div className="h-full bg-red-500/80" style={{ width: `${100 - forPct}%` }} />
                </div>
              </div>

              {p.status === 'Active' && (
                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => voteDaoProposal(p.id, 'for')}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                      p.userVote === 'for'
                        ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                        : 'border-slate-700 bg-slate-900 text-slate-200 hover:border-emerald-500/50'
                    }`}
                  >
                    {p.userVote === 'for' ? <Check className="w-3.5 h-3.5" /> : <ThumbsUp className="w-3.5 h-3.5" />}
                    {t('Voter Pour', 'Vote For')}
                  </button>
                  <button
                    type="button"
                    onClick={() => voteDaoProposal(p.id, 'against')}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                      p.userVote === 'against'
                        ? 'border-red-500 bg-red-500/20 text-red-300'
                        : 'border-slate-700 bg-slate-900 text-slate-200 hover:border-red-500/50'
                    }`}
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                    {t('Voter Contre', 'Vote Against')}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Create Proposal Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreate}
            className="w-full max-w-lg bg-[#0F172A] border border-slate-700 rounded-xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                {t('Soumettre une Proposition DAO', 'Submit DAO Proposal')}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1.5 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label htmlFor="dao-title" className="block text-xs text-slate-300 mb-1.5">
                {t('Titre de la proposition', 'Proposal Title')}
              </label>
              <input
                id="dao-title"
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label htmlFor="dao-cat" className="block text-xs text-slate-300 mb-1.5">
                {t('Catégorie', 'Category')}
              </label>
              <select
                id="dao-cat"
                value={newCat}
                onChange={(e) => setNewCat(e.target.value as DaoProposal['category'])}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Écosystème">Écosystème</option>
                <option value="Trésorerie">Trésorerie</option>
                <option value="Tokenomics">Tokenomics</option>
                <option value="Technique">Technique</option>
              </select>
            </div>

            <div>
              <label htmlFor="dao-desc" className="block text-xs text-slate-300 mb-1.5">
                {t('Description détaillée', 'Detailed Description')}
              </label>
              <textarea
                id="dao-desc"
                rows={4}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-700 text-xs font-medium text-slate-300 hover:bg-slate-800"
              >
                {t('Annuler', 'Cancel')}
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold"
              >
                {t('Publier la proposition', 'Publish Proposal')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
