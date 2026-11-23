import {
  CryptoAsset,
  CsvUserRecord,
  DaoProposal,
  DevnetState,
  FaqItem,
  LoginSession,
  OpenOrderRecord,
  PricePoint,
  ReferralRecord,
  SubscriptionPlan,
  TransactionRecord,
  UserProfile,
  WalletRecord,
} from '../types/klt';

export const KLT_LOGO_PATH = '/assets/aistudio/KLT_18088d48__1__d3bdd5e7.jpg';

export const FX_RATES: Record<'USD' | 'EUR' | 'XOF', number> = {
  USD: 1,
  EUR: 0.92,
  XOF: 603.5,
};

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 1,
  openId: 'EUMpQYUhqRm2DxgmRrWzVw',
  name: 'Adama Fanny Sheickner',
  email: 'fannyadama159@gmail.com',
  loginMethod: 'google',
  role: 'admin',
  createdAt: '2026-05-16 13:42:34',
  lastSignedIn: '2026-11-20 17:12:50',
  preferredCurrency: 'USD',
  twoFactorEnabled: true,
  notifications: {
    priceAlerts: true,
    tradeConfirmations: true,
    daoProposals: true,
    securityLogins: true,
  },
  privacy: {
    hideBalancesByDefault: false,
    publicLeaderboard: true,
  },
};

// P0 Purge exécutée : 4 comptes @test.com (ID 720001-720004) supprimés de la base de production
export const PURGED_TEST_ACCOUNTS_COUNT = 4;

export const CSV_USERS_REGISTRY: CsvUserRecord[] = [
  {
    id: 1,
    openId: 'EUMpQYUhqRm2DxgmRrWzVw',
    name: 'Adama Fanny Sheickner',
    email: 'fannyadama159@gmail.com',
    loginMethod: 'google',
    role: 'admin',
    createdAt: '2026-05-16 13:42:34',
    updatedAt: '2026-11-20 17:12:50',
    lastSignedIn: '2026-11-20 17:12:50',
    referralType: 'Fondateur / Admin',
  },
];

export const INITIAL_WALLETS: WalletRecord[] = [
  {
    id: 'w-main-sol',
    label: 'Coffre Principal Maison Mark Kanich',
    network: 'Solana Mainnet',
    walletAddress: '7KLTx9mQpR4vN2wB8yH5cZ1eJ6fM3aU9dS4kT8nV2xPq',
    kltBalance: 125450.5,
    solBalance: 18.42,
    isDefault: true,
    createdAt: '2026-05-16 13:45:00',
  },
  {
    id: 'w-devnet-ops',
    label: 'Trésorerie Opérations Devnet',
    network: 'Solana Devnet',
    walletAddress: '3DevKLTp8W2xQ9vM5nC7rT1yB6hF4jL8zP2sX5uA9mKqR',
    kltBalance: 24500.0,
    solBalance: 4.85,
    isDefault: false,
    createdAt: '2026-08-12 10:20:00',
  },
];

export const INITIAL_TRANSACTIONS: TransactionRecord[] = [
  {
    id: 'tx-1001',
    type: 'buy',
    kltAmount: 15000,
    pricePerKlt: 0.45,
    totalAmount: 6750,
    currency: 'USD',
    paymentMethod: 'Solana Pay / Phantom',
    status: 'Completed',
    txHash: '5xKLT8mN...9qR2',
    description: 'Acquisition $KLT · Tranche Écosystème',
    createdAt: '2026-11-22 14:28:10',
  },
  {
    id: 'tx-1002',
    type: 'reward',
    kltAmount: 482.75,
    pricePerKlt: 0.45,
    totalAmount: 217.24,
    currency: 'USD',
    paymentMethod: 'Staking Pool (15% APY)',
    status: 'Completed',
    txHash: '3mStK9pW...4vL1',
    description: 'Distribution rendement Staking 15% APY',
    createdAt: '2026-11-21 09:00:00',
  },
  {
    id: 'tx-1003',
    type: 'referral',
    kltAmount: 1250,
    pricePerKlt: 0.44,
    totalAmount: 550,
    currency: 'USD',
    paymentMethod: 'Programme Parrainage KLT',
    status: 'Completed',
    txHash: '9rRfL2xZ...7bN8',
    description: 'Bonus parrainage vérifié (Code MK-ADAMA-01)',
    createdAt: '2026-11-20 17:15:32',
  },
  {
    id: 'tx-1004',
    type: 'trade',
    kltAmount: 5000,
    pricePerKlt: 0.435,
    totalAmount: 2175,
    currency: 'USD',
    paymentMethod: 'Order Book Limit',
    status: 'Completed',
    txHash: '2tTrD6yC...1wP5',
    description: 'Ordre limite exécuté KLT/USD',
    createdAt: '2026-11-18 11:42:19',
  },
  {
    id: 'tx-1005',
    type: 'swap',
    kltAmount: 8200,
    pricePerKlt: 0.428,
    totalAmount: 24.2,
    currency: 'SOL',
    paymentMethod: 'Raydium AMM Pool',
    status: 'Completed',
    txHash: '8sSwP4nJ...6kM3',
    description: 'Swap SOL → $KLT via Bonding Curve Raydium',
    createdAt: '2026-11-15 19:05:44',
  },
  {
    id: 'tx-1006',
    type: 'sell',
    kltAmount: 2000,
    pricePerKlt: 0.44,
    totalAmount: 880,
    currency: 'USD',
    paymentMethod: 'Carte Visa Virtuelle KLT',
    status: 'Completed',
    txHash: '4vVsA7qE...2cH9',
    description: 'Conversion partielle vers solde Carte Visa',
    createdAt: '2026-11-12 08:19:03',
  },
];

