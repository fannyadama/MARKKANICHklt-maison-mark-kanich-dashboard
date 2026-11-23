import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  CRYPTO_ASSETS,
  FX_RATES,
  INITIAL_DAO_PROPOSALS,
  INITIAL_DEVNET_STATE,
  INITIAL_FAQ_ITEMS,
  INITIAL_LOGIN_SESSIONS,
  INITIAL_OPEN_ORDERS,
  INITIAL_TRANSACTIONS,
  INITIAL_USER_PROFILE,
  INITIAL_WALLETS,
} from '../data/kltSeedData';
import {
  CryptoAsset,
  DaoProposal,
  DevnetState,
  FaqItem,
  FiatCurrency,
  Language,
  LoginSession,
  NotificationCategory,
  NotificationLogItem,
  OpenOrderRecord,
  PriceAlertRule,
  RouteId,
  TransactionRecord,
  UserProfile,
  UserRole,
  WalletRecord,
} from '../types/klt';

export interface ToastNotice {
  id: string;
  category: NotificationCategory;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  timestamp: string;
  actionLabel?: string;
  actionRoute?: RouteId;
}

export interface NotifyOptions {
  category?: NotificationCategory;
  title?: string;
  actionLabel?: string;
  actionRoute?: RouteId;
}

interface PersistedState {
  user: UserProfile;
  wallets: WalletRecord[];
  transactions: TransactionRecord[];
  openOrders: OpenOrderRecord[];
  daoProposals: DaoProposal[];
  faqItems: FaqItem[];
  loginSessions: LoginSession[];
  devnet: DevnetState;
  stakedKlt: number;
  stakingRewardsKlt: number;
  usdBalance: number;
  solanaConnected: boolean;
  solanaAddress: string;
  subscriptionPlan: 'free' | 'pro' | 'vip';
  billingCycle: 'monthly' | 'yearly';
  language: Language;
  hideBalances: boolean;
  priceAlerts: PriceAlertRule[];
  notificationsLog: NotificationLogItem[];
  lastStakingMilestoneKlt: number;
}

const STORAGE_KEY = 'klt_maison_mark_kanich_state_v1';

const DEFAULT_PRICE_ALERTS: PriceAlertRule[] = [
  {
    id: 'pa-1',
    condition: 'above',
    targetPriceUsd: 0.465,
    active: true,
    triggered: false,
    createdAt: '2026-11-22 10:00:00',
  },
  {
    id: 'pa-2',
    condition: 'below',
    targetPriceUsd: 0.42,
    active: true,
    triggered: false,
    createdAt: '2026-11-22 10:00:00',
  },
];

const DEFAULT_NOTIFICATIONS_LOG: NotificationLogItem[] = [
  {
    id: 'n-init-1',
    category: 'staking',
    type: 'success',
    title: 'Palier Staking Atteint · Tier Or',
    message: '35 000 $KLT stakés à 15% APY · 1 420.85 $KLT de récompenses accumulées.',
    timestamp: '2026-11-23 09:00:00',
    read: false,
    actionLabel: 'Réclamer',
    actionRoute: 'solana-trading',
  },
  {
    id: 'n-init-2',
    category: 'transaction',
    type: 'info',
    title: 'Acquisition $KLT Confirmée',
    message: '+15 000 $KLT crédités sur votre coffre principal (Hash 5xKLT8mN...9qR2).',
    timestamp: '2026-11-22 14:28:10',
    read: true,
    actionLabel: 'Historique',
    actionRoute: 'history',
  },
];

const DEFAULT_STATE: PersistedState = {
  user: INITIAL_USER_PROFILE,
  wallets: INITIAL_WALLETS,
  transactions: INITIAL_TRANSACTIONS,
  openOrders: INITIAL_OPEN_ORDERS,
  daoProposals: INITIAL_DAO_PROPOSALS,
  faqItems: INITIAL_FAQ_ITEMS,
  loginSessions: INITIAL_LOGIN_SESSIONS,
  devnet: INITIAL_DEVNET_STATE,
  stakedKlt: 35000,
  stakingRewardsKlt: 1420.85,
  usdBalance: 18450.0,
  solanaConnected: true,
  solanaAddress: '7KLTx9mQpR4vN2wB8yH5cZ1eJ6fM3aU9dS4kT8nV2xPq',
  subscriptionPlan: 'pro',
  billingCycle: 'yearly',
  language: 'fr',
  hideBalances: false,
  priceAlerts: DEFAULT_PRICE_ALERTS,
  notificationsLog: DEFAULT_NOTIFICATIONS_LOG,
  lastStakingMilestoneKlt: 1400,
};

function loadInitialState(): PersistedState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return {
      ...DEFAULT_STATE,
      ...parsed,
      user: { ...DEFAULT_STATE.user, ...(parsed.user || {}) },
      devnet: { ...DEFAULT_STATE.devnet, ...(parsed.devnet || {}) },
      priceAlerts: Array.isArray(parsed.priceAlerts) ? parsed.priceAlerts : DEFAULT_PRICE_ALERTS,
      notificationsLog: Array.isArray(parsed.notificationsLog)
        ? parsed.notificationsLog
        : DEFAULT_NOTIFICATIONS_LOG,
    };
  } catch {
    return DEFAULT_STATE;
  }
}

