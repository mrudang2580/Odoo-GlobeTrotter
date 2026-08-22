import { CurrencyCode } from '../types';

export const CURRENCY_RATES_TO_INR: Record<CurrencyCode, number> = {
  INR: 1,
  USD: 86.5,
  EUR: 92.0,
  GBP: 108.5,
  AED: 23.5,
  JPY: 0.58,
  SGD: 64.0,
};

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  AED: 'AED ',
  JPY: '¥',
  SGD: 'S$',
};

export function convertFromINR(amountINR: number, targetCurrency: CurrencyCode): number {
  const rate = CURRENCY_RATES_TO_INR[targetCurrency] || 1;
  return amountINR / rate;
}

export function convertToINR(amount: number, sourceCurrency: CurrencyCode): number {
  const rate = CURRENCY_RATES_TO_INR[sourceCurrency] || 1;
  return amount * rate;
}

export function formatCurrency(amountINR: number, currency: CurrencyCode = 'INR', compact: boolean = false): string {
  const symbol = CURRENCY_SYMBOLS[currency] || '₹';
  const converted = convertFromINR(amountINR, currency);

  if (compact && converted >= 1000000) {
    return `${symbol}${(converted / 1000000).toFixed(1)}M`;
  }
  if (compact && converted >= 1000) {
    return `${symbol}${(converted / 1000).toFixed(1)}k`;
  }

  if (currency === 'INR') {
    return `${symbol}${Math.round(converted).toLocaleString('en-IN')}`;
  }

  return `${symbol}${Math.round(converted).toLocaleString('en-US')}`;
}