export const INITIAL_OPEN_ORDERS: OpenOrderRecord[] = [
  {
    id: 'ord-301',
    side: 'buy',
    orderType: 'limit',
    kltAmount: 4000,
    limitPrice: 0.42,
    totalUsd: 1680,
    status: 'Open',
    createdAt: '2026-11-22 10:15:00',
  },
  {
    id: 'ord-302',
    side: 'sell',
    orderType: 'limit',
    kltAmount: 2500,
    limitPrice: 0.52,
    totalUsd: 1300,
    status: 'Open',
    createdAt: '2026-11-21 16:40:00',
  },
];

export const CRYPTO_ASSETS: CryptoAsset[] = [
  {
    symbol: 'KLT',
    name: 'Kanich Luxury Token',
    priceUsd: 0.45,
    change24h: 8.42,
    high24h: 0.468,
    low24h: 0.412,
    volume24h: 4280000,
    marketCap: 45000000,
    color: '#F59E0B',
  },
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    priceUsd: 89420.0,
    change24h: 2.18,
    high24h: 90150.0,
    low24h: 87310.0,
    volume24h: 38400000000,
    marketCap: 1765000000000,
    color: '#FB923C',
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    priceUsd: 3185.5,
    change24h: 3.04,
    high24h: 3240.0,
    low24h: 3090.0,
    volume24h: 16200000000,
    marketCap: 383000000000,
    color: '#60A5FA',
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    priceUsd: 198.4,
    change24h: 5.67,
    high24h: 204.2,
    low24h: 187.5,
    volume24h: 5900000000,
    marketCap: 93800000000,
    color: '#34D399',
  },
  {
    symbol: 'ADA',
    name: 'Cardano',
    priceUsd: 0.98,
    change24h: -1.12,
    high24h: 1.02,
    low24h: 0.95,
    volume24h: 980000000,
    marketCap: 34400000000,
    color: '#38BDF8',
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    priceUsd: 1.0,
    change24h: 0.01,
    high24h: 1.001,
    low24h: 0.999,
    volume24h: 7400000000,
    marketCap: 38200000000,
    color: '#94A3B8',
  },
  {
    symbol: 'BNB',
    name: 'BNB Chain',
    priceUsd: 624.8,
    change24h: 1.45,
    high24h: 632.0,
    low24h: 612.4,
    volume24h: 2100000000,
    marketCap: 90100000000,
    color: '#FBBF24',
  },
  {
    symbol: 'AVAX',
    name: 'Avalanche',
    priceUsd: 38.65,
    change24h: -0.74,
    high24h: 39.8,
    low24h: 37.9,
    volume24h: 540000000,
    marketCap: 15800000000,
    color: '#F87171',
  },
];

export function generateKltSeries(timeframe: '24h' | '7d' | '1m' | '1y'): PricePoint[] {
  const counts: Record<typeof timeframe, number> = {
    '24h': 24,
    '7d': 28,
    '1m': 30,
    '1y': 24,
  };
  const n = counts[timeframe];
  const baseStart = timeframe === '24h' ? 0.415 : timeframe === '7d' ? 0.365 : timeframe === '1m' ? 0.31 : 0.14;
  const endPrice = 0.45;
  const points: PricePoint[] = [];

  for (let i = 0; i < n; i++) {
    const progress = i / (n - 1);
    const wave = Math.sin(i * 0.65) * 0.014 + Math.cos(i * 1.1) * 0.008;
    const trend = baseStart + (endPrice - baseStart) * progress;
    const close = i === n - 1 ? endPrice : Math.max(0.08, +(trend + wave).toFixed(4));
    const prevClose = i === 0 ? baseStart : points[i - 1].close;
    const open = prevClose;
    const high = +(Math.max(open, close) + Math.abs(Math.sin(i + 1)) * 0.011).toFixed(4);
    const low = +(Math.min(open, close) - Math.abs(Math.cos(i + 2)) * 0.009).toFixed(4);
    const label =
      timeframe === '24h'
        ? `${String(i).padStart(2, '0')}:00`
        : timeframe === '7d'
        ? `J${Math.floor(i / 4) + 1} · ${(i % 4) * 6}h`
        : timeframe === '1m'
        ? `J-${n - 1 - i}`
        : `M${i + 1}`;
    points.push({
      label,
      price: close,
      open,
      high,
      low,
      close,
      volume: Math.round(140000 + Math.abs(Math.sin(i * 1.7)) * 280000),
    });
  }
  return points;
}

