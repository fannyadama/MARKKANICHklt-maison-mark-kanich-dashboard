import React, { useMemo, useState } from 'react';
import { BarChart3, Check, Copy, Download, Share2, UserPlus, Users } from 'lucide-react';
import { useKLTStore } from '../context/KLTStoreContext';
import { EIGHT_PILLARS_REPORTING } from '../data/kltSeedData';
import { ReferralRecord } from '../types/klt';

export const ReferralProgramView: React.FC = () => {
  const { t, customDomain, referrals, addReferralInvite, notify } = useKLTStore();
  const [partnerName, setPartnerName] = useState('');
  const [tier, setTier] = useState<ReferralRecord['tier']>('KANICH BLACK');
  const [copied, setCopied] = useState(false);

  const referralUrl = `https://${customDomain}/?ref=MK-ADAMA-01`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      notify(t('Lien de parrainage officiel copié.', 'Official referral link copied.'), 'success');
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      notify(t('Copiez le lien manuellement.', 'Please copy the link manually.'), 'info');
    }
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerName.trim()) return;
    addReferralInvite(partnerName, tier);
    setPartnerName('');
  };

  const totalVolume = referrals.reduce((sum, r) => sum + r.volumeUsd, 0);
  const totalRewards = referrals.reduce((sum, r) => sum + r.rewardKlt, 0);
  const activeCount = referrals.filter((r) => r.status === 'Active').length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {t('Programme Parrainage & Affiliation Réelle', 'Verified Referral & Affiliate Program')}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {t(
              'Liens de parrainage actifs sur votre domaine officiel — aucun compte @test.com.',
              'Live referral links on your official domain — zero @test.com test records.'
            )}
          </p>
        </div>
        <span className="text-xs font-mono-tabular text-amber-400 font-semibold">
          Code : MK-ADAMA-01
        </span>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
          <p className="text-xs text-slate-400">{t('Filleuls Actifs', 'Active Referrals')}</p>
          <p className="text-2xl font-bold text-white font-mono-tabular mt-1">
            {activeCount} / {referrals.length}
          </p>
        </div>
        <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
          <p className="text-xs text-slate-400">{t('Volume Apporté', 'Attributed Volume')}</p>
          <p className="text-2xl font-bold text-emerald-400 font-mono-tabular mt-1">
            ${totalVolume.toLocaleString('en-US')}
          </p>
        </div>
        <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
          <p className="text-xs text-slate-400">{t('Bonus $KLT Accumulés', 'Accumulated $KLT Bonus')}</p>
          <p className="text-2xl font-bold text-amber-400 font-mono-tabular mt-1">
            +{totalRewards.toLocaleString('en-US')} KLT
          </p>
        </div>
      </div>

      {/* Shareable Referral Link + Invite Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Share2 className="w-4 h-4 text-amber-400" />
            <span>{t('Votre Lien de Parrainage Officiel', 'Your Official Referral Link')}</span>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={referralUrl}
              className="flex-1 px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 font-mono-tabular text-xs text-amber-300 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold whitespace-nowrap shrink-0"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? t('Copié', 'Copied') : t('Copier', 'Copy')}
            </button>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t(
              '5% de commission sur les souscriptions Stipulor / KIIS CashFlow et +250 $KLT crédités dès le premier staking de votre filleul.',
              'Earn 5% commission on Stipulor / KIIS CashFlow plans plus +250 $KLT once your referral stakes.'
            )}
          </p>
        </div>

        <form onSubmit={handleInvite} className="bg-[#0F172A] border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <UserPlus className="w-4 h-4 text-emerald-400" />
            <span>{t('Enregistrer un Partenaire / Filleul', 'Register Partner Invite')}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              value={partnerName}
              onChange={(e) => setPartnerName(e.target.value)}
              placeholder={t('Nom complet du partenaire...', 'Partner full name...')}
              className="sm:col-span-2 px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
            />
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value as ReferralRecord['tier'])}
              className="px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="KANICH BLACK">KANICH BLACK</option>
              <option value="KANICH GOLD">KANICH GOLD</option>
              <option value="KANICH PLATINUM">KANICH PLATINUM</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!partnerName.trim()}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-semibold transition-colors"
            >
              {t('Générer invitation', 'Create Invite')}
            </button>
          </div>
        </form>
      </div>

      {/* Referrals Table */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-400" />
            <h2 className="text-base font-semibold text-white">
              {t('Filleuls & Partenaires Enregistrés', 'Registered Referral Partners')}
            </h2>
          </div>
          <span className="text-xs text-emerald-400 font-mono-tabular">
            0 compte @test.com
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 pr-4">{t('Partenaire', 'Partner')}</th>
                <th className="py-2.5 pr-4">{t('Tier', 'Tier')}</th>
                <th className="py-2.5 pr-4">{t('Code', 'Code')}</th>
                <th className="py-2.5 pr-4 text-right">{t('Volume USD', 'Volume USD')}</th>
                <th className="py-2.5 pr-4 text-right">{t('Bonus $KLT', '$KLT Bonus')}</th>
                <th className="py-2.5 pr-4">{t('Statut', 'Status')}</th>
                <th className="py-2.5 text-right">{t('Date', 'Joined')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {referrals.map((r) => (
                <tr key={r.id} className="hover:bg-slate-900/50">
                  <td className="py-3 pr-4 font-semibold text-white">{r.partnerName}</td>
                  <td className="py-3 pr-4 text-amber-300 font-mono-tabular">{r.tier}</td>
                  <td className="py-3 pr-4 font-mono-tabular text-slate-400">{r.code}</td>
                  <td className="py-3 pr-4 text-right font-mono-tabular text-white">
                    ${r.volumeUsd.toLocaleString('en-US')}
                  </td>
                  <td className="py-3 pr-4 text-right font-mono-tabular text-emerald-400 font-semibold">
                    +{r.rewardKlt} KLT
                  </td>
                  <td className="py-3 pr-4">
                    <span className={r.status === 'Active' ? 'text-emerald-400' : 'text-amber-400'}>
                      {r.status === 'Active' ? t('Actif', 'Active') : t('En attente', 'Pending')}
                    </span>
                  </td>
                  <td className="py-3 text-right font-mono-tabular text-slate-400">{r.joinedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const EightPillarsReportingView: React.FC = () => {
  const { t, notify } = useKLTStore();
  const [divisionFilter, setDivisionFilter] = useState<'all' | 'Tech & Finance' | 'Immobilier & Commerce' | 'Luxe & Lifestyle'>('all');

  const filtered = useMemo(() => {
    if (divisionFilter === 'all') return EIGHT_PILLARS_REPORTING;
    return EIGHT_PILLARS_REPORTING.filter((p) => p.divisionFr === divisionFilter);
  }, [divisionFilter]);

  const totalRevenue = filtered.reduce((sum, p) => sum + p.revenueUsd, 0);
  const totalProjects = filtered.reduce((sum, p) => sum + p.activeProjects, 0);
  const avgKltShare = Math.round(
    filtered.reduce((sum, p) => sum + p.kltSettlementShare, 0) / Math.max(1, filtered.length)
  );

  const exportPillarsCsv = () => {
    const headers = ['Entite', 'Pole', 'Revenu_USD', 'Croissance_Pct', 'Projets_Actifs', 'Part_Reglement_KLT_Pct', 'Statut'];
    const rows = filtered.map((p) => [
      `"${p.name}"`,
      `"${p.divisionFr}"`,
      p.revenueUsd,
      p.growthPct,
      p.activeProjects,
      p.kltSettlementShare,
      `"${p.statusFr}"`,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `maison-mark-kanich-8-piliers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    notify(t('Rapport CSV des 8 Piliers exporté.', '8 Pillars CSV report exported.'), 'success');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {t('Reporting Consolidé des 8 Piliers', 'Consolidated 8-Pillar Reporting')}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {t(
              'Suivi financier et opérationnel : KIIS Global, KIIS CashFlow, Beldozac, ImmoScale AI, Villagia, NationeX, Fashion & Cosmétique.',
              'Operational & financial reporting across KIIS Global, KIIS CashFlow, Beldozac, ImmoScale AI, Villagia, NationeX, Fashion & Cosmetics.'
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={exportPillarsCsv}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-amber-400 whitespace-nowrap"
        >
          <Download className="w-4 h-4" />
          {t('Exporter Rapport CSV', 'Export CSV Report')}
        </button>
      </div>

      {/* Consolidated KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
          <p className="text-xs text-slate-400">{t('Revenu Consolidé (Périmètre)', 'Consolidated Revenue')}</p>
          <p className="text-2xl font-bold text-white font-mono-tabular mt-1">
            ${totalRevenue.toLocaleString('en-US')}
          </p>
        </div>
        <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
          <p className="text-xs text-slate-400">{t('Programmes & Clients Actifs', 'Active Programs & Clients')}</p>
          <p className="text-2xl font-bold text-emerald-400 font-mono-tabular mt-1">{totalProjects}</p>
        </div>
        <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5">
          <p className="text-xs text-slate-400">{t('Part Moyenne Règlement $KLT', 'Avg $KLT Settlement Share')}</p>
          <p className="text-2xl font-bold text-amber-400 font-mono-tabular mt-1">{avgKltShare}%</p>
        </div>
      </div>

      {/* Division Filter + Table */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <BarChart3 className="w-4 h-4 text-amber-400" />
            <span>{t('Performance par Entité', 'Entity Performance')}</span>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg overflow-x-auto">
            {(
              [
                { id: 'all', fr: 'Tous (8)', en: 'All (8)' },
                { id: 'Tech & Finance', fr: 'Tech & Finance', en: 'Tech & Finance' },
                { id: 'Immobilier & Commerce', fr: 'Immobilier & Commerce', en: 'Real Estate & Trade' },
                { id: 'Luxe & Lifestyle', fr: 'Luxe & Lifestyle', en: 'Luxury & Lifestyle' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setDivisionFilter(tab.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                  divisionFilter === tab.id ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                {t(tab.fr, tab.en)}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 pr-4">{t('Entité', 'Entity')}</th>
                <th className="py-2.5 pr-4">{t('Pôle', 'Division')}</th>
                <th className="py-2.5 pr-4 text-right">{t('Revenu USD', 'Revenue USD')}</th>
                <th className="py-2.5 pr-4 text-right">{t('Croissance', 'Growth')}</th>
                <th className="py-2.5 pr-4 text-right">{t('Projets', 'Projects')}</th>
                <th className="py-2.5 pr-4 text-right">{t('Part $KLT', '$KLT Share')}</th>
                <th className="py-2.5 text-right">{t('Statut', 'Status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-900/50">
                  <td className="py-3 pr-4 font-semibold text-white">{p.name}</td>
                  <td className="py-3 pr-4 text-slate-400">{t(p.divisionFr, p.divisionEn)}</td>
                  <td className="py-3 pr-4 text-right font-mono-tabular font-semibold text-white">
                    ${p.revenueUsd.toLocaleString('en-US')}
                  </td>
                  <td className="py-3 pr-4 text-right font-mono-tabular text-emerald-400">
                    +{p.growthPct.toFixed(1)}%
                  </td>
                  <td className="py-3 pr-4 text-right font-mono-tabular text-slate-300">
                    {p.activeProjects}
                  </td>
                  <td className="py-3 pr-4 text-right font-mono-tabular text-amber-400 font-semibold">
                    {p.kltSettlementShare}%
                  </td>
                  <td className="py-3 text-right text-slate-300">{t(p.statusFr, p.statusEn)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
