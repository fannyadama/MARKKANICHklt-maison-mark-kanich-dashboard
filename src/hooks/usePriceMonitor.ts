import { useEffect, useRef } from 'react';
import { useKLTStore } from '../context/KLTStoreContext';
import { PriceAlertRule } from '../types/klt';

/**
 * Evaluates whether a market price transition from `prevPrice` to `currentPrice`
 * crossed an active, untriggered user-defined threshold rule.
 */
export function didPriceCrossThreshold(
  prevPrice: number,
  currentPrice: number,
  rule: PriceAlertRule
): boolean {
  if (!rule.active || rule.triggered) return false;
  if (prevPrice === currentPrice) return false;

  if (rule.condition === 'above') {
    return prevPrice < rule.targetPriceUsd && currentPrice >= rule.targetPriceUsd;
  }

  return prevPrice > rule.targetPriceUsd && currentPrice <= rule.targetPriceUsd;
}

/**
 * Custom hook that monitors current market prices from the store (`assets` / `kltPriceUsd`)
 * against saved user threshold settings (`priceAlerts`) and triggers the toast notification
 * system whenever a threshold is crossed.
 */
export function usePriceMonitor() {
  const {
    assets,
    kltPriceUsd,
    priceAlerts,
    user,
    language,
    notify,
    markPriceAlertsTriggered,
  } = useKLTStore();

  const currentMarketPrice =
    assets.find((asset) => asset.symbol === 'KLT')?.priceUsd ?? kltPriceUsd;

  const previousPriceRef = useRef<number>(currentMarketPrice);

  useEffect(() => {
    const prevPrice = previousPriceRef.current;
    if (prevPrice === currentMarketPrice) return;

    const crossedRules = priceAlerts.filter((rule) =>
      didPriceCrossThreshold(prevPrice, currentMarketPrice, rule)
    );

    previousPriceRef.current = currentMarketPrice;

    if (crossedRules.length === 0) return;

    const triggeredAt = new Date().toISOString().replace('T', ' ').slice(0, 19);
    markPriceAlertsTriggered(
      crossedRules.map((rule) => rule.id),
      triggeredAt
    );

    if (!user.notifications.priceAlerts) return;

    crossedRules.forEach((rule) => {
      const labelSuffix = rule.label ? ` (${rule.label})` : '';
      const dirSymbol = rule.condition === 'above' ? '≥' : '≤';
      const crossingDirection =
        rule.condition === 'above'
          ? language === 'fr'
            ? 'franchi à la hausse'
            : 'crossed above'
          : language === 'fr'
          ? 'franchi à la baisse'
          : 'crossed below';

      notify(
        language === 'fr'
          ? `Le $KLT a ${crossingDirection} $${rule.targetPriceUsd.toFixed(4)} (${dirSymbol}) : $${prevPrice.toFixed(4)} → $${currentMarketPrice.toFixed(4)}${labelSuffix}.`
          : `$KLT ${crossingDirection} $${rule.targetPriceUsd.toFixed(4)} (${dirSymbol}): $${prevPrice.toFixed(4)} → $${currentMarketPrice.toFixed(4)}${labelSuffix}.`,
        'warning',
        {
          category: 'price_alert',
          title:
            language === 'fr'
              ? `Seuil $KLT Franchi${labelSuffix}`
              : `$KLT Threshold Crossed${labelSuffix}`,
          actionLabel: language === 'fr' ? 'Trader $KLT' : 'Trade $KLT',
          actionRoute: 'trade',
        }
      );
    });
  }, [
    currentMarketPrice,
    language,
    markPriceAlertsTriggered,
    notify,
    priceAlerts,
    user.notifications.priceAlerts,
  ]);

  return {
    currentKltPrice: currentMarketPrice,
    activeAlertsCount: priceAlerts.filter((rule) => rule.active && !rule.triggered).length,
  };
}