export const COMPARISON_7D_DATA: Array<Record<string, number | string>> = [
  { day: 'J-6', KLT: 100.0, BTC: 100.0, ETH: 100.0, SOL: 100.0, ADA: 100.0 },
  { day: 'J-5', KLT: 103.4, BTC: 101.2, ETH: 100.8, SOL: 102.5, ADA: 99.4 },
  { day: 'J-4', KLT: 106.8, BTC: 100.5, ETH: 102.1, SOL: 104.2, ADA: 98.7 },
  { day: 'J-3', KLT: 109.1, BTC: 102.9, ETH: 103.5, SOL: 107.8, ADA: 100.2 },
  { day: 'J-2', KLT: 114.5, BTC: 104.1, ETH: 104.9, SOL: 109.6, ADA: 99.8 },
  { day: 'J-1', KLT: 118.2, BTC: 105.0, ETH: 106.2, SOL: 112.4, ADA: 99.1 },
  { day: 'Auj.', KLT: 123.3, BTC: 106.4, ETH: 107.8, SOL: 115.1, ADA: 98.9 },
];

export const INITIAL_DAO_PROPOSALS: DaoProposal[] = [
  {
    id: 'KIP-014',
    title: 'Allocation de 250 000 $KLT au corridor NationeX Abidjan–Lagos',
    titleEn: 'Allocate 250,000 $KLT to NationeX Abidjan–Lagos Corridor',
    description:
      'Financement des incitations de règlement transfrontalier pour les PME partenaires utilisant NationeX et KIIS CashFlow en Afrique de l’Ouest.',
    descriptionEn:
      'Fund cross-border settlement incentives for partner SMEs using NationeX and KIIS CashFlow across West Africa.',
    category: 'Écosystème',
    status: 'Active',
    votesFor: 684000,
    votesAgainst: 112000,
    quorumRequired: 500000,
    endsAt: '2026-11-30',
    author: 'KIIS Global Treasury',
  },
  {
    id: 'KIP-015',
    title: 'Déploiement de la Carte Visa Virtuelle KLT pour les détenteurs Tier Argent+',
    titleEn: 'Launch Virtual KLT Visa Card for Silver+ Staking Tiers',
    description:
      'Ouverture de l’émission des cartes virtuelles Visa adossées au solde $KLT staké dès 5 000 $KLT verrouillés.',
    descriptionEn:
      'Enable virtual Visa card issuance backed by staked $KLT balances starting at 5,000 locked $KLT.',
    category: 'Technique',
    status: 'Active',
    votesFor: 540200,
    votesAgainst: 89400,
    quorumRequired: 500000,
    endsAt: '2026-12-05',
    author: 'Mark Kanich Product Lab',
  },
  {
    id: 'KIP-012',
    title: 'Brûlage pré-lancement définitif de 30 000 000 $KLT (30% Offre Totale)',
    titleEn: 'Pre-launch Permanent Burn of 30,000,000 $KLT (30% Total Supply)',
    description:
      'Incinération vérifiable sur la blockchain Solana de 30% de l’offre totale afin de renforcer la rareté structurelle du $KLT.',
    descriptionEn:
      'Verifiable on-chain burn on Solana of 30% of total supply to reinforce structural scarcity of $KLT.',
    category: 'Tokenomics',
    status: 'Passed',
    votesFor: 1420000,
    votesAgainst: 32000,
    quorumRequired: 500000,
    endsAt: '2026-11-10',
    author: 'Adama Fanny Sheickner',
  },
  {
    id: 'KIP-011',
    title: 'Partenariat Villagia Intercontinentale : Tokenisation Résidence Iroko',
    titleEn: 'Villagia Intercontinentale Partnership: Iroko Residence Tokenization',
    description:
      'Pilote de fractionnement immobilier à Abidjan permettant aux détenteurs $KLT d’accéder aux rendements locatifs.',
    descriptionEn:
      'Real-estate fractionalization pilot in Abidjan granting $KLT holders access to rental yield participation.',
    category: 'Trésorerie',
    status: 'Executed',
    votesFor: 980000,
    votesAgainst: 74000,
    quorumRequired: 500000,
    endsAt: '2026-10-28',
    author: 'Beldozac Finance',
  },
];

