/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { KLTStoreProvider, useKLTStore } from './context/KLTStoreContext';
import { AppShell } from './components/AppShell';
import { DashboardView } from './pages/DashboardView';
import { BuySellView } from './pages/BuySellView';
import { TradeView } from './pages/TradeView';
import { SolanaHubView } from './pages/SolanaHubView';
import { WalletView } from './pages/WalletView';
import { HistoryExportView } from './pages/HistoryExportView';
import { LiveStatsRatesView } from './pages/LiveStatsRatesView';
import { DaoGovernanceView } from './pages/DaoGovernanceView';
import { PresentationView, WhitepaperView } from './pages/EcosystemWhitepaperView';
import { FaqView } from './pages/FaqView';
import {
  DevnetOpsView,
  SecurityAuthView,
  SettingsProfileView,
  SubscriptionCheckoutView,
} from './pages/AccountAdminViews';
import { ActionPlanComplianceView, RefundPolicyView } from './pages/ComplianceRefundView';
import { EightPillarsReportingView, ReferralProgramView } from './pages/ReferralAndPillarsView';

const RouteView: React.FC = () => {
  const { route } = useKLTStore();

  switch (route) {
    case 'dashboard':
      return <DashboardView />;
    case 'buy':
      return <BuySellView mode="buy" />;
    case 'sell':
      return <BuySellView mode="sell" />;
    case 'trade':
    case 'advanced-chart':
      return <TradeView />;
    case 'solana-trading':
      return <SolanaHubView />;
    case 'wallet':
    case 'wallets':
      return <WalletView />;
    case 'history':
    case 'export-pdf':
      return <HistoryExportView />;
    case 'live-statistics':
      return <LiveStatsRatesView initialTab="stats" />;
    case 'crypto-rates':
      return <LiveStatsRatesView initialTab="rates" />;
    case 'dao':
      return <DaoGovernanceView />;
    case 'presentation':
      return <PresentationView />;
    case 'klt-token':
      return <PresentationView initialSection="klt-token" />;
    case 'roadmap':
      return <PresentationView initialSection="roadmap" />;
    case 'pillars-reporting':
      return <EightPillarsReportingView />;
    case 'referral':
      return <ReferralProgramView />;
    case 'whitepaper':
      return <WhitepaperView />;
    case 'faq':
      return <FaqView initialAdminTab={false} />;
    case 'faq-admin':
      return <FaqView initialAdminTab={true} />;
    case 'devnet-ops':
      return <DevnetOpsView />;
    case 'settings':
    case 'profile':
      return <SettingsProfileView />;
    case '2fa':
      return <SecurityAuthView initialTab="2fa" />;
    case 'login-history':
      return <SecurityAuthView initialTab="sessions" />;
    case 'subscription':
    case 'checkout':
      return <SubscriptionCheckoutView />;
    case 'remboursement':
      return <RefundPolicyView />;
    case 'action-plan':
      return <ActionPlanComplianceView />;
    default:
      return <DashboardView />;
  }
};

export default function App() {
  return (
    <KLTStoreProvider>
      <AppShell>
        <RouteView />
      </AppShell>
    </KLTStoreProvider>
  );
}
