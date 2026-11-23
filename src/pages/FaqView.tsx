import React, { useState } from 'react';
import { ChevronDown, Download, Search, Send, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useKLTStore } from '../context/KLTStoreContext';

interface FaqViewProps {
  initialAdminTab?: boolean;
}

export const FaqView: React.FC<FaqViewProps> = ({ initialAdminTab = false }) => {
  const { t, language, user, faqItems, voteFaqItem, notify } = useKLTStore();
  const [viewMode, setViewMode] = useState<'faq' | 'admin'>(initialAdminTab ? 'admin' : 'faq');
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState<string | null>(faqItems[0]?.id || null);
  const [supportEmail, setSupportEmail] = useState(user.email);
  const [supportMsg, setSupportMsg] = useState('');

  const filtered = faqItems.filter((item) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      item.questionFr.toLowerCase().includes(q) ||
      item.questionEn.toLowerCase().includes(q) ||
      item.answerFr.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  const totalHelpful = faqItems.reduce((s, f) => s + f.helpfulVotes, 0);
  const totalNotHelpful = faqItems.reduce((s, f) => s + f.notHelpfulVotes, 0);

  const exportFaqJson = () => {
    const blob = new Blob([JSON.stringify(faqItems, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `klt-faq-stats-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    notify(t('Statistiques FAQ exportées en JSON.', 'FAQ analytics exported as JSON.'));
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMsg.trim()) return;
    notify(t('Message envoyé à l’équipe Maison Mark Kanich (Abidjan).', 'Message sent to Maison Mark Kanich support.'));
    setSupportMsg('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {viewMode === 'admin' ? t('Console Analytics FAQ (Admin)', 'FAQ Analytics Dashboard (Admin)') : t('Centre d’Aide & FAQ $KLT', 'Help Center & $KLT FAQ')}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {t('Réponses officielles sur Pump.fun, Solana, Staking 15% APY et Sécurité 7 couches.', 'Official answers on Pump.fun, Solana, 15% APY Staking, and 7-Layer Security.')}
          </p>
        </div>

        {user.role === 'admin' && (
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
            <button
              type="button"
              onClick={() => setViewMode('faq')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                viewMode === 'faq' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('Vue Publique', 'Public FAQ')}
            </button>
            <button
              type="button"
              onClick={() => setViewMode('admin')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                viewMode === 'admin' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('Analytics Admin', 'Admin Analytics')}
            </button>
          </div>
        )}
      </div>

      {viewMode === 'admin' && user.role === 'admin' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
              <p className="text-xs text-slate-400">{t('Questions Publiées', 'Published Entries')}</p>
              <p className="text-3xl font-bold text-white font-mono-tabular mt-1">{faqItems.length}</p>
            </div>
            <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
              <p className="text-xs text-slate-400">{t('Votes Positifs', 'Helpful Votes')}</p>
              <p className="text-3xl font-bold text-emerald-400 font-mono-tabular mt-1">{totalHelpful}</p>
            </div>
            <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
              <p className="text-xs text-slate-400">{t('Taux de Satisfaction', 'Satisfaction Rate')}</p>
              <p className="text-3xl font-bold text-amber-400 font-mono-tabular mt-1">
                {((totalHelpful / Math.max(1, totalHelpful + totalNotHelpful)) * 100).toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-white">
                {t('Performance par Question', 'Question Feedback Breakdown')}
              </h2>
              <button
                type="button"
                onClick={exportFaqJson}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-200 hover:bg-slate-800"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                {t('Exporter JSON', 'Export JSON')}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2.5 pr-4">{t('Catégorie', 'Category')}</th>
                    <th className="py-2.5 pr-4">{t('Question', 'Question')}</th>
                    <th className="py-2.5 pr-4 text-right">{t('Utile', 'Helpful')}</th>
                    <th className="py-2.5 text-right">{t('Non utile', 'Not Helpful')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  {faqItems.map((f) => (
                    <tr key={f.id}>
                      <td className="py-3 pr-4 text-amber-400 whitespace-nowrap">{f.category}</td>
                      <td className="py-3 pr-4 text-white">{language === 'fr' ? f.questionFr : f.questionEn}</td>
                      <td className="py-3 pr-4 text-right font-mono-tabular text-emerald-400">{f.helpfulVotes}</td>
                      <td className="py-3 text-right font-mono-tabular text-red-400">{f.notHelpfulVotes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('Rechercher dans la FAQ...', 'Search FAQ...')}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#0F172A] border border-slate-800 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-3">
              {filtered.map((item) => {
                const isOpen = openId === item.id;
                return (
                  <div key={item.id} className="bg-[#0F172A] border border-slate-800 rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenId(isOpen ? null : item.id)}
                      className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left hover:bg-slate-900/50 transition-colors"
                    >
                      <div>
                        <span className="text-[11px] text-amber-400 font-medium">{item.category}</span>
                        <p className="text-sm font-semibold text-white mt-0.5">
                          {language === 'fr' ? item.questionFr : item.questionEn}
                        </p>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-4 pt-2 border-t border-slate-800/80 space-y-3">
                        <p className="text-sm text-slate-300 leading-relaxed">
                          {language === 'fr' ? item.answerFr : item.answerEn}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span>{t('Cette réponse vous a-t-elle aidé ?', 'Was this helpful?')}</span>
                          <button
                            type="button"
                            onClick={() => voteFaqItem(item.id, 'helpful')}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded border transition-colors ${
                              item.userFeedback === 'helpful'
                                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                                : 'border-slate-700 hover:border-slate-600'
                            }`}
                          >
                            <ThumbsUp className="w-3 h-3" />
                            <span className="font-mono-tabular">{item.helpfulVotes}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => voteFaqItem(item.id, 'not_helpful')}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded border transition-colors ${
                              item.userFeedback === 'not_helpful'
                                ? 'border-red-500 text-red-400 bg-red-500/10'
                                : 'border-slate-700 hover:border-slate-600'
                            }`}
                          >
                            <ThumbsDown className="w-3 h-3" />
                            <span className="font-mono-tabular">{item.notHelpfulVotes}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Direct Support Form */}
          <form onSubmit={handleSupportSubmit} className="bg-[#0F172A] border border-slate-800 rounded-xl p-5 space-y-4">
            <h2 className="text-base font-semibold text-white">
              {t('Contacter le Support KLT', 'Contact KLT Support')}
            </h2>
            <p className="text-xs text-slate-400">
              {t('Équipe basée à Abidjan (contact@markkanich.com).', 'Abidjan-based support team (contact@markkanich.com).')}
            </p>
            <div>
              <label htmlFor="sup-email" className="block text-xs text-slate-300 mb-1">
                Email
              </label>
              <input
                id="sup-email"
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label htmlFor="sup-msg" className="block text-xs text-slate-300 mb-1">
                {t('Votre question', 'Your message')}
              </label>
              <textarea
                id="sup-msg"
                rows={4}
                value={supportMsg}
                onChange={(e) => setSupportMsg(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              {t('Envoyer au support', 'Send Message')}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