interface KLTStoreContextValue {
  route: RouteId;
  setRoute: (route: RouteId) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (fr: string, en: string) => string;
  user: UserProfile;
  updateUserProfile: (patch: Partial<UserProfile>) => void;
  setUserRole: (role: UserRole) => void;
  wallets: WalletRecord[];
  totalKltBalance: number;
  usdBalance: number;
  stakedKlt: number;
  stakingRewardsKlt: number;
  assets: CryptoAsset[];
  kltPriceUsd: number;
  refreshMarketPrices: () => void;
  transactions: TransactionRecord[];
  openOrders: OpenOrderRecord[];
  daoProposals: DaoProposal[];
  faqItems: FaqItem[];
  loginSessions: LoginSession[];
  devnet: DevnetState;
  solanaConnected: boolean;
  solanaAddress: string;
  toggleSolanaConnection: () => void;
  subscriptionPlan: 'free' | 'pro' | 'vip';
  billingCycle: 'monthly' | 'yearly';
  setSubscription: (plan: 'free' | 'pro' | 'vip', cycle: 'monthly' | 'yearly') => void;
  hideBalances: boolean;
  toggleHideBalances: () => void;
  formatFiat: (usdAmount: number, currencyOverride?: FiatCurrency) => string;
  buyKlt: (fiatAmount: number, currency: FiatCurrency, paymentMethod: string) => void;
  sellKlt: (kltAmount: number, currency: FiatCurrency) => boolean;
  placeOrder: (side: 'buy' | 'sell', orderType: 'market' | 'limit', kltAmount: number, limitPrice?: number) => boolean;
  cancelOrder: (orderId: string) => void;
  swapTokens: (payAsset: 'SOL' | 'USDC', payAmount: number) => boolean;
  stakeKlt: (amount: number) => boolean;
  unstakeKlt: (amount: number) => boolean;
  claimStakingRewards: () => void;
  createWallet: (label: string, network: 'Solana Mainnet' | 'Solana Devnet') => void;
  setDefaultWallet: (walletId: string) => void;
  deleteWallet: (walletId: string) => void;
  voteDaoProposal: (proposalId: string, direction: 'for' | 'against') => void;
  createDaoProposal: (title: string, description: string, category: DaoProposal['category']) => void;
  voteFaqItem: (faqId: string, feedback: 'helpful' | 'not_helpful') => void;
  revokeLoginSession: (sessionId: string) => void;
  revokeAllOtherSessions: () => void;
  requestDevnetAirdrop: () => void;
  runDevnetQuoteOrSwap: (inputMint: string, amountRaw: string, execute: boolean) => void;
  resetDemoState: () => void;
  toasts: ToastNotice[];
  notify: (message: string, type?: ToastNotice['type'], options?: NotifyOptions) => void;
  dismissToast: (id: string) => void;
  priceAlerts: PriceAlertRule[];
  notificationsLog: NotificationLogItem[];
  unreadNotificationsCount: number;
  addPriceAlert: (condition: 'above' | 'below', targetPriceUsd: number) => void;
  togglePriceAlert: (id: string) => void;
  deletePriceAlert: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotificationsLog: () => void;
  triggerSampleMilestoneOrAlert: (kind: 'staking' | 'price_alert') => void;
}

const KLTStoreContext = createContext<KLTStoreContextValue | null>(null);

function makeTxHash(): string {
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let prefix = '';
  let suffix = '';
  for (let i = 0; i < 6; i++) prefix += chars[Math.floor(Math.random() * chars.length)];
  for (let i = 0; i < 4; i++) suffix += chars[Math.floor(Math.random() * chars.length)];
  return `${prefix}...${suffix}`;
}

function nowTimestamp(): string {
  return new Date().toISOString().replace('T', ' ').slice(0, 19);
}