export const INITIAL_FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'Général',
    questionFr: 'Qu’est-ce que le Kanich Luxury Token ($KLT) et la Maison Mark Kanich ?',
    questionEn: 'What is the Kanich Luxury Token ($KLT) and Maison Mark Kanich?',
    answerFr:
      'Piloté par KIIS Global depuis Abidjan, le $KLT est le jeton utilitaire unificateur de huit entités opérationnelles couvrant la technologie & finance (KIIS Global, KIIS CashFlow, Beldozac Finance, ImmoScale AI), l’immobilier & commerce (Villagia Intercontinentale, NationeX) et le luxe (Mark Kanich Fashion & Cosmétique).',
    answerEn:
      'Led by KIIS Global from Abidjan, $KLT is the unifying utility token across eight operational entities spanning Tech & Finance, Real Estate & Commerce, and Luxury Lifestyle.',
    helpfulVotes: 142,
    notHelpfulVotes: 4,
  },
  {
    id: 'faq-2',
    category: 'Pump.fun & Solana',
    questionFr: 'Pourquoi le $KLT est-il lancé sur Pump.fun avant la migration Raydium ?',
    questionEn: 'Why is $KLT launched via Pump.fun before Raydium migration?',
    answerFr:
      'Pump.fun garantit une transparence radicale et un risque de rug pull nul : la liquidité de la bonding curve migre automatiquement vers Raydium autour de 85–90 SOL (~65 000 $ Market Cap) et les tokens LP sont brûlés de manière irréversible.',
    answerEn:
      'Pump.fun guarantees radical transparency with zero rug-pull risk: bonding curve liquidity automatically migrates to Raydium around 85–90 SOL (~$65K Market Cap) and LP tokens are permanently burned.',
    helpfulVotes: 118,
    notHelpfulVotes: 6,
  },
  {
    id: 'faq-3',
    category: 'Staking & Carte',
    questionFr: 'Comment fonctionne le Staking à 15% APY et la Carte Visa Virtuelle ?',
    questionEn: 'How do 15% APY Staking and the Virtual Visa Card work?',
    answerFr:
      'Vous pouvez verrouiller vos $KLT directement dans le Hub Solana Trading ou votre Portefeuille KLT pour percevoir jusqu’à 15% APY en récompenses distribuées quotidiennement, tout en débloquant l’accès à la Carte Visa Virtuelle prévue au Q4 2026.',
    answerEn:
      'Lock your $KLT directly in the Solana Trading Hub or KLT Wallet to earn up to 15% APY distributed daily, unlocking access to the Virtual Visa Card scheduled for Q4 2026.',
    helpfulVotes: 96,
    notHelpfulVotes: 3,
  },
  {
    id: 'faq-4',
    category: 'Sécurité',
    questionFr: 'Quelles sont les 7 couches de sécurité de l’écosystème KLT ?',
    questionEn: 'What are the 7 security layers protecting the KLT ecosystem?',
    answerFr:
      'L’infrastructure repose sur : 1) Device Fingerprinting SHA-256, 2) Chiffrement AES-256-GCM, 3) Trésorerie Multi-Signature, 4) Détection de fraude par IA, 5) Row-Level Security (RLS), 6) Audits Smart Contracts, et 7) Programme Bug Bounty, complétés par la révocation Mint & Freeze Authority sur Solana.',
    answerEn:
      'Infrastructure relies on: 1) SHA-256 Device Fingerprinting, 2) AES-256-GCM Encryption, 3) Multi-Sig Treasury, 4) AI Fraud Detection, 5) Row-Level Security, 6) Smart Contract Audits, and 7) Bug Bounty Program, alongside revoked Mint & Freeze Authorities on Solana.',
    helpfulVotes: 109,
    notHelpfulVotes: 2,
  },
];

