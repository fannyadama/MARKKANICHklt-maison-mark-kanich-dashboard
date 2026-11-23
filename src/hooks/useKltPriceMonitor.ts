import { useEffect, useRef } from 'react';
import { useKLTStore } from '../context/KLTStoreContext';
import { PriceAlertRule } from '../types/klt';

/**
 * Evaluates whether the $KLT price transition from `prevPrice` to `currentPrice`
 * genuinely crossed a user-defined threshold rule.
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
 * Background monitor hook watching `$KLT` price updates from `useKLTStore()`
 * against active user-defined thresholds (`priceAlerts`) and dispatching toast
 * notifications whenever the price crosses a target threshold.
 */
export function useKltPriceMonitor(): void {
  const {
    kltPriceUsd,
    priceAlerts,
    user,
    language,
    notify,
    markPriceAlertsTriggered,
  } = useKLTStore();

  const previousPriceRef = useRef<number>(kltPriceUsd);

  useEffect(() => {
    const prevPrice = previousPriceRef.current;
    if (prevPrice === kltPriceUsd) return;

    const crossedRules = priceAlerts.filter((rule) =>
      didPriceCrossThreshold(prevPrice, kltPriceUsd, rule)
    );

    previousPriceRef.current = kltPriceUsd;

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
          ? `Le $KLT a ${crossingDirection} $${rule.targetPriceUsd.toFixed(4)} (${dirSymbol}) : $${prevPrice.toFixed(4)} → $${kltPriceUsd.toFixed(4)}${labelSuffix}.`
          : `$KLT ${crossingDirection} $${rule.targetPriceUsd.toFixed(4)} (${dirSymbol}): $${prevPrice.toFixed(4)} → $${kltPriceUsd.toFixed(4)}${labelSuffix}.`,
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
    kltPriceUsd,
    language,
    markPriceAlertsTriggered,
    notify,
    priceAlerts,
    user.notifications.priceAlerts,
  ]);
}