export const KLTStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PersistedState>(loadInitialState);
  const [route, setRouteState] = useState<RouteId>('dashboard');
  const [assets, setAssets] = useState<CryptoAsset[]>(CRYPTO_ASSETS);
  const [toasts, setToasts] = useState<ToastNotice[]>([]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [state]);

  const notify = useCallback(
    (message: string, type: ToastNotice['type'] = 'success', options?: NotifyOptions) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const category: NotificationCategory = options?.category ?? 'system';
      const defaultTitle =
        category === 'transaction'
          ? state.language === 'fr'
            ? 'Mise à jour Transaction'
            : 'Transaction Update'
          : category === 'staking'
          ? state.language === 'fr'
            ? 'Palier Staking $KLT'
            : '$KLT Staking Milestone'
          : category === 'price_alert'
          ? state.language === 'fr'
            ? 'Alerte Prix $KLT'
            : '$KLT Price Alert'
          : type === 'error'
          ? state.language === 'fr'
            ? 'Erreur'
            : 'Error'
          : state.language === 'fr'
          ? 'Notification'
          : 'Notification';

      const title = options?.title ?? defaultTitle;
      const timestamp = nowTimestamp();

      const toast: ToastNotice = {
        id,
        category,
        type,
        title,
        message,
        timestamp,
        actionLabel: options?.actionLabel,
        actionRoute: options?.actionRoute,
      };

      setToasts((prev) => [...prev.slice(-3), toast]);
      setState((prev) => ({
        ...prev,
        notificationsLog: [
          {
            id,
            category,
            type,
            title,
            message,
            timestamp,
            read: false,
            actionLabel: options?.actionLabel,
            actionRoute: options?.actionRoute,
          },
          ...prev.notificationsLog,
        ].slice(0, 30),
      }));

      window.setTimeout(() => {
        setToasts((prev) => prev.filter((item) => item.id !== id));
      }, 5500);
    },
    [state.language]
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const setRoute = useCallback((nextRoute: RouteId) => {
    setRouteState(nextRoute);
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  }, []);

  const t = useCallback(
    (fr: string, en: string) => (state.language === 'fr' ? fr : en),
    [state.language]
  );

  const setLanguage = useCallback((language: Language) => {
    setState((prev) => ({ ...prev, language }));
  }, []);

  const kltAsset = assets.find((a) => a.symbol === 'KLT') || assets[0];
  const kltPriceUsd = kltAsset.priceUsd;
  const totalKltBalance = state.wallets.reduce((sum, w) => sum + w.kltBalance, 0);

  // Live staking reward accrual & milestone checks every 25s
  useEffect(() => {
    if (state.stakedKlt <= 0) return;
    const interval = window.setInterval(() => {
      const increment = +((state.stakedKlt * 0.15) / (365 * 24 * 12)).toFixed(4);
      const rewardStep = Math.max(0.25, increment);
      setState((prev) => {
        const nextRewards = +(prev.stakingRewardsKlt + rewardStep).toFixed(2);
        const milestoneBracket = Math.floor(nextRewards / 50) * 50;
        if (milestoneBracket > prev.lastStakingMilestoneKlt && nextRewards >= milestoneBracket) {
          const id = `${Date.now()}-stake-ms`;
          const timestamp = nowTimestamp();
          const title = prev.language === 'fr' ? 'Palier Récompenses Staking' : 'Staking Reward Milestone';
          const message =
            prev.language === 'fr'
              ? `Vos récompenses cumulées ont atteint ${nextRewards.toFixed(2)} $KLT (15% APY).`
              : `Your accrued staking rewards reached ${nextRewards.toFixed(2)} $KLT (15% APY).`;
          setToasts((curr) => [
            ...curr.slice(-3),
            {
              id,
              category: 'staking',
              type: 'success',
              title,
              message,
              timestamp,
              actionLabel: prev.language === 'fr' ? 'Réclamer' : 'Claim',
              actionRoute: 'solana-trading',
            },
          ]);
          window.setTimeout(() => {
            setToasts((curr) => curr.filter((x) => x.id !== id));
          }, 5500);
          return {
            ...prev,
            stakingRewardsKlt: nextRewards,
            lastStakingMilestoneKlt: milestoneBracket,
            notificationsLog: [
              {
                id,
                category: 'staking' as const,
                type: 'success' as const,
                title,
                message,
                timestamp,
                read: false,
                actionLabel: prev.language === 'fr' ? 'Réclamer' : 'Claim',
                actionRoute: 'solana-trading' as const,
              },
              ...prev.notificationsLog,
            ].slice(0, 30),
          };
        }
        return { ...prev, stakingRewardsKlt: nextRewards };
      });
    }, 25000);
    return () => window.clearInterval(interval);
  }, [state.stakedKlt]);

  const refreshMarketPrices = useCallback(() => {
    let nextKltPrice = kltPriceUsd;
    let prevKltPrice = kltPriceUsd;

    setAssets((prev) =>
      prev.map((asset) => {
        if (asset.symbol === 'USDC') return asset;
        const deltaFactor = 1 + (Math.random() - 0.46) * 0.028;
        const nextPrice = +(asset.priceUsd * deltaFactor).toFixed(asset.priceUsd < 5 ? 4 : 2);
        const nextChange = +(asset.change24h + (Math.random() - 0.45) * 0.8).toFixed(2);
        if (asset.symbol === 'KLT') {
          prevKltPrice = asset.priceUsd;
          nextKltPrice = nextPrice;
        }
        return {
          ...asset,
          priceUsd: nextPrice,
          change24h: nextChange,
          high24h: Math.max(asset.high24h, nextPrice),
          low24h: Math.min(asset.low24h, nextPrice),
        };
      })
    );

    const matchedAlerts = state.priceAlerts.filter(
      (rule) =>
        rule.active &&
        !rule.triggered &&
        ((rule.condition === 'above' && nextKltPrice >= rule.targetPriceUsd) ||
          (rule.condition === 'below' && nextKltPrice <= rule.targetPriceUsd))
    );

    if (matchedAlerts.length > 0 && state.user.notifications.priceAlerts) {
      setState((prev) => ({
        ...prev,
        priceAlerts: prev.priceAlerts.map((rule) =>
          matchedAlerts.some((m) => m.id === rule.id) ? { ...rule, triggered: true } : rule
        ),
      }));
      matchedAlerts.forEach((rule) => {
        notify(
          state.language === 'fr'
            ? `Le $KLT a atteint $${nextKltPrice.toFixed(4)} (seuil ${rule.condition === 'above' ? '≥' : '≤'} $${rule.targetPriceUsd.toFixed(4)}).`
            : `$KLT reached $${nextKltPrice.toFixed(4)} (target ${rule.condition === 'above' ? '≥' : '≤'} $${rule.targetPriceUsd.toFixed(4)}).`,
          'warning',
          {
            category: 'price_alert',
            title: state.language === 'fr' ? 'Alerte Prix $KLT Déclenchée' : '$KLT Price Alert Triggered',
            actionLabel: state.language === 'fr' ? 'Trader $KLT' : 'Trade $KLT',
            actionRoute: 'trade',
          }
        );
      });
    } else if (
      state.user.notifications.priceAlerts &&
      Math.abs(nextKltPrice - prevKltPrice) / prevKltPrice >= 0.008
    ) {
      const pct = (((nextKltPrice - prevKltPrice) / prevKltPrice) * 100).toFixed(2);
      notify(
        state.language === 'fr'
          ? `Mouvement détecté sur $KLT : $${nextKltPrice.toFixed(4)} (${Number(pct) >= 0 ? '+' : ''}${pct}%).`
          : `$KLT price move detected: $${nextKltPrice.toFixed(4)} (${Number(pct) >= 0 ? '+' : ''}${pct}%).`,
        'info',
        {
          category: 'price_alert',
          title: state.language === 'fr' ? 'Alerte Marché $KLT' : '$KLT Market Alert',
          actionLabel: state.language === 'fr' ? 'Voir Graphique' : 'View Chart',
          actionRoute: 'trade',
        }
      );
    } else {
      notify(
        state.language === 'fr' ? 'Cours du marché actualisés.' : 'Market prices refreshed.',
        'info',
        { category: 'price_alert', title: state.language === 'fr' ? 'Flux Marché' : 'Market Feed' }
      );
    }
  }, [kltPriceUsd, notify, state.language, state.priceAlerts, state.user.notifications.priceAlerts]);

  const formatFiat = useCallback(
    (usdAmount: number, currencyOverride?: FiatCurrency) => {
      const currency = currencyOverride || state.user.preferredCurrency;
      const converted = usdAmount * FX_RATES[currency];
      if (currency === 'XOF') {
        return `${Math.round(converted).toLocaleString('fr-FR')} FCFA`;
      }
      const symbol = currency === 'EUR' ? '€' : '$';
      return `${symbol}${converted.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    },
    [state.user.preferredCurrency]
  );

  const updateUserProfile = useCallback(
    (patch: Partial<UserProfile>) => {
      setState((prev) => ({
        ...prev,
        user: { ...prev.user, ...patch },
      }));
      notify(t('Profil mis à jour.', 'Profile updated.'));
    },
    [notify, t]
  );

  const setUserRole = useCallback(
    (role: UserRole) => {
      setState((prev) => ({
        ...prev,
        user: { ...prev.user, role },
      }));
      notify(
        role === 'admin'
          ? t('Mode Administrateur activé.', 'Administrator mode enabled.')
          : t('Mode Utilisateur Standard activé.', 'Standard User mode enabled.'),
        'info'
      );
    },
    [notify, t]
  );

  const toggleHideBalances = useCallback(() => {
    setState((prev) => ({ ...prev, hideBalances: !prev.hideBalances }));
  }, []);

  const buyKlt = useCallback(
    (fiatAmount: number, currency: FiatCurrency, paymentMethod: string) => {
      const usdEquivalent = fiatAmount / FX_RATES[currency];
      const kltBought = +(usdEquivalent / kltPriceUsd).toFixed(4);
      const txHash = makeTxHash();
      setState((prev) => {
        const defaultIdx = prev.wallets.findIndex((w) => w.isDefault);
        const targetIdx = defaultIdx >= 0 ? defaultIdx : 0;
        const nextWallets = prev.wallets.map((w, idx) =>
          idx === targetIdx ? { ...w, kltBalance: +(w.kltBalance + kltBought).toFixed(4) } : w
        );
        const nextTx: TransactionRecord = {
          id: `tx-${Date.now()}`,
          type: 'buy',
          kltAmount: kltBought,
          pricePerKlt: kltPriceUsd,
          totalAmount: fiatAmount,
          currency,
          paymentMethod,
          status: 'Completed',
          txHash,
          description: `Achat ${kltBought.toLocaleString()} $KLT via ${paymentMethod}`,
          createdAt: nowTimestamp(),
        };
        return {
          ...prev,
          wallets: nextWallets,
          transactions: [nextTx, ...prev.transactions],
        };
      });
      notify(
        t(
          `+${kltBought.toLocaleString()} $KLT crédités (${txHash}).`,
          `+${kltBought.toLocaleString()} $KLT credited (${txHash}).`
        ),
        'success',
        {
          category: 'transaction',
          title: t('Achat $KLT Confirmé', '$KLT Purchase Confirmed'),
          actionLabel: t('Historique', 'History'),
          actionRoute: 'history',
        }
      );
    },
    [kltPriceUsd, notify, t]
  );

  const sellKlt = useCallback(
    (kltAmount: number, currency: FiatCurrency) => {
      if (kltAmount <= 0 || kltAmount > totalKltBalance) {
        notify(t('Solde $KLT insuffisant.', 'Insufficient $KLT balance.'), 'error');
        return false;
      }
      const usdEarned = kltAmount * kltPriceUsd;
      const fiatEarned = +(usdEarned * FX_RATES[currency]).toFixed(2);
      const txHash = makeTxHash();
      setState((prev) => {
        let remainingToDeduct = kltAmount;
        const nextWallets = prev.wallets.map((w) => {
          if (remainingToDeduct <= 0) return w;
          const take = Math.min(w.kltBalance, remainingToDeduct);
          remainingToDeduct -= take;
          return { ...w, kltBalance: +(w.kltBalance - take).toFixed(4) };
        });
        const nextTx: TransactionRecord = {
          id: `tx-${Date.now()}`,
          type: 'sell',
          kltAmount,
          pricePerKlt: kltPriceUsd,
          totalAmount: fiatEarned,
          currency,
          paymentMethod: 'Trésorerie KLT',
          status: 'Completed',
          txHash,
          description: `Vente de ${kltAmount.toLocaleString()} $KLT vers ${currency}`,
          createdAt: nowTimestamp(),
        };
        return {
          ...prev,
          wallets: nextWallets,
          usdBalance: +(prev.usdBalance + usdEarned).toFixed(2),
          transactions: [nextTx, ...prev.transactions],
        };
      });
      notify(
        t(
          `Vente de ${kltAmount.toLocaleString()} $KLT exécutée (${txHash}).`,
          `Sold ${kltAmount.toLocaleString()} $KLT (${txHash}).`
        ),
        'success',
        {
          category: 'transaction',
          title: t('Vente $KLT Exécutée', '$KLT Sale Executed'),
          actionLabel: t('Historique', 'History'),
          actionRoute: 'history',
        }
      );
      return true;
    },
    [kltPriceUsd, notify, t, totalKltBalance]
  );

  const placeOrder = useCallback(
    (side: 'buy' | 'sell', orderType: 'market' | 'limit', kltAmount: number, limitPrice?: number) => {
      const execPrice = orderType === 'limit' && limitPrice ? limitPrice : kltPriceUsd;
      const totalUsd = +(kltAmount * execPrice).toFixed(2);

      if (side === 'sell' && kltAmount > totalKltBalance) {
        notify(t('Solde $KLT insuffisant pour cet ordre.', 'Insufficient $KLT balance for order.'), 'error');
        return false;
      }
      if (side === 'buy' && orderType === 'market' && totalUsd > state.usdBalance) {
        notify(t('Solde USD disponible insuffisant.', 'Insufficient available USD balance.'), 'error');
        return false;
      }

      if (orderType === 'limit') {
        const order: OpenOrderRecord = {
          id: `ord-${Date.now().toString().slice(-4)}`,
          side,
          orderType: 'limit',
          kltAmount,
          limitPrice: execPrice,
          totalUsd,
          status: 'Open',
          createdAt: nowTimestamp(),
        };
        setState((prev) => ({ ...prev, openOrders: [order, ...prev.openOrders] }));
        notify(t('Ordre limite placé dans le carnet.', 'Limit order placed on book.'));
        return true;
      }

      setState((prev) => {
        const nextWallets = prev.wallets.map((w, idx) => {
          if (idx !== 0) return w;
          const delta = side === 'buy' ? kltAmount : -Math.min(w.kltBalance, kltAmount);
          return { ...w, kltBalance: +(w.kltBalance + delta).toFixed(4) };
        });
        const nextUsd = side === 'buy' ? prev.usdBalance - totalUsd : prev.usdBalance + totalUsd;
        const nextTx: TransactionRecord = {
          id: `tx-${Date.now()}`,
          type: 'trade',
          kltAmount,
          pricePerKlt: execPrice,
          totalAmount: totalUsd,
          currency: 'USD',
          paymentMethod: 'Order Book Market',
          status: 'Completed',
          txHash: makeTxHash(),
          description: `Trade ${side.toUpperCase()} ${kltAmount.toLocaleString()} $KLT au marché`,
          createdAt: nowTimestamp(),
        };
        return {
          ...prev,
          wallets: nextWallets,
          usdBalance: +Math.max(0, nextUsd).toFixed(2),
          transactions: [nextTx, ...prev.transactions],
        };
      });
      notify(
        t('Ordre marché exécuté sur le carnet KLT/USD.', 'Market order executed on KLT/USD book.'),
        'success',
        {
          category: 'transaction',
          title: t('Ordre Marché Exécuté', 'Market Order Filled'),
          actionLabel: t('Historique', 'History'),
          actionRoute: 'history',
        }
      );
      return true;
    },
    [kltPriceUsd, notify, state.usdBalance, t, totalKltBalance]
  );

  const cancelOrder = useCallback(
    (orderId: string) => {
      setState((prev) => ({
        ...prev,
        openOrders: prev.openOrders.filter((o) => o.id !== orderId),
      }));
      notify(t('Ordre annulé.', 'Order cancelled.'), 'info');
    },
    [notify, t]
  );

  const swapTokens = useCallback(
    (payAsset: 'SOL' | 'USDC', payAmount: number) => {
      if (payAmount <= 0) {
        notify(t('Montant invalide.', 'Invalid amount.'), 'error');
        return false;
      }
      const solPrice = assets.find((a) => a.symbol === 'SOL')?.priceUsd || 198.4;
      const usdValue = payAsset === 'SOL' ? payAmount * solPrice : payAmount;
      const kltReceived = +(usdValue / kltPriceUsd).toFixed(4);

      setState((prev) => {
        const nextWallets = prev.wallets.map((w, idx) =>
          idx === 0 ? { ...w, kltBalance: +(w.kltBalance + kltReceived).toFixed(4) } : w
        );
        const nextTx: TransactionRecord = {
          id: `tx-${Date.now()}`,
          type: 'swap',
          kltAmount: kltReceived,
          pricePerKlt: kltPriceUsd,
          totalAmount: payAmount,
          currency: payAsset,
          paymentMethod: 'Raydium / Pump.fun Pool',
          status: 'Completed',
          txHash: makeTxHash(),
          description: `Swap ${payAmount} ${payAsset} → ${kltReceived.toLocaleString()} $KLT`,
          createdAt: nowTimestamp(),
        };
        return {
          ...prev,
          wallets: nextWallets,
          transactions: [nextTx, ...prev.transactions],
        };
      });
      notify(
        t(
          `Swap Solana : +${kltReceived.toLocaleString()} $KLT reçus.`,
          `Solana Swap: +${kltReceived.toLocaleString()} $KLT received.`
        ),
        'success',
        {
          category: 'transaction',
          title: t('Swap Raydium Confirmé', 'Raydium Swap Confirmed'),
          actionLabel: t('Portefeuille', 'Wallet'),
          actionRoute: 'wallet',
        }
      );
      return true;
    },
    [assets, kltPriceUsd, notify, t]
  );

  const stakeKlt = useCallback(
    (amount: number) => {
      if (amount <= 0 || amount > totalKltBalance) {
        notify(t('Montant de staking invalide ou solde insuffisant.', 'Invalid staking amount or insufficient balance.'), 'error');
        return false;
      }
      const prevStaked = state.stakedKlt;
      const nextStaked = +(prevStaked + amount).toFixed(4);
      setState((prev) => {
        let remaining = amount;
        const nextWallets = prev.wallets.map((w) => {
          if (remaining <= 0) return w;
          const take = Math.min(w.kltBalance, remaining);
          remaining -= take;
          return { ...w, kltBalance: +(w.kltBalance - take).toFixed(4) };
        });
        const nextTx: TransactionRecord = {
          id: `tx-${Date.now()}`,
          type: 'stake',
          kltAmount: amount,
          pricePerKlt: kltPriceUsd,
          totalAmount: +(amount * kltPriceUsd).toFixed(2),
          currency: 'USD',
          paymentMethod: 'KLT Staking 15% APY',
          status: 'Completed',
          txHash: makeTxHash(),
          description: `Verrouillage Staking ${amount.toLocaleString()} $KLT (15% APY)`,
          createdAt: nowTimestamp(),
        };
        return {
          ...prev,
          wallets: nextWallets,
          stakedKlt: +(prev.stakedKlt + amount).toFixed(4),
          transactions: [nextTx, ...prev.transactions],
        };
      });
      notify(
        t(`${amount.toLocaleString()} $KLT verrouillés à 15% APY.`, `${amount.toLocaleString()} $KLT staked at 15% APY.`),
        'success',
        {
          category: 'transaction',
          title: t('Staking Confirmé', 'Staking Confirmed'),
          actionLabel: t('Hub Staking', 'Staking Hub'),
          actionRoute: 'solana-trading',
        }
      );

      // Check Staking Tier Milestones
      const tiers = [
        { threshold: 100000, labelFr: 'Gouverneur DAO (100 000 $KLT)', labelEn: 'DAO Governor (100,000 $KLT)' },
        { threshold: 50000, labelFr: 'Tier Platine VIP (50 000 $KLT)', labelEn: 'Platinum VIP Tier (50,000 $KLT)' },
        { threshold: 25000, labelFr: 'Tier Or (25 000 $KLT)', labelEn: 'Gold Tier (25,000 $KLT)' },
        { threshold: 5000, labelFr: 'Tier Argent · Accès Carte Visa (5 000 $KLT)', labelEn: 'Silver Tier · Visa Card Access (5,000 $KLT)' },
      ];
      const crossedTier = tiers.find((tier) => prevStaked < tier.threshold && nextStaked >= tier.threshold);
      if (crossedTier) {
        notify(
          t(
            `Félicitations ! Vous avez débloqué le palier ${crossedTier.labelFr}.`,
            `Milestone unlocked: ${crossedTier.labelEn}.`
          ),
          'success',
          {
            category: 'staking',
            title: t('Nouveau Palier Staking Débloqué', 'Staking Tier Milestone Unlocked'),
            actionLabel: t('Voir Carte Visa', 'View Visa Card'),
            actionRoute: 'wallet',
          }
        );
      }
      return true;
    },
    [kltPriceUsd, notify, state.stakedKlt, t, totalKltBalance]
  );

  const unstakeKlt = useCallback(
    (amount: number) => {
      if (amount <= 0 || amount > state.stakedKlt) {
        notify(t('Montant supérieur au solde staké.', 'Amount exceeds staked balance.'), 'error');
        return false;
      }
      setState((prev) => {
        const nextWallets = prev.wallets.map((w, idx) =>
          idx === 0 ? { ...w, kltBalance: +(w.kltBalance + amount).toFixed(4) } : w
        );
        return {
          ...prev,
          wallets: nextWallets,
          stakedKlt: +(prev.stakedKlt - amount).toFixed(4),
        };
      });
      notify(
        t(`${amount.toLocaleString()} $KLT débloqués vers votre portefeuille.`, `${amount.toLocaleString()} $KLT unstaked to wallet.`),
        'info',
        { category: 'transaction', title: t('Déblocage Staking', 'Unstake Completed'), actionRoute: 'wallet' }
      );
      return true;
    },
    [notify, state.stakedKlt, t]
  );

  const claimStakingRewards = useCallback(() => {
    if (state.stakingRewardsKlt <= 0) return;
    const reward = state.stakingRewardsKlt;
    setState((prev) => {
      const nextWallets = prev.wallets.map((w, idx) =>
        idx === 0 ? { ...w, kltBalance: +(w.kltBalance + reward).toFixed(4) } : w
      );
      const nextTx: TransactionRecord = {
        id: `tx-${Date.now()}`,
        type: 'reward',
        kltAmount: reward,
        pricePerKlt: kltPriceUsd,
        totalAmount: +(reward * kltPriceUsd).toFixed(2),
        currency: 'USD',
        paymentMethod: 'KLT Staking Vault',
        status: 'Completed',
        txHash: makeTxHash(),
        description: `Réclamation récompenses Staking (${reward.toFixed(2)} $KLT)`,
        createdAt: nowTimestamp(),
      };
      return {
        ...prev,
        wallets: nextWallets,
        stakingRewardsKlt: 0,
        lastStakingMilestoneKlt: 0,
        transactions: [nextTx, ...prev.transactions],
      };
    });
    notify(
      t(`+${reward.toFixed(2)} $KLT de récompenses crédités sur votre portefeuille.`, `Claimed +${reward.toFixed(2)} $KLT rewards to wallet.`),
      'success',
      {
        category: 'staking',
        title: t('Récompenses Staking Réclamées', 'Staking Rewards Claimed'),
        actionLabel: t('Portefeuille', 'Wallet'),
        actionRoute: 'wallet',
      }
    );
  }, [kltPriceUsd, notify, state.stakingRewardsKlt, t]);

  const toggleSolanaConnection = useCallback(() => {
    setState((prev) => ({ ...prev, solanaConnected: !prev.solanaConnected }));
    notify(
      state.solanaConnected
        ? t('Portefeuille Phantom déconnecté.', 'Phantom wallet disconnected.')
        : t('Portefeuille Phantom connecté.', 'Phantom wallet connected.'),
      'info'
    );
  }, [notify, state.solanaConnected, t]);

  const createWallet = useCallback(
    (label: string, network: 'Solana Mainnet' | 'Solana Devnet') => {
      const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
      let addr = 'KLT';
      for (let i = 0; i < 41; i++) addr += chars[Math.floor(Math.random() * chars.length)];
      const newWallet: WalletRecord = {
        id: `w-${Date.now()}`,
        label: label.trim() || 'Nouveau Coffre Solana',
        network,
        walletAddress: addr,
        kltBalance: 0,
        solBalance: network === 'Solana Devnet' ? 2.0 : 0.25,
        isDefault: false,
        createdAt: nowTimestamp(),
      };
      setState((prev) => ({ ...prev, wallets: [...prev.wallets, newWallet] }));
      notify(t('Portefeuille Solana généré.', 'Solana wallet created.'));
    },
    [notify, t]
  );

  const setDefaultWallet = useCallback(
    (walletId: string) => {
      setState((prev) => ({
        ...prev,
        wallets: prev.wallets.map((w) => ({ ...w, isDefault: w.id === walletId })),
      }));
      notify(t('Portefeuille principal mis à jour.', 'Default wallet updated.'));
    },
    [notify, t]
  );

  const deleteWallet = useCallback(
    (walletId: string) => {
      setState((prev) => {
        if (prev.wallets.length <= 1) return prev;
        const filtered = prev.wallets.filter((w) => w.id !== walletId);
        if (!filtered.some((w) => w.isDefault) && filtered[0]) {
          filtered[0] = { ...filtered[0], isDefault: true };
        }
        return { ...prev, wallets: filtered };
      });
      notify(t('Portefeuille supprimé.', 'Wallet removed.'), 'info');
    },
    [notify, t]
  );

  const voteDaoProposal = useCallback(
    (proposalId: string, direction: 'for' | 'against') => {
      const votingWeight = Math.max(1000, Math.round(totalKltBalance + state.stakedKlt));
      setState((prev) => ({
        ...prev,
        daoProposals: prev.daoProposals.map((p) => {
          if (p.id !== proposalId) return p;
          if (p.userVote === direction) return p;
          let votesFor = p.votesFor;
          let votesAgainst = p.votesAgainst;
          if (p.userVote === 'for') votesFor -= votingWeight;
          if (p.userVote === 'against') votesAgainst -= votingWeight;
          if (direction === 'for') votesFor += votingWeight;
          else votesAgainst += votingWeight;
          return { ...p, votesFor, votesAgainst, userVote: direction };
        }),
      }));
      notify(t(`Vote enregistré (${votingWeight.toLocaleString()} $KLT).`, `Vote recorded (${votingWeight.toLocaleString()} $KLT).`));
    },
    [notify, state.stakedKlt, t, totalKltBalance]
  );

  const createDaoProposal = useCallback(
    (title: string, description: string, category: DaoProposal['category']) => {
      const nextNum = 16 + state.daoProposals.length;
      const proposal: DaoProposal = {
        id: `KIP-0${nextNum}`,
        title,
        titleEn: title,
        description,
        descriptionEn: description,
        category,
        status: 'Active',
        votesFor: Math.round(totalKltBalance + state.stakedKlt),
        votesAgainst: 0,
        quorumRequired: 500000,
        endsAt: '2026-12-20',
        author: state.user.name,
        userVote: 'for',
      };
      setState((prev) => ({ ...prev, daoProposals: [proposal, ...prev.daoProposals] }));
      notify(t('Proposition DAO publiée.', 'DAO proposal published.'));
    },
    [notify, state.daoProposals.length, state.stakedKlt, state.user.name, t, totalKltBalance]
  );

  const voteFaqItem = useCallback(
    (faqId: string, feedback: 'helpful' | 'not_helpful') => {
      setState((prev) => ({
        ...prev,
        faqItems: prev.faqItems.map((item) => {
          if (item.id !== faqId) return item;
          if (item.userFeedback === feedback) return item;
          let helpfulVotes = item.helpfulVotes;
          let notHelpfulVotes = item.notHelpfulVotes;
          if (item.userFeedback === 'helpful') helpfulVotes -= 1;
          if (item.userFeedback === 'not_helpful') notHelpfulVotes -= 1;
          if (feedback === 'helpful') helpfulVotes += 1;
          else notHelpfulVotes += 1;
          return { ...item, helpfulVotes, notHelpfulVotes, userFeedback: feedback };
        }),
      }));
      notify(t('Merci pour votre avis.', 'Feedback recorded.'), 'info');
    },
    [notify, t]
  );

  const revokeLoginSession = useCallback(
    (sessionId: string) => {
      setState((prev) => ({
        ...prev,
        loginSessions: prev.loginSessions.filter((s) => s.id !== sessionId),
      }));
      notify(t('Session révoquée.', 'Session revoked.'), 'info');
    },
    [notify, t]
  );

  const revokeAllOtherSessions = useCallback(() => {
    setState((prev) => ({
      ...prev,
      loginSessions: prev.loginSessions.filter((s) => s.isCurrent),
    }));
    notify(t('Toutes les autres sessions ont été fermées.', 'All other sessions terminated.'), 'info');
  }, [notify, t]);

  const requestDevnetAirdrop = useCallback(() => {
    setState((prev) => ({
      ...prev,
      devnet: {
        ...prev.devnet,
        payerSolBalance: +(prev.devnet.payerSolBalance + 1.0).toFixed(4),
      },
    }));
    notify(t('Airdrop Devnet +1.0000 SOL confirmé.', 'Devnet +1.0000 SOL airdrop confirmed.'));
  }, [notify, t]);

  const runDevnetQuoteOrSwap = useCallback(
    (inputMint: string, amountRaw: string, execute: boolean) => {
      const numericRaw = Number(amountRaw) || 0;
      const estimatedOutKlt = +(numericRaw / 1000000).toFixed(2);
      setState((prev) => ({
        ...prev,
        devnet: {
          ...prev.devnet,
          lastQuote: {
            timestamp: nowTimestamp(),
            inputMint,
            amountInRaw: amountRaw,
            estimatedOutKlt,
            priceImpactPct: 0.14,
            executed: execute,
            txSignature: execute ? `${makeTxHash()}${makeTxHash()}` : undefined,
          },
        },
      }));
      notify(
        execute
          ? t('Swap Devnet signé et soumis sur Raydium.', 'Devnet swap signed and submitted to Raydium.')
          : t('Quote Raydium calculée sans signature.', 'Raydium quote generated without signing.'),
        execute ? 'success' : 'info'
      );
    },
    [notify, t]
  );

  const setSubscription = useCallback(
    (subscriptionPlan: 'free' | 'pro' | 'vip', billingCycle: 'monthly' | 'yearly') => {
      setState((prev) => ({ ...prev, subscriptionPlan, billingCycle }));
      notify(t('Abonnement mis à jour avec succès.', 'Subscription plan updated.'));
    },
    [notify, t]
  );

  const addPriceAlert = useCallback(
    (condition: 'above' | 'below', targetPriceUsd: number) => {
      if (targetPriceUsd <= 0) return;
      const rule: PriceAlertRule = {
        id: `pa-${Date.now()}`,
        condition,
        targetPriceUsd,
        active: true,
        triggered: false,
        createdAt: nowTimestamp(),
      };
      setState((prev) => ({ ...prev, priceAlerts: [rule, ...prev.priceAlerts] }));
      notify(
        t(
          `Alerte créée : $KLT ${condition === 'above' ? '≥' : '≤'} $${targetPriceUsd.toFixed(4)}.`,
          `Alert set: $KLT ${condition === 'above' ? '≥' : '≤'} $${targetPriceUsd.toFixed(4)}.`
        ),
        'info',
        { category: 'price_alert', title: t('Alerte Prix Configurée', 'Price Alert Configured') }
      );
    },
    [notify, t]
  );

  const togglePriceAlert = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      priceAlerts: prev.priceAlerts.map((r) =>
        r.id === id ? { ...r, active: !r.active, triggered: false } : r
      ),
    }));
  }, []);

  const deletePriceAlert = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      priceAlerts: prev.priceAlerts.filter((r) => r.id !== id),
    }));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setState((prev) => ({
      ...prev,
      notificationsLog: prev.notificationsLog.map((n) => ({ ...n, read: true })),
    }));
  }, []);

  const clearNotificationsLog = useCallback(() => {
    setState((prev) => ({ ...prev, notificationsLog: [] }));
  }, []);

  const triggerSampleMilestoneOrAlert = useCallback(
    (kind: 'staking' | 'price_alert') => {
      if (kind === 'staking') {
        const milestone = Math.ceil((state.stakingRewardsKlt + 25) / 50) * 50;
        setState((prev) => ({
          ...prev,
          stakingRewardsKlt: +(prev.stakingRewardsKlt + 25).toFixed(2),
          lastStakingMilestoneKlt: milestone,
        }));
        notify(
          t(
            `Palier atteint : ${(state.stakingRewardsKlt + 25).toFixed(2)} $KLT disponibles à 15% APY !`,
            `Milestone reached: ${(state.stakingRewardsKlt + 25).toFixed(2)} $KLT ready to claim at 15% APY!`
          ),
          'success',
          {
            category: 'staking',
            title: t('Palier Staking $KLT Atteint', '$KLT Staking Milestone Reached'),
            actionLabel: t('Réclamer', 'Claim'),
            actionRoute: 'solana-trading',
          }
        );
      } else {
        const boosted = +(kltPriceUsd * 1.045).toFixed(4);
        setAssets((prev) =>
          prev.map((a) =>
            a.symbol === 'KLT'
              ? { ...a, priceUsd: boosted, change24h: +(a.change24h + 4.5).toFixed(2), high24h: Math.max(a.high24h, boosted) }
              : a
          )
        );
        notify(
          t(
            `Hausse rapide sur $KLT : $${boosted.toFixed(4)} (+4.50% sur la dernière bougie).`,
            `$KLT breakout alert: $${boosted.toFixed(4)} (+4.50% on latest candle).`
          ),
          'warning',
          {
            category: 'price_alert',
            title: t('Alerte Prix $KLT', '$KLT Price Alert'),
            actionLabel: t('Trader $KLT', 'Trade $KLT'),
            actionRoute: 'trade',
          }
        );
      }
    },
    [kltPriceUsd, notify, state.stakingRewardsKlt, t]
  );

  const resetDemoState = useCallback(() => {
    setState(DEFAULT_STATE);
    setAssets(CRYPTO_ASSETS);
    window.localStorage.removeItem(STORAGE_KEY);
    notify(t('Données réinitialisées aux valeurs d’origine.', 'Workspace reset to initial values.'), 'info');
  }, [notify, t]);

  const unreadNotificationsCount = state.notificationsLog.filter((n) => !n.read).length;

  return (
    <KLTStoreContext.Provider
      value={{
        route,
        setRoute,
        language: state.language,
        setLanguage,
        t,
        user: state.user,
        updateUserProfile,
        setUserRole,
        wallets: state.wallets,
        totalKltBalance,
        usdBalance: state.usdBalance,
        stakedKlt: state.stakedKlt,
        stakingRewardsKlt: state.stakingRewardsKlt,
        assets,
        kltPriceUsd,
        refreshMarketPrices,
        transactions: state.transactions,
        openOrders: state.openOrders,
        daoProposals: state.daoProposals,
        faqItems: state.faqItems,
        loginSessions: state.loginSessions,
        devnet: state.devnet,
        solanaConnected: state.solanaConnected,
        solanaAddress: state.solanaAddress,
        toggleSolanaConnection,
        subscriptionPlan: state.subscriptionPlan,
        billingCycle: state.billingCycle,
        setSubscription,
        hideBalances: state.hideBalances,
        toggleHideBalances,
        formatFiat,
        buyKlt,
        sellKlt,
        placeOrder,
        cancelOrder,
        swapTokens,
        stakeKlt,
        unstakeKlt,
        claimStakingRewards,
        createWallet,
        setDefaultWallet,
        deleteWallet,
        voteDaoProposal,
        createDaoProposal,
        voteFaqItem,
        revokeLoginSession,
        revokeAllOtherSessions,
        requestDevnetAirdrop,
        runDevnetQuoteOrSwap,
        resetDemoState,
        toasts,
        notify,
        dismissToast,
        priceAlerts: state.priceAlerts,
        notificationsLog: state.notificationsLog,
        unreadNotificationsCount,
        addPriceAlert,
        togglePriceAlert,
        deletePriceAlert,
        markAllNotificationsRead,
        clearNotificationsLog,
        triggerSampleMilestoneOrAlert,
      }}
    >
      {children}
    </KLTStoreContext.Provider>
  );
};

export function useKLTStore(): KLTStoreContextValue {
  const ctx = useContext(KLTStoreContext);
  if (!ctx) {
    throw new Error('useKLTStore must be used inside KLTStoreProvider');
  }
  return ctx;
}