export const INITIAL_LOGIN_SESSIONS: LoginSession[] = [
  {
    id: 'sess-1',
    device: 'Workstation Chrome · Linux/macOS',
    browser: 'Chrome 131.0',
    location: 'Abidjan, Côte d’Ivoire',
    ip: '154.0.28.114',
    method: 'Google OAuth (fannyadama159@gmail.com)',
    timestamp: '2026-11-20 17:12:50',
    isCurrent: true,
    isSuspicious: false,
  },
  {
    id: 'sess-2',
    device: 'iPhone 16 Pro · Safari Mobile',
    browser: 'Safari 18',
    location: 'Abidjan, Côte d’Ivoire',
    ip: '154.0.29.42',
    method: 'Google OAuth + 2FA TOTP',
    timestamp: '2026-11-19 08:44:12',
    isCurrent: false,
    isSuspicious: false,
  },
  {
    id: 'sess-3',
    device: 'Navigateur Inconnu · Proxy',
    browser: 'Firefox 128',
    location: 'Francfort, Allemagne',
    ip: '198.51.100.78',
    method: 'Tentative bloquée (2FA requis)',
    timestamp: '2026-11-17 03:18:05',
    isCurrent: false,
    isSuspicious: true,
  },
];

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Standard',
    nameEn: 'Standard',
    audienceFr: 'Pour découvrir l’écosystème $KLT',
    audienceEn: 'For getting started with $KLT',
    monthlyPriceUsd: 0,
    yearlyPriceUsd: 0,
    stakingApyBoost: '10% APY',
    featuresFr: [
      'Portefeuille KLT & Solana SPL',
      'Achat / Vente instantané multi-devises',
      'Accès Gouvernance DAO (1x vote)',
      'Historique des transactions CSV',
    ],
    featuresEn: [
      'KLT & Solana SPL Wallet',
      'Instant multi-currency Buy / Sell',
      'DAO Governance Access (1x vote)',
      'CSV Transaction History',
    ],
  },
  {
    id: 'pro',
    name: 'Privilège Pro',
    nameEn: 'Privilege Pro',
    audienceFr: 'Pour les investisseurs actifs',
    audienceEn: 'For active traders & stakers',
    monthlyPriceUsd: 29,
    yearlyPriceUsd: 278,
    stakingApyBoost: '15% APY Max',
    highlighted: true,
    featuresFr: [
      'Tout le plan Standard inclus',
      'Staking optimisé jusqu’à 15% APY',
      'Accès prioritaire Carte Visa Virtuelle',
      'Graphiques avancés & ordres limites sans frais',
      'Exports PDF certifiés Maison Mark Kanich',
    ],
    featuresEn: [
      'Everything in Standard',
      'Boosted Staking up to 15% APY',
      'Priority Virtual Visa Card issuance',
      'Advanced technical charts & 0-fee limit orders',
      'Certified Maison Mark Kanich PDF statements',
    ],
  },
  {
    id: 'vip',
    name: 'Institutionnel VIP',
    nameEn: 'Institutional VIP',
    audienceFr: 'Pour trésoreries & partenaires Beldozac',
    audienceEn: 'For treasuries & Beldozac partners',
    monthlyPriceUsd: 99,
    yearlyPriceUsd: 950,
    stakingApyBoost: '15% APY + Bonus',
    featuresFr: [
      'Multi-Signature Treasury & Devnet Ops',
      'Accès direct deals Beldozac & Villagia',
      'Support concierge dédié Abidjan / International',
      'Quotas API temps réel & alertes IA',
    ],
    featuresEn: [
      'Multi-Sig Treasury & Devnet Ops',
      'Direct Beldozac & Villagia deal flow',
      'Dedicated Abidjan / Global concierge',
      'Real-time API & AI fraud alerts',
    ],
  },
];

export const INITIAL_DEVNET_STATE: DevnetState = {
  payerAddress: 'KLTDevPayer9xQ4wR7vN2mB8yH5cZ1eJ6fM3aU9dS4kT8n',
  payerSolBalance: 4.8524,
  poolId: '58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2',
  mintA: 'So11111111111111111111111111111111111111112',
  mintB: 'KLT9xMpR4vN2wB8yH5cZ1eJ6fM3aU9dS4kT8nV2xPq',
  reserveABaseUnits: '86420000000',
  reserveBBaseUnits: '30000000000000',
};

export const ECOSYSTEM_PILLARS = [
  {
    pole: 'Pôle Technologie & Finance',
    poleEn: 'Technology & Finance Division',
    items: [
      {
        name: 'KIIS Global',
        descFr: 'Colonne vertébrale technologique. Solutions Web3, infrastructures de paiement et audits de sécurité.',
        descEn: 'Technological backbone. Web3 solutions, payment infrastructures, and security audits.',
      },
      {
        name: 'KIIS CashFlow',
        descFr: 'Optimisation de liquidité et automatisation bancaire (type QuickBooks/Xero) pour les entreprises.',
        descEn: 'Liquidity optimization and banking automation for enterprises.',
      },
      {
        name: 'Beldozac Finance',
        descFr: 'Bras de Capital-Risque dédié au financement de startups en Afrique de l’Ouest.',
        descEn: 'Venture Capital arm dedicated to funding West African startups.',
      },
      {
        name: 'ImmoScale AI',
        descFr: 'SaaS d’IA pour l’immobilier : repurposing de contenu, SEO et analyse prédictive.',
        descEn: 'AI SaaS for real estate: content repurposing, SEO, and predictive analytics.',
      },
    ],
  },
  {
    pole: 'Pôle Immobilier & Commerce',
    poleEn: 'Real Estate & Commerce Division',
    items: [
      {
        name: 'Villagia Intercontinentale',
        descFr: 'Développement de projets immobiliers premium et durables, d’Abidjan aux capitales africaines.',
        descEn: 'Premium sustainable real-estate developments from Abidjan across African capitals.',
      },
      {
        name: 'NationeX',
        descFr: 'Facilitation des échanges commerciaux transfrontaliers, réduisant les frictions logistiques.',
        descEn: 'Cross-border trade facilitation reducing logistical friction.',
      },
    ],
  },
  {
    pole: 'Pôle Luxe & Lifestyle',
    poleEn: 'Luxury & Lifestyle Division',
    items: [
      {
        name: 'Mark Kanich Fashion',
        descFr: 'Haute couture et prêt-à-porter célébrant l’élégance et le savoir-faire artisanal.',
        descEn: 'Haute couture and ready-to-wear celebrating elegance and artisanal craftsmanship.',
      },
      {
        name: 'Mark Kanich Cosmétique',
        descFr: 'Soins et beauté haut de gamme, alliant ingrédients naturels et innovation.',
        descEn: 'Luxury skincare and beauty uniting natural ingredients with innovation.',
      },
    ],
  },
];

