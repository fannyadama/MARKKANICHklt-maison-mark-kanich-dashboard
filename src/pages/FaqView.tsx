import React, { useEffect, useMemo, useState } from 'react';
import {
  ChevronDown,
  ChevronsDownUp,
  ChevronsUpDown,
  Download,
  HelpCircle,
  Search,
  Send,
  ThumbsDown,
  ThumbsUp,
  X,
} from 'lucide-react';
import { useKLTStore } from '../context/KLTStoreContext';
import { FaqItem } from '../types/klt';

interface FaqViewProps {
  initialAdminTab?: boolean;
}

const CATEGORY_LABELS: Record<FaqItem['category'], { fr: string; en: string }> = {
  Général: { fr: 'Général', en: 'General' },
  'Pump.fun & Solana': { fr: 'Pump.fun & Solana', en: 'Pump.fun & Solana' },
  'Staking & Carte': { fr: 'Staking & Carte', en: 'Staking & Card' },
  Sécurité: { fr: 'Sécurité', en: 'Security' },
};

function highlightMatch(text: string, query: string): React.ReactNode {
  const trimmed = query.trim();
  if (!trimmed) return text;
  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
  return parts.map((part, idx) =>
    part.toLowerCase() === trimmed.toLowerCase() ? (
      <mark key={idx} className="bg-amber-500/25 text-amber-200 rounded px-0.5">
        {part}
      </mark>
    ) : (
      <React.Fragment key={idx}>{part}</React.Fragment>
    )
  );
}

