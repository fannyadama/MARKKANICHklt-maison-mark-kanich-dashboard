export type RouteId =
  | 'dashboard'
  | 'presentation'
  | 'klt-token'
  | 'roadmap'
  | 'whitepaper'
  | 'buy'
  | 'sell'
  | 'trade'
  | 'advanced-chart'
  | 'solana-trading'
  | 'wallet'
  | 'wallets'
  | 'history'
  | 'export-pdf'
  | 'live-statistics'
  | 'crypto-rates'
  | 'dao'
  | 'faq'
  | 'faq-admin'
  | 'devnet-ops'
  | 'settings'
  | 'profile'
  | '2fa'
  | 'login-history'
  | 'subscription'
  | 'checkout';

export type Language = 'fr' | 'en';
export type FiatCurrency = 'USD' | 'EUR' | 'XOF';
export type UserRole = 'admin' | 'user';

export interface UserProfile {
  id: number;
  openId: string;
  name: string;
  email: string;
  loginMethod: string;
  role: UserRole;
  createdAt: string;
  lastSignedIn: string;
  preferredCurrency: FiatCurrency;
  twoFactorEnabled: boolean;
  notifications: {
    priceAlerts: boolean;
    tradeConfirmations: boolean;
    daoProposals: boolean;
    securityLogins: boolean;
  };
  privacy: {
    hideBalancesByDefault: boolean;
    publicLeaderboard: boolean;
  };
}

export interface CsvUserRecord {
  id: number;
  openId: string;
  name: string;
  email: string;
  loginMethod: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  lastSignedIn: string;
  referralType: 'Fondateur / Admin' | 'Parrain (Test)' | 'Filleul (Test)';
}

export interface WalletRecord {
  id: string;
  label: string;
  network: 'Solana Mainnet' | 'Solana Devnet';
  walletAddress: string;
  kltBalance: number;
  solBalance: number;
  isDefault: boolean;
  createdAt: string;
}

export type TransactionType = 'buy' | 'sell' | 'trade' | 'stake' | 'reward' | 'referral' | 'swap';

export interface TransactionRecord {
  id: string;
  type: TransactionType;
  kltAmount: number;
  pricePerKlt: number;
  totalAmount: number;
  currency: FiatCurrency | 'SOL' | 'USDC';
  paymentMethod?: string;
  status: 'Completed' | 'Pending' | 'Cancelled';
  txHash: string;
  description: string;
  createdAt: string;
}

export interface OpenOrderRecord {
  id: string;
  side: 'buy' | 'sell';
  orderType: 'limit' | 'market';
  kltAmount: number;
  limitPrice: number;
  totalUsd: number;
  status: 'Open' | 'Filled' | 'Cancelled';
  createdAt: string;
}

export interface CryptoAsset {
  symbol: string;
  name: string;
  priceUsd: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  marketCap: number;
  color: string;
}

export interface PricePoint {
  label: string;
  price: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface DaoProposal {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  category: 'Trésorerie' | 'Écosystème' | 'Tokenomics' | 'Technique';
  status: 'Active' | 'Passed' | 'Rejected' | 'Executed';
  votesFor: number;
  votesAgainst: number;
  quorumRequired: number;
  endsAt: string;
  author: string;
  userVote?: 'for' | 'against';
}

export interface FaqItem {
  id: string;
  category: 'Général' | 'Pump.fun & Solana' | 'Staking & Carte' | 'Sécurité';
  questionFr: string;
  questionEn: string;
  answerFr: string;
  answerEn: string;
  helpfulVotes: number;
  notHelpfulVotes: number;
  userFeedback?: 'helpful' | 'not_helpful';
}

export interface LoginSession {
  id: string;
  device: string;
  browser: string;
  location: string;
  ip: string;
  method: string;
  timestamp: string;
  isCurrent: boolean;
  isSuspicious: boolean;
}

export interface SubscriptionPlan {
  id: 'free' | 'pro' | 'vip';
  name: string;
  nameEn: string;
  audienceFr: string;
  audienceEn: string;
  monthlyPriceUsd: number;
  yearlyPriceUsd: number;
  stakingApyBoost: string;
  featuresFr: string[];
  featuresEn: string[];
  highlighted?: boolean;
}

export interface DevnetState {
  payerAddress: string;
  payerSolBalance: number;
  poolId: string;
  mintA: string;
  mintB: string;
  reserveABaseUnits: string;
  reserveBBaseUnits: string;
  lastQuote?: {
    timestamp: string;
    inputMint: string;
    amountInRaw: string;
    estimatedOutKlt: number;
    priceImpactPct: number;
    executed: boolean;
    txSignature?: string;
  };
}

export type NotificationCategory = 'transaction' | 'staking' | 'price_alert' | 'system';

export interface PriceAlertRule {
  id: string;
  condition: 'above' | 'below';
  targetPriceUsd: number;
  active: boolean;
  triggered: boolean;
  createdAt: string;
}

export interface NotificationLogItem {
  id: string;
  category: NotificationCategory;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionLabel?: string;
  actionRoute?: RouteId;
}