export const TOKENOMICS_ALLOCATION = [
  {
    labelFr: 'Liquidité Initiale',
    labelEn: 'Initial Liquidity',
    percent: 35,
    amount: '35 000 000',
    mechanismFr: 'Injectée dans la bonding curve Pump.fun, puis migrée et brûlée automatiquement sur Raydium.',
    mechanismEn: 'Injected into Pump.fun bonding curve, then auto-migrated & burned on Raydium.',
    color: '#F59E0B',
  },
  {
    labelFr: 'Brûlage Définitif',
    labelEn: 'Permanent Burn',
    percent: 30,
    amount: '30 000 000',
    mechanismFr: 'Détruits à jamais avant le lancement (Adresse d’incinération Solana).',
    mechanismEn: 'Permanently destroyed pre-launch (Solana incinerator address).',
    color: '#EF4444',
  },
  {
    labelFr: 'Équipe & Développement',
    labelEn: 'Team & Development',
    percent: 20,
    amount: '20 000 000',
    mechanismFr: 'Vesting linéaire sur 24 mois, avec un cliff de 6 mois.',
    mechanismEn: '24-month linear vesting with a 6-month cliff.',
    color: '#3B82F6',
  },
  {
    labelFr: 'Communauté & Partenariats',
    labelEn: 'Community & Partnerships',
    percent: 15,
    amount: '15 000 000',
    mechanismFr: 'Portefeuille public dédié aux airdrops, staking et récompenses.',
    mechanismEn: 'Public wallet dedicated to airdrops, staking, and rewards.',
    color: '#10B981',
  },
];

export const ROADMAP_PHASES = [
  {
    quarter: 'Q3 2026',
    titleFr: 'Fondation',
    titleEn: 'Foundation',
    pointsFr: [
      'Lancement Beta de l’écosystème Maison Mark Kanich',
      'IDO du $KLT via Pump.fun (transparence radicale)',
      'Verrouillage et burn automatique de la liquidité sur Raydium',
    ],
  },
  {
    quarter: 'Q4 2026',
    titleFr: 'Expansion',
    titleEn: 'Expansion',
    pointsFr: [
      'Intégration Carte Visa Virtuelle KLT',
      'Lancement Marketplace NFT « Tiers d’Accès »',
      'Partenariats de capital-risque Beldozac Finance',
    ],
  },
  {
    quarter: 'Q1 2027',
    titleFr: 'Ancrage Réel',
    titleEn: 'Real-World Anchoring',
    pointsFr: [
      'Application Mobile native (iOS / Android)',
      'Tokenisation des actifs immobiliers Villagia Intercontinentale',
      'Intégration complète ImmoScale AI',
    ],
  },
  {
    quarter: 'Q2 2027',
    titleFr: 'Internationalisation',
    titleEn: 'Internationalization',
    pointsFr: [
      'Expansion régionale Beldozac Finance',
      'Ouverture de 3 corridors commerciaux NationeX',
      'Listing sur plateformes CEX de premier plan',
    ],
  },
];

export const SIX_MAISONS = [
  {
    id: 'maison-fashion',
    index: '01',
    name: 'Mark Kanich Fashion',
    domainFr: 'Haute Couture & Savoir-Faire',
    domainEn: 'Haute Couture & Craftsmanship',
    descFr:
      'Maison de couture et de prêt-à-porter de luxe célébrant l’élégance contemporaine africaine et le travail d’atelier.',
    descEn:
      'Luxury couture and ready-to-wear house celebrating contemporary African elegance and atelier craftsmanship.',
    targetAnchor: '#tiers',
  },
  {
    id: 'maison-cosmetique',
    index: '02',
    name: 'Mark Kanich Cosmétique',
    domainFr: 'Soins & Haute Parfumerie',
    domainEn: 'Skincare & Haute Parfumerie',
    descFr:
      'Formulations d’exception unissant actifs botaniques africains, pureté dermatologique et rituel de soin haut de gamme.',
    descEn:
      'Exceptional formulations uniting African botanical actives, dermatological purity, and luxury skincare rituals.',
    targetAnchor: '#klt-token',
  },
  {
    id: 'maison-villagia',
    index: '03',
    name: 'Villagia Intercontinentale',
    domainFr: 'Architecture & Immobilier',
    domainEn: 'Architecture & Real Estate',
    descFr:
      'Développement de résidences patrimoniales et durables, reliant Abidjan aux grandes métropoles africaines.',
    descEn:
      'Development of heritage and sustainable residential estates connecting Abidjan to major African capitals.',
    targetAnchor: '#roadmap',
  },
  {
    id: 'maison-beldozac',
    index: '04',
    name: 'Beldozac Finance',
    domainFr: 'Capital-Risque & Structuration',
    domainEn: 'Venture Capital & Structuring',
    descFr:
      'Bras financier et d’investissement dédié aux entreprises technologiques et industrielles à forte croissance en Afrique de l’Ouest.',
    descEn:
      'Venture and financial structuring arm dedicated to high-growth technology and industrial enterprises across West Africa.',
    targetAnchor: '#tokenomics',
  },
  {
    id: 'maison-kiis',
    index: '05',
    name: 'KIIS Global & CashFlow',
    domainFr: 'Infrastructure Web3 & Trésorerie',
    domainEn: 'Web3 Infrastructure & Treasury',
    descFr:
      'Colonne vertébrale technologique pilotant les paiements, la gestion de trésorerie automatisée et la sécurité blockchain.',
    descEn:
      'Technological backbone powering payments, automated corporate treasury, and blockchain security audits.',
    targetAnchor: '#securite',
  },
  {
    id: 'maison-nationex',
    index: '06',
    name: 'NationeX & ImmoScale AI',
    domainFr: 'Commerce Transfrontalier & IA',
    domainEn: 'Cross-Border Trade & AI',
    descFr:
      'Corridors commerciaux fluides et intelligence artificielle prédictive appliquée à la valorisation d’actifs réels.',
    descEn:
      'Frictionless cross-border trade corridors paired with predictive artificial intelligence for real-world assets.',
    targetAnchor: '#acquerir',
  },
];