export const FaqView: React.FC<FaqViewProps> = ({ initialAdminTab = false }) => {
  const { t, language, user, faqItems, voteFaqItem, notify } = useKLTStore();
  const [viewMode, setViewMode] = useState<'faq' | 'admin'>(initialAdminTab ? 'admin' : 'faq');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | FaqItem['category']>('all');
  const [openIds, setOpenIds] = useState<string[]>(() => (faqItems[0]?.id ? [faqItems[0].id] : []));
  const [supportEmail, setSupportEmail] = useState(user.email);
  const [supportMsg, setSupportMsg] = useState('');

  useEffect(() => {
    setViewMode(initialAdminTab ? 'admin' : 'faq');
  }, [initialAdminTab]);

  const categories = useMemo(() => {
    const order: FaqItem['category'][] = ['Général', 'Pump.fun & Solana', 'Staking & Carte', 'Sécurité'];
    return order.filter((cat) => faqItems.some((item) => item.category === cat));
  }, [faqItems]);

  const filtered = useMemo(() => {
    const tokens = search
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    return faqItems.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (tokens.length === 0) return true;

      const haystack = [
        item.questionFr,
        item.questionEn,
        item.answerFr,
        item.answerEn,
        item.category,
        CATEGORY_LABELS[item.category].en,
      ]
        .join(' ')
        .toLowerCase();

      return tokens.every((tok) => haystack.includes(tok));
    });
  }, [faqItems, search, selectedCategory]);

  const groupedSections = useMemo(() => {
    if (selectedCategory !== 'all') {
      return [
        {
          category: selectedCategory,
          items: filtered,
        },
      ].filter((group) => group.items.length > 0);
    }

    return categories
      .map((category) => ({
        category,
        items: filtered.filter((item) => item.category === category),
      }))
      .filter((group) => group.items.length > 0);
  }, [categories, filtered, selectedCategory]);

  const togglePanel = (id: string) => {
    setOpenIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const allExpanded = filtered.length > 0 && filtered.every((item) => openIds.includes(item.id));

  const toggleExpandAll = () => {
    if (allExpanded) {
      setOpenIds([]);
    } else {
      setOpenIds(filtered.map((item) => item.id));
    }
  };

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
            {viewMode === 'admin'
              ? t('Console Analytics FAQ (Admin)', 'FAQ Analytics Dashboard (Admin)')
              : t('Centre d’Aide & FAQ $KLT', 'Help Center & $KLT FAQ')}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {t(
              'Réponses officielles sur Pump.fun, Solana, Staking 15% APY et Sécurité 7 couches.',
              'Official answers on Pump.fun, Solana, 15% APY Staking, and 7-Layer Security.'
            )}
          </p>
        </div>

        {user.role === 'admin' && (
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
            <button
              type="button"
              onClick={() => setViewMode('faq')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                viewMode === 'faq' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t('Vue Publique', 'Public FAQ')}
            </button>
            <button
              type="button"
              onClick={() => setViewMode('admin')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-200 hover:bg-slate-800 whitespace-nowrap"
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
          <div className="lg:col-span-2 space-y-5">
            {/* Quick-Search Bar & Controls */}
            <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-4 space-y-3.5">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="faq-quick-search"
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t(
                    'Rechercher par mots-clés (ex : staking, Raydium, burn, Solscan, Visa)...',
                    'Quick search by keywords (e.g., staking, Raydium, burn, Solscan, Visa)...'
                  )}
                  aria-label={t('Rechercher dans la FAQ', 'Quick search FAQ')}
                  className="w-full min-h-[42px] pl-10 pr-24 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                />
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <span className="text-[11px] font-mono-tabular text-slate-400">
                    {filtered.length}/{faqItems.length}
                  </span>
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch('')}
                      className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      aria-label={t('Effacer la recherche', 'Clear search')}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                {/* Category Filter Tabs */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors whitespace-nowrap ${
                      selectedCategory === 'all'
                        ? 'bg-amber-500 text-slate-950 border-amber-500'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    {t('Toutes', 'All')} ({faqItems.length})
                  </button>
                  {categories.map((cat) => {
                    const count = faqItems.filter((item) => item.category === cat).length;
                    const label = CATEGORY_LABELS[cat];
                    const active = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors whitespace-nowrap ${
                          active
                            ? 'bg-amber-500 text-slate-950 border-amber-500'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                        }`}
                      >
                        {t(label.fr, label.en)} ({count})
                      </button>
                    );
                  })}
                </div>

                {/* Expand / Collapse All Accordion Toggle */}
                {filtered.length > 0 && (
                  <button
                    type="button"
                    onClick={toggleExpandAll}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs font-medium text-slate-200 transition-colors whitespace-nowrap shrink-0"
                  >
                    {allExpanded ? (
                      <>
                        <ChevronsDownUp className="w-3.5 h-3.5 text-amber-400" />
                        {t('Tout réduire', 'Collapse all')}
                      </>
                    ) : (
                      <>
                        <ChevronsUpDown className="w-3.5 h-3.5 text-amber-400" />
                        {t('Tout déplier', 'Expand all')}
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Accordion Groups */}
            {groupedSections.length === 0 ? (
              <div className="bg-[#0F172A] border border-dashed border-slate-800 rounded-xl p-8 text-center space-y-3">
                <HelpCircle className="w-8 h-8 text-amber-400 mx-auto" />
                <div>
                  <p className="text-sm font-semibold text-white">
                    {t('Aucune question ne correspond à votre recherche.', 'No FAQ entries match your search.')}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {t(
                      'Essayez un autre mot-clé (ex. Solana, Staking, Sécurité) ou réinitialisez les filtres.',
                      'Try a different keyword (e.g., Solana, Staking, Security) or reset your filters.'
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    setSelectedCategory('all');
                  }}
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold transition-colors"
                >
                  {t('Réinitialiser les filtres', 'Reset Filters')}
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {groupedSections.map((group) => {
                  const catLabel = CATEGORY_LABELS[group.category];
                  return (
                    <section key={group.category} className="space-y-2.5">
                      <div className="flex items-center justify-between px-1">
                        <h2 className="text-xs font-semibold tracking-wide text-amber-400 uppercase">
                          {t(catLabel.fr, catLabel.en)}
                        </h2>
                        <span className="text-[11px] font-mono-tabular text-slate-500">
                          {group.items.length} {t('question(s)', 'item(s)')}
                        </span>
                      </div>

                      <div className="bg-[#0F172A] border border-slate-800 rounded-xl divide-y divide-slate-800/80 overflow-hidden">
                        {group.items.map((item) => {
                          const isOpen = openIds.includes(item.id);
                          const panelId = `faq-panel-${item.id}`;
                          const triggerId = `faq-trigger-${item.id}`;
                          const questionText = language === 'fr' ? item.questionFr : item.questionEn;
                          const answerText = language === 'fr' ? item.answerFr : item.answerEn;

                          return (
                            <div key={item.id} className="transition-colors">
                              <h3>
                                <button
                                  id={triggerId}
                                  type="button"
                                  aria-expanded={isOpen}
                                  aria-controls={panelId}
                                  onClick={() => togglePanel(item.id)}
                                  className={`w-full px-5 py-4 flex items-center justify-between gap-4 text-left transition-colors ${
                                    isOpen ? 'bg-slate-900/60' : 'hover:bg-slate-900/40'
                                  }`}
                                >
                                  <span className="text-sm font-semibold text-white leading-snug">
                                    {highlightMatch(questionText, search)}
                                  </span>
                                  <ChevronDown
                                    className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                                      isOpen ? 'rotate-180 text-amber-400' : 'text-slate-400'
                                    }`}
                                  />
                                </button>
                              </h3>

                              {isOpen && (
                                <div
                                  id={panelId}
                                  role="region"
                                  aria-labelledby={triggerId}
                                  className="px-5 pb-4 pt-3 border-t border-slate-800/60 bg-slate-950/30 space-y-3"
                                >
                                  <p className="text-sm text-slate-300 leading-relaxed">
                                    {highlightMatch(answerText, search)}
                                  </p>
                                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
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
                    </section>
                  );
                })}
              </div>
            )}
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
