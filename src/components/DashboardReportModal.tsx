import React, { useMemo, useState } from 'react';
import { jsPDF } from 'jspdf';
import {
  Bell,
  CheckCircle2,
  Coins,
  Download,
  FileText,
  TrendingUp,
  X,
} from 'lucide-react';
import { useKLTStore } from '../context/KLTStoreContext';
import { FX_RATES } from '../data/kltSeedData';

interface DashboardReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function getStakingTierName(staked: number, isFr: boolean): string {
  if (staked >= 100000) return isFr ? 'Gouverneur DAO (100k+)' : 'DAO Governor (100k+)';
  if (staked >= 50000) return isFr ? 'Platine VIP (50k+)' : 'Platinum VIP (50k+)';
  if (staked >= 25000) return isFr ? 'Tier Or (25k+)' : 'Gold Tier (25k+)';
  if (staked >= 5000) return isFr ? 'Tier Argent · Visa (5k+)' : 'Silver Tier · Visa (5k+)';
  return isFr ? 'Standard (< 5k)' : 'Standard (< 5k)';
}

export const DashboardReportModal: React.FC<DashboardReportModalProps> = ({ isOpen, onClose }) => {
  const {
    t,
    language,
    user,
    wallets,
    totalKltBalance,
    stakedKlt,
    stakingRewardsKlt,
    usdBalance,
    visaCard,
    kltPriceUsd,
    assets,
    priceAlerts,
    transactions,
    accessNftTiers,
    ownedNftIds,
    solanaConnected,
    walletProvider,
    solanaAddress,
    autoPriceWatch,
    notify,
  } = useKLTStore();

  const [includeWallets, setIncludeWallets] = useState(true);
  const [includeRecentTx, setIncludeRecentTx] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const isFr = language === 'fr';
  const kltAsset = assets.find((a) => a.symbol === 'KLT') || assets[0];

  const metrics = useMemo(() => {
    const liquidUsd = totalKltBalance * kltPriceUsd;
    const stakedUsd = stakedKlt * kltPriceUsd;
    const escrowUsd = visaCard.kltEscrowBalance * kltPriceUsd;
    const totalPortfolioUsd = liquidUsd + stakedUsd + escrowUsd + usdBalance;
    const totalEur = totalPortfolioUsd * FX_RATES.EUR;
    const totalXof = totalPortfolioUsd * FX_RATES.XOF;

    const effectiveApy = (Math.pow(1 + 0.15 / 365, 365) - 1) * 100;
    const projectedAnnualKlt = stakedKlt * (effectiveApy / 100);
    const projectedMonthlyKlt = (stakedKlt * 0.15) / 12;

    const activeAlerts = priceAlerts.filter((r) => r.active && !r.triggered);
    const triggeredAlerts = priceAlerts.filter((r) => r.triggered);

    const ownedPasses = accessNftTiers.filter((n) => ownedNftIds.includes(n.id));

    return {
      liquidUsd,
      stakedUsd,
      escrowUsd,
      totalPortfolioUsd,
      totalEur,
      totalXof,
      effectiveApy,
      projectedAnnualKlt,
      projectedMonthlyKlt,
      activeAlerts,
      triggeredAlerts,
      ownedPasses,
    };
  }, [
    accessNftTiers,
    kltPriceUsd,
    ownedNftIds,
    priceAlerts,
    stakedKlt,
    totalKltBalance,
    usdBalance,
    visaCard.kltEscrowBalance,
  ]);

  if (!isOpen) return null;

  const handleDownloadPdf = () => {
    setIsGenerating(true);
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 16;
      const contentWidth = pageWidth - margin * 2;
      let y = 0;

      const ensureSpace = (neededMm: number) => {
        if (y + neededMm > pageHeight - 16) {
          doc.addPage();
          y = 18;
        }
      };

      // Top dark banner
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, pageWidth, 34, 'F');
      doc.setFillColor(245, 158, 11);
      doc.rect(0, 34, pageWidth, 1.2, 'F');

      doc.setTextColor(245, 158, 11);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('MAISON MARK KANICH  |  KIIS GLOBAL', margin, 14);

      doc.setTextColor(226, 232, 240);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.text(
        isFr
          ? 'Rapport Executif de Synthese - Portefeuille, Staking & Alertes $KLT'
          : 'Executive Summary Report - $KLT Holdings, Staking & Active Alerts',
        margin,
        21
      );

      const generatedAt = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
      doc.setTextColor(148, 163, 184);
      doc.setFontSize(8.5);
      doc.text(`${isFr ? 'Genere le' : 'Generated'}: ${generatedAt}`, margin, 28);
      doc.text(
        `${isFr ? 'Titulaire' : 'Holder'}: ${user.name} (ID #${user.id})`,
        pageWidth - margin,
        28,
        { align: 'right' }
      );

      y = 44;

      const drawSectionTitle = (title: string) => {
        ensureSpace(14);
        doc.setFillColor(241, 245, 249);
        doc.rect(margin, y, contentWidth, 7.5, 'F');
        doc.setTextColor(15, 23, 42);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text(title, margin + 3, y + 5.2);
        y += 11;
      };

      const drawKeyValueRow = (label: string, value: string, highlight = false) => {
        ensureSpace(7);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105);
        doc.text(label, margin + 2, y);

        doc.setFont('helvetica', highlight ? 'bold' : 'normal');
        doc.setTextColor(highlight ? 180 : 15, highlight ? 83 : 23, highlight ? 9 : 42);
        doc.text(value, pageWidth - margin - 2, y, { align: 'right' });

        doc.setDrawColor(226, 232, 240);
        doc.line(margin, y + 2, pageWidth - margin, y + 2);
        y += 6.5;
      };

      // 1. Current Holdings
      drawSectionTitle(isFr ? '1. ACTIFS & PORTEFEUILLE ACTUEL (CURRENT HOLDINGS)' : '1. CURRENT HOLDINGS & PORTFOLIO VALUATION');
      drawKeyValueRow(
        isFr ? 'Valorisation Totale Estimee' : 'Total Portfolio Valuation',
        `$${metrics.totalPortfolioUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD (~EUR ${metrics.totalEur.toLocaleString('en-US', { maximumFractionDigits: 2 })} / ${Math.round(metrics.totalXof).toLocaleString('en-US')} FCFA)`,
        true
      );
      drawKeyValueRow(
        isFr ? 'Cours Spot $KLT / Variation 24h' : '$KLT Spot Price / 24h Change',
        `$${kltPriceUsd.toFixed(4)} USD (${kltAsset.change24h >= 0 ? '+' : ''}${kltAsset.change24h.toFixed(2)}%)`
      );
      drawKeyValueRow(
        isFr ? '$KLT Liquide (Portefeuilles SPL)' : 'Liquid $KLT (SPL Wallets)',
        `${totalKltBalance.toLocaleString('en-US', { maximumFractionDigits: 2 })} KLT ($${metrics.liquidUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`
      );
      drawKeyValueRow(
        isFr ? '$KLT Stake (Pool 15% APY)' : 'Staked $KLT (15% APY Pool)',
        `${stakedKlt.toLocaleString('en-US', { maximumFractionDigits: 2 })} KLT ($${metrics.stakedUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`
      );
      drawKeyValueRow(
        isFr ? 'Coffre Escrow Carte Visa ($KLT)' : 'Virtual Visa Card Escrow ($KLT)',
        `${visaCard.kltEscrowBalance.toLocaleString('en-US', { maximumFractionDigits: 2 })} KLT ($${metrics.escrowUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`
      );
      drawKeyValueRow(
        isFr ? 'Liquidite USD Disponible' : 'Available USD Liquidity',
        `$${usdBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`
      );
      drawKeyValueRow(
        isFr ? 'Wallet Solana Lie' : 'Linked Solana Wallet',
        solanaConnected ? `${walletProvider} (${solanaAddress.slice(0, 8)}...${solanaAddress.slice(-6)})` : isFr ? 'Non connecte' : 'Not connected'
      );
      drawKeyValueRow(
        isFr ? 'Pass NFT Detenus' : 'Owned NFT Access Passes',
        metrics.ownedPasses.length > 0
          ? metrics.ownedPasses.map((p) => `${p.tier} (${p.id})`).join(', ')
          : isFr ? 'Aucun' : 'None'
      );

      if (includeWallets) {
        y += 2;
        ensureSpace(14);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(51, 65, 85);
        doc.text(isFr ? 'Detail des coffres SPL :' : 'SPL Wallets Breakdown:', margin + 2, y);
        y += 5;
        wallets.forEach((w) => {
          ensureSpace(6);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(71, 85, 105);
          doc.text(`${w.label} (${w.network}) - ${w.walletAddress.slice(0, 10)}...`, margin + 4, y);
          doc.setTextColor(15, 23, 42);
          doc.text(
            `${w.kltBalance.toLocaleString('en-US', { maximumFractionDigits: 2 })} KLT | ${w.solBalance.toFixed(2)} SOL`,
            pageWidth - margin - 2,
            y,
            { align: 'right' }
          );
          y += 5;
        });
      }

      y += 4;

      // 2. Staking Performance
      drawSectionTitle(isFr ? '2. PERFORMANCE STAKING (15% APY)' : '2. STAKING PERFORMANCE (15% APY)');
      drawKeyValueRow(
        isFr ? 'Capital Verrouille & Palier Actif' : 'Staked Principal & Active Tier',
        `${stakedKlt.toLocaleString('en-US', { maximumFractionDigits: 2 })} KLT | ${getStakingTierName(stakedKlt, isFr)}`
      );
      drawKeyValueRow(
        isFr ? 'Rendement Nominal / APY Effectif (Composes)' : 'Nominal Yield / Effective Compounded APY',
        `15.00% APY nominal | ${metrics.effectiveApy.toFixed(2)}% APY effectif`
      );
      drawKeyValueRow(
        isFr ? 'Recompenses Accumulees a Reclamer' : 'Pending Claimable Rewards',
        `+${stakingRewardsKlt.toFixed(2)} KLT (~$${(stakingRewardsKlt * kltPriceUsd).toFixed(2)} USD)`,
        true
      );
      drawKeyValueRow(
        isFr ? 'Projection Mensuelle Estimee' : 'Estimated Monthly Yield',
        `+${metrics.projectedMonthlyKlt.toLocaleString('en-US', { maximumFractionDigits: 2 })} KLT / mois (~$${(metrics.projectedMonthlyKlt * kltPriceUsd).toFixed(2)})`
      );
      drawKeyValueRow(
        isFr ? 'Projection 12 Mois (Interets Composes)' : '12-Month Compounded Projection',
        `+${metrics.projectedAnnualKlt.toLocaleString('en-US', { maximumFractionDigits: 2 })} KLT (~$${(metrics.projectedAnnualKlt * kltPriceUsd).toFixed(2)} USD)`
      );

      y += 4;

      // 3. Active Price Alerts
      drawSectionTitle(isFr ? '3. ALERTES PRIX ACTIVES ($KLT)' : '3. ACTIVE PRICE ALERTS ($KLT)');
      drawKeyValueRow(
        isFr ? 'Surveillance & Flux Temps Reel' : 'Monitoring & Auto Stream',
        `${user.notifications.priceAlerts ? 'ON' : 'OFF'} | Stream 8s: ${autoPriceWatch ? 'Active' : 'Manual'} | ${metrics.activeAlerts.length} ${isFr ? 'actives' : 'active'} / ${metrics.triggeredAlerts.length} ${isFr ? 'declenchees' : 'triggered'}`
      );

      if (metrics.activeAlerts.length === 0) {
        ensureSpace(7);
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8.5);
        doc.setTextColor(100, 116, 139);
        doc.text(
          isFr ? 'Aucune alerte active configuree pour le moment.' : 'No active price threshold alerts currently configured.',
          margin + 2,
          y
        );
        y += 7;
      } else {
        metrics.activeAlerts.forEach((rule) => {
          ensureSpace(7);
          const distPct = ((rule.targetPriceUsd - kltPriceUsd) / kltPriceUsd) * 100;
          const condLabel = rule.condition === 'above' ? (isFr ? 'Hausse >=' : 'Above >=') : isFr ? 'Baisse <=' : 'Below <=';
          const intentLabel = rule.actionIntent ? ` [${rule.actionIntent.toUpperCase()}]` : '';
          const note = rule.label ? ` - ${rule.label}` : '';
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(15, 23, 42);
          doc.text(`${condLabel} $${rule.targetPriceUsd.toFixed(4)}${intentLabel}${note}`, margin + 2, y);
          doc.setTextColor(71, 85, 105);
          doc.text(
            `${distPct >= 0 ? '+' : ''}${distPct.toFixed(2)}% vs spot`,
            pageWidth - margin - 2,
            y,
            { align: 'right' }
          );
          y += 5.5;
        });
      }

      // 4. Optional Recent Transactions
      if (includeRecentTx && transactions.length > 0) {
        y += 4;
        drawSectionTitle(isFr ? '4. DERNIERES OPERATIONS ON-CHAIN' : '4. RECENT ON-CHAIN OPERATIONS');
        transactions.slice(0, 5).forEach((tx) => {
          ensureSpace(7);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8);
          doc.setTextColor(71, 85, 105);
          doc.text(`${tx.createdAt.slice(0, 16)}  |  ${tx.type.toUpperCase()}  |  ${tx.description.slice(0, 48)}`, margin + 2, y);
          doc.setTextColor(15, 23, 42);
          doc.text(
            `${tx.type === 'sell' ? '-' : '+'}${tx.kltAmount.toLocaleString('en-US', { maximumFractionDigits: 2 })} KLT (${tx.txHash})`,
            pageWidth - margin - 2,
            y,
            { align: 'right' }
          );
          y += 5.5;
        });
      }

      // Footer
      ensureSpace(12);
      doc.setDrawColor(203, 213, 225);
      doc.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(
        'Maison Mark Kanich / KIIS Global  |  dashboard.markkanich.com  |  Solana SPL Ecosystem Report',
        margin,
        pageHeight - 9
      );

      const dateTag = new Date().toISOString().slice(0, 10);
      doc.save(`KLT-Summary-Report-${dateTag}.pdf`);

      notify(
        t(
          `Rapport PDF KLT-Summary-Report-${dateTag}.pdf téléchargé.`,
          `Summary PDF KLT-Summary-Report-${dateTag}.pdf downloaded.`
        ),
        'success',
        { category: 'system', title: t('Rapport PDF Généré', 'Summary PDF Generated') }
      );
      onClose();
    } catch (err) {
      console.error('PDF generation failed:', err);
      notify(
        t('Erreur lors de la génération du PDF.', 'Failed to generate PDF report.'),
        'error'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
    >
      <div
        className="w-full max-w-2xl bg-[#0F172A] border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-amber-400" />
            </div>
            <div className="min-w-0">
              <h2 id="report-modal-title" className="text-base font-bold text-white truncate">
                {t('Générer un Rapport de Synthèse PDF', 'Generate Executive Summary Report (PDF)')}
              </h2>
              <p className="text-xs text-slate-400 truncate">
                {t(
                  'Compile vos actifs actuels, performance staking et alertes actives.',
                  'Compiles current holdings, staking performance, and active price alerts.'
                )}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label={t('Fermer', 'Close')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Preview Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* 3-Metric Preview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('Actifs Totaux', 'Total Holdings')}</span>
              </div>
              <p className="text-lg font-bold text-white font-mono-tabular">
                ${metrics.totalPortfolioUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-[11px] text-slate-400 font-mono-tabular">
                {totalKltBalance.toLocaleString('en-US', { maximumFractionDigits: 0 })} {t('liquides', 'liquid')} · {stakedKlt.toLocaleString('en-US', { maximumFractionDigits: 0 })} {t('stakés', 'staked')}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t('Staking (15% APY)', 'Staking (15% APY)')}</span>
              </div>
              <p className="text-lg font-bold text-emerald-400 font-mono-tabular">
                +{stakingRewardsKlt.toFixed(2)} KLT
              </p>
              <p className="text-[11px] text-slate-400 font-mono-tabular">
                {t('Proj. 12 mois', '12m Proj.')}: +{metrics.projectedAnnualKlt.toLocaleString('en-US', { maximumFractionDigits: 0 })} KLT
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Bell className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('Alertes Actives', 'Active Alerts')}</span>
              </div>
              <p className="text-lg font-bold text-amber-400 font-mono-tabular">
                {metrics.activeAlerts.length} {t('règles', 'rules')}
              </p>
              <p className="text-[11px] text-slate-400 font-mono-tabular">
                Spot: ${kltPriceUsd.toFixed(4)} · {metrics.triggeredAlerts.length} {t('déclenchées', 'triggered')}
              </p>
            </div>
          </div>

          {/* Active Alerts Quick Summary */}
          <div className="p-4 rounded-lg bg-slate-900/70 border border-slate-800 space-y-2">
            <p className="font-semibold text-white">
              {t('Aperçu des Alertes Incluses', 'Included Active Alerts Preview')}
            </p>
            {metrics.activeAlerts.length === 0 ? (
              <p className="text-slate-400">
                {t('Aucune alerte active configurée.', 'No active alerts configured.')}
              </p>
            ) : (
              <div className="divide-y divide-slate-800/70">
                {metrics.activeAlerts.slice(0, 4).map((rule) => {
                  const pct = ((rule.targetPriceUsd - kltPriceUsd) / kltPriceUsd) * 100;
                  return (
                    <div key={rule.id} className="py-2 flex items-center justify-between gap-2 font-mono-tabular">
                      <span className="text-slate-200">
                        {rule.condition === 'above' ? '≥' : '≤'} ${rule.targetPriceUsd.toFixed(4)}
                        {rule.actionIntent ? ` (${rule.actionIntent.toUpperCase()})` : ''}
                        {rule.label ? ` · ${rule.label}` : ''}
                      </span>
                      <span className={pct >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                        {pct >= 0 ? '+' : ''}{pct.toFixed(2)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* PDF Section Options */}
          <div className="space-y-2.5">
            <p className="font-semibold text-white">{t('Options du Document PDF', 'PDF Report Sections')}</p>
            <label className="flex items-center justify-between gap-3 p-3 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer">
              <span className="text-slate-300">
                {t('Inclure la ventilation par coffre Solana SPL', 'Include per-wallet SPL breakdown')}
              </span>
              <input
                type="checkbox"
                checked={includeWallets}
                onChange={(e) => setIncludeWallets(e.target.checked)}
                className="w-4 h-4 accent-amber-500"
              />
            </label>
            <label className="flex items-center justify-between gap-3 p-3 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer">
              <span className="text-slate-300">
                {t('Inclure les 5 dernières transactions on-chain', 'Include latest 5 on-chain transactions')}
              </span>
              <input
                type="checkbox"
                checked={includeRecentTx}
                onChange={(e) => setIncludeRecentTx(e.target.checked)}
                className="w-4 h-4 accent-amber-500"
              />
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/60 flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            {t('Prêt pour téléchargement direct (.pdf)', 'Ready for direct download (.pdf)')}
          </span>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-700 text-xs font-medium text-slate-300 hover:bg-slate-800 whitespace-nowrap"
            >
              {t('Annuler', 'Cancel')}
            </button>
            <button
              type="button"
              disabled={isGenerating}
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 text-xs font-semibold transition-colors whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              {isGenerating
                ? t('Génération...', 'Generating...')
                : t('Télécharger le PDF', 'Download Summary PDF')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