export const KLT_TOKEN_PILLARS = [
  {
    key: 'lien',
    titleFr: 'Lien commun',
    titleEn: 'Common Bond',
    descFr:
      'Un actif d’appartenance unifiant les Six Maisons, nos mécènes, nos partenaires industriels et la communauté internationale autour d’une même vision.',
    descEn:
      'A unifying asset connecting the Six Houses, patrons, industrial partners, and the global community under a single vision.',
  },
  {
    key: 'utilite',
    titleFr: 'Utilité',
    titleEn: 'Real Utility',
    descFr:
      'Staking jusqu’à 15% APY, accès aux Tiers Kanich, règlements transfrontaliers NationeX, privilèges Couture et gouvernance DAO.',
    descEn:
      'Up to 15% APY staking, Kanich Tiers access, NationeX cross-border settlement, Couture privileges, and DAO governance.',
  },
  {
    key: 'transparence',
    titleFr: 'Transparence',
    titleEn: 'Transparency',
    descFr:
      'Offre fixe immuable de 100 000 000 $KLT sur Solana, autorités Mint et Freeze révoquées, liquidité verrouillée et preuves vérifiables on-chain.',
    descEn:
      'Immutable 100,000,000 $KLT fixed supply on Solana, revoked Mint & Freeze authorities, locked liquidity, and verifiable on-chain proofs.',
  },
];

export const ACCESS_TIERS = [
  {
    id: 'black',
    title: 'KANICH BLACK',
    levelFr: 'Fondamental',
    levelEn: 'Foundational',
    requirement: '1 000+ $KLT',
    descFr:
      'L’entrée dans le cercle de la Maison : accès aux droits de vote DAO fondamentaux, aux actualités privées et aux distributions communautaires.',
    descEn:
      'Entry into the Maison circle: access to foundational DAO voting rights, private dispatches, and community distributions.',
    accent: 'neutral' as const,
  },
  {
    id: 'gold',
    title: 'KANICH GOLD',
    levelFr: 'Premium',
    levelEn: 'Premium',
    requirement: '10 000+ $KLT',
    descFr:
      'Le rang privilégié ouvrant le staking bonifié à 15% APY, les avant-premières Mark Kanich Fashion & Cosmétique et la Carte Visa Virtuelle.',
    descEn:
      'Privileged tier unlocking boosted 15% APY staking, Mark Kanich Fashion & Cosmetics previews, and the Virtual Visa Card.',
    accent: 'gold' as const,
  },
  {
    id: 'platinum',
    title: 'KANICH PLATINUM',
    levelFr: 'Élite',
    levelEn: 'Elite',
    requirement: '50 000+ $KLT',
    descFr:
      'La distinction souveraine réservée aux détenteurs majeurs : conciergerie dédiée à Abidjan, co-investissements Beldozac et priorité Villagia.',
    descEn:
      'Sovereign distinction reserved for major holders: dedicated Abidjan concierge, Beldozac co-investment access, and Villagia priority.',
    accent: 'platinum' as const,
  },
];

export const INITIAL_REFERRALS: ReferralRecord[] = [
  {
    id: 'ref-101',
    partnerName: 'Kouassi Yao',
    tier: 'KANICH GOLD',
    code: 'MK-ADAMA-01',
    volumeUsd: 8400,
    rewardKlt: 650,
    status: 'Active',
    joinedAt: '2026-10-18',
  },
  {
    id: 'ref-102',
    partnerName: 'Awa Diallo',
    tier: 'KANICH PLATINUM',
    code: 'MK-ADAMA-01',
    volumeUsd: 24500,
    rewardKlt: 1850,
    status: 'Active',
    joinedAt: '2026-11-04',
  },
  {
    id: 'ref-103',
    partnerName: 'Konan Serge',
    tier: 'KANICH BLACK',
    code: 'MK-ADAMA-01',
    volumeUsd: 1900,
    rewardKlt: 250,
    status: 'Pending',
    joinedAt: '2026-11-19',
  },
];

