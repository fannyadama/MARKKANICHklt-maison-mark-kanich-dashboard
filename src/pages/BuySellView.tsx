import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Globe, ShieldCheck, Smartphone, Wallet } from 'lucide-react';
import { useKLTStore } from '../context/KLTStoreContext';
import { FX_RATES, PSP_COMPARISON_MATRIX } from '../data/kltSeedData';
import { FiatCurrency } from '../types/klt';

interface BuySellViewProps {
  mode: 'buy' | 'sell';
}

export const BuySellView: React.FC<BuySellViewProps> = ({ mode }) => {
  const { t, language, kltPriceUsd, totalKltBalance, buyKlt, sellKlt, setRoute } = useKLTStore();
  const [amountInput, setAmountInput] = useState(mode === 'buy' ? '500' : '1000');
  const [currency, setCurrency] = useState<FiatCurrency>('USD');
  const [paymentMethod, setPaymentMethod] = useState('Solana Pay / Phantom');
  const [mobileOperator, setMobileOperator] = useState<'Wave CI' | 'Orange Money' | 'MTN MoMo'>('Wave CI');
  const [mobilePhone, setMobilePhone] = useState('+225 07 15 94 60 56');

  const numericInput = parseFloat(amountInput) || 0;
  const kltEquivalent =
    mode === 'buy' ? numericInput / FX_RATES[currency] / kltPriceUsd : numericInput;
  const fiatEquivalent =
    mode === 'buy' ? numericInput : numericInput * kltPriceUsd * FX_RATES[currency];

  const isLocalFcfaPsp = paymentMethod.includes('Paystack') || paymentMethod.includes('CinetPay');

  const handleSelectMethod = (methodId: string) => {
    setPaymentMethod(methodId);
    if ((methodId.includes('CinetPay') || methodId.includes('Paystack')) && currency !== 'XOF') {
      setCurrency('XOF');
      setAmountInput('150000');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numericInput <= 0) return;
    if (mode === 'buy') {
      const methodLabel = isLocalFcfaPsp ? `${paymentMethod} (${mobileOperator})` : paymentMethod;
      buyKlt(numericInput, currency, methodLabel);
      setRoute('dashboard');
    } else {
      const ok = sellKlt(numericInput, currency);
      if (ok) setRoute('dashboard');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => setRoute('dashboard')}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {t('Retour au tableau de bord', 'Back to Dashboard')}
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {mode === 'buy' ? t('Acheter des tokens $KLT', 'Buy $KLT Tokens') : t('Vendre des tokens $KLT', 'Sell $KLT Tokens')}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {mode === 'buy'
              ? t(
                  'Acquisition multi-devises : Solana Pay, Paddle (Carte), Paystack et CinetPay (Wave / Orange Money / MTN).',
                  'Multi-currency acquisition: Solana Pay, Paddle Card, Paystack & CinetPay (Wave / Orange Money / MTN).'
                )
              : t('Conversion de vos avoirs $KLT vers USD, EUR ou FCFA (XOF).', 'Convert your $KLT holdings to USD, EUR, or XOF.')}
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg shrink-0">
          <button
            type="button"
            onClick={() => setRoute('buy')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              mode === 'buy' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t('Acheter', 'Buy')}
          </button>
          <button
            type="button"
            onClick={() => setRoute('sell')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              mode === 'sell' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            {t('Vendre', 'Sell')}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#0F172A] border border-slate-800 rounded-xl p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-5 border-b border-slate-800">
          <div>
            <p className="text-xs text-slate-400">{t('Cours actuel $KLT', 'Current $KLT Price')}</p>
            <p className="text-xl font-bold text-white font-mono-tabular mt-1">${kltPriceUsd.toFixed(4)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">{t('Solde disponible', 'Available Balance')}</p>
            <p className="text-xl font-bold text-amber-400 font-mono-tabular mt-1">
              {totalKltBalance.toLocaleString('en-US', { maximumFractionDigits: 2 })} KLT
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400">{t('Canaux FCFA', 'FCFA Channels')}</p>
            <p className="text-xl font-bold text-emerald-400 font-mono-tabular mt-1">Wave · OM · MTN</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label htmlFor="amount-input" className="block text-xs font-medium text-slate-300 mb-2">
              {mode === 'buy'
                ? t(`Montant à investir (${currency})`, `Amount to Spend (${currency})`)
                : t('Quantité de $KLT à vendre', 'Amount of $KLT to Sell')}
            </label>
            <input
              id="amount-input"
              type="number"
              step="any"
              min="0"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono-tabular text-lg focus:outline-none focus:border-amber-500"
              placeholder="0.00"
            />
          </div>

          <div>
            <label htmlFor="currency-select" className="block text-xs font-medium text-slate-300 mb-2">
              {t('Devise', 'Currency')}
            </label>
            <select
              id="currency-select"
              value={currency}
              onChange={(e) => setCurrency(e.target.value as FiatCurrency)}
              className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="XOF">XOF (FCFA)</option>
            </select>
          </div>
        </div>

        {mode === 'sell' ? (
          <div className="flex flex-wrap gap-2">
            {[0.25, 0.5, 0.75, 1].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => setAmountInput((totalKltBalance * pct).toFixed(2))}
                className="px-3 py-1.5 text-xs font-medium rounded-md border border-slate-700 bg-slate-900 text-slate-300 hover:border-amber-500 hover:text-amber-400 transition-colors"
              >
                {pct === 1 ? 'MAX' : `${pct * 100}%`}
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs font-medium text-slate-300">
              {t('Méthode de paiement & PSP Local', 'Payment Method & Local PSP')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { id: 'Solana Pay / Phantom', icon: Wallet, sub: 'Solana SPL · 0 frais' },
                { id: 'Paddle (Carte Visa / MC)', icon: Globe, sub: 'USD / EUR · Global' },
                { id: 'Paystack (Wave / OM / Carte)', icon: CreditCard, sub: 'XOF / USD · J+1' },
                { id: 'CinetPay (Wave / OM / MTN)', icon: Smartphone, sub: '100% UEMOA FCFA' },
              ].map((m) => {
                const Icon = m.icon;
                const active = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleSelectMethod(m.id)}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      active
                        ? 'border-amber-500 bg-amber-500/10 text-white'
                        : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mb-1.5 ${active ? 'text-amber-400' : 'text-slate-400'}`} />
                    <p className="text-xs font-semibold">{m.id}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{m.sub}</p>
                  </button>
                );
              })}
            </div>

            {isLocalFcfaPsp && (
              <div className="p-4 rounded-lg bg-slate-900/90 border border-amber-500/30 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="momo-operator" className="block text-[11px] text-slate-400 mb-1.5">
                    {t('Opérateur Mobile Money (Côte d’Ivoire / UEMOA)', 'Mobile Money Operator')}
                  </label>
                  <select
                    id="momo-operator"
                    value={mobileOperator}
                    onChange={(e) => setMobileOperator(e.target.value as 'Wave CI' | 'Orange Money' | 'MTN MoMo')}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Wave CI">Wave Côte d’Ivoire (0% sur-frais)</option>
                    <option value="Orange Money">Orange Money CI</option>
                    <option value="MTN MoMo">MTN MoMo CI</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="momo-phone" className="block text-[11px] text-slate-400 mb-1.5">
                    {t('Numéro Mobile Money', 'Mobile Money Phone Number')}
                  </label>
                  <input
                    id="momo-phone"
                    type="tel"
                    value={mobilePhone}
                    onChange={(e) => setMobilePhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 font-mono-tabular text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="p-4 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <span className="text-sm text-slate-400">
            {mode === 'buy' ? t('Vous recevrez estimé', 'Estimated Receive') : t('Montant crédité estimé', 'Estimated Credit')}
          </span>
          <span className="text-xl font-bold text-amber-400 font-mono-tabular">
            {mode === 'buy'
              ? `${kltEquivalent.toLocaleString('en-US', { maximumFractionDigits: 4 })} $KLT`
              : currency === 'XOF'
              ? `${Math.round(fiatEquivalent).toLocaleString('fr-FR')} FCFA`
              : `${currency === 'EUR' ? '€' : '$'}${fiatEquivalent.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            {t('Protection AES-256-GCM · Politique', 'AES-256-GCM Protected ·')}
            <button
              type="button"
              onClick={() => setRoute('remboursement')}
              className="text-amber-400 hover:text-amber-300 underline underline-offset-2"
            >
              /remboursement
            </button>
          </span>

          <button
            type="submit"
            disabled={numericInput <= 0 || (mode === 'sell' && numericInput > totalKltBalance)}
            className={`px-6 py-3 rounded-lg text-sm font-semibold transition-colors disabled:opacity-40 whitespace-nowrap ${
              mode === 'buy'
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-red-600 hover:bg-red-500 text-white'
            }`}
          >
            {mode === 'buy' ? t('Confirmer l’achat', 'Confirm Purchase') : t('Confirmer la vente', 'Confirm Sale')}
          </button>
        </div>
      </form>

      {/* PSP Comparison Matrix (Paddle vs Paystack vs CinetPay) */}
      <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5 space-y-3">
        <div>
          <h2 className="text-sm font-semibold text-white">
            {t('Comparatif Prestataires : Paddle vs Paystack vs CinetPay', 'PSP Comparison: Paddle vs Paystack vs CinetPay')}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {t(
              'Matrice de décision pour les paiements SaaS internationaux et FCFA Wave / Orange Money.',
              'Decision matrix for international SaaS billing and West African FCFA Mobile Money.'
            )}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 pr-4">{t('Critère', 'Criterion')}</th>
                <th className="py-2.5 pr-4 text-white">Paddle (International)</th>
                <th className="py-2.5 pr-4 text-amber-400">Paystack (Mixte)</th>
                <th className="py-2.5 text-emerald-400">CinetPay (UEMOA)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {PSP_COMPARISON_MATRIX.map((row) => (
                <tr key={row.criterionEn} className="hover:bg-slate-900/40">
                  <td className="py-2.5 pr-4 font-medium text-slate-300">
                    {language === 'fr' ? row.criterionFr : row.criterionEn}
                  </td>
                  <td className="py-2.5 pr-4 text-slate-300">{row.paddle}</td>
                  <td className="py-2.5 pr-4 text-slate-200">{row.paystack}</td>
                  <td className="py-2.5 text-slate-200">{row.cinetpay}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