export const PSP_COMPARISON_MATRIX = [
  {
    criterionFr: 'Frais de transaction',
    criterionEn: 'Transaction Fees',
    paddle: '5% + 0,50 $',
    paystack: '~3,9% + frais fixes',
    cinetpay: '~3,5% à 5% (Mobile Money)',
  },
  {
    criterionFr: 'Devises collectées',
    criterionEn: 'Supported Currencies',
    paddle: 'USD, EUR, GBP',
    paystack: 'XOF (FCFA), USD, EUR, NGN',
    cinetpay: 'XOF (FCFA) uniquement',
  },
  {
    criterionFr: 'Moyens de paiement',
    criterionEn: 'Payment Methods',
    paddle: 'Carte bancaire internationale',
    paystack: 'Carte + Wave + Orange Money + MTN MoMo',
    cinetpay: 'Wave + Orange Money + MTN MoMo + Carte',
  },
  {
    criterionFr: 'Délai de versement (Payout)',
    criterionEn: 'Payout Delay',
    paddle: 'Mensuel (avant le 15)',
    paystack: 'J+1 à J+2 ouvrés',
    cinetpay: 'Instantané ou J+1 compte local',
  },
  {
    criterionFr: 'Frais de retrait',
    criterionEn: 'Withdrawal Fees',
    paddle: '~15 $ (SWIFT) + banque',
    paystack: 'Faibles (virement UEMOA)',
    cinetpay: 'Faibles (virement UEMOA)',
  },
  {
    criterionFr: 'Idéal pour',
    criterionEn: 'Best For',
    paddle: 'SaaS B2B international (Stipulor)',
    paystack: 'Mixte Carte + Mobile Money',
    cinetpay: '100% Afrique de l’Ouest FCFA',
  },
];

export const EIGHT_PILLARS_REPORTING = [
  {
    id: 'kiis-global',
    name: 'KIIS Global',
    divisionFr: 'Tech & Finance',
    divisionEn: 'Tech & Finance',
    revenueUsd: 428000,
    growthPct: 24.6,
    activeProjects: 14,
    kltSettlementShare: 38,
    statusFr: 'Opérationnel',
    statusEn: 'Operational',
  },
  {
    id: 'kiis-cashflow',
    name: 'KIIS CashFlow',
    divisionFr: 'Tech & Finance',
    divisionEn: 'Tech & Finance',
    revenueUsd: 312500,
    growthPct: 31.2,
    activeProjects: 46,
    kltSettlementShare: 22,
    statusFr: 'Croissance SaaS',
    statusEn: 'SaaS Growth',
  },
  {
    id: 'beldozac',
    name: 'Beldozac Finance',
    divisionFr: 'Tech & Finance',
    divisionEn: 'Tech & Finance',
    revenueUsd: 890000,
    growthPct: 18.4,
    activeProjects: 7,
    kltSettlementShare: 45,
    statusFr: 'Actif',
    statusEn: 'Active',
  },
  {
    id: 'immoscale',
    name: 'ImmoScale AI',
    divisionFr: 'Tech & Finance',
    divisionEn: 'Tech & Finance',
    revenueUsd: 194200,
    growthPct: 42.1,
    activeProjects: 63,
    kltSettlementShare: 19,
    statusFr: 'Déploiement IA',
    statusEn: 'AI Rollout',
  },
  {
    id: 'villagia',
    name: 'Villagia Intercontinentale',
    divisionFr: 'Immobilier & Commerce',
    divisionEn: 'Real Estate & Commerce',
    revenueUsd: 1240000,
    growthPct: 15.8,
    activeProjects: 5,
    kltSettlementShare: 28,
    statusFr: 'Résidence Iroko',
    statusEn: 'Iroko Estate',
  },
  {
    id: 'nationex',
    name: 'NationeX',
    divisionFr: 'Immobilier & Commerce',
    divisionEn: 'Real Estate & Commerce',
    revenueUsd: 615000,
    growthPct: 29.4,
    activeProjects: 11,
    kltSettlementShare: 52,
    statusFr: 'Corridors Ouest',
    statusEn: 'West Corridors',
  },
  {
    id: 'mk-fashion',
    name: 'Mark Kanich Fashion',
    divisionFr: 'Luxe & Lifestyle',
    divisionEn: 'Luxury & Lifestyle',
    revenueUsd: 268000,
    growthPct: 21.0,
    activeProjects: 8,
    kltSettlementShare: 34,
    statusFr: 'Collection 2026',
    statusEn: '2026 Collection',
  },
  {
    id: 'mk-cosmetique',
    name: 'Mark Kanich Cosmétique',
    divisionFr: 'Luxe & Lifestyle',
    divisionEn: 'Luxury & Lifestyle',
    revenueUsd: 185400,
    growthPct: 27.5,
    activeProjects: 12,
    kltSettlementShare: 26,
    statusFr: 'Distribution CI',
    statusEn: 'CI Distribution',
  },
];

