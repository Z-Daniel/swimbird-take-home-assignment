import { Currency } from './currency';

/** Mock FX rates expressed as SEK per 1 unit of source currency. */
export const FX_TO_SEK: Record<Currency, number> = {
  SEK: 1,
  USD: 10.5,
  EUR: 11.4,
};

export function toSEK(amount: number, currency: Currency): number {
  return amount * (FX_TO_SEK[currency] ?? 1);
}

export function fromSEK(amountSEK: number, currency: Currency): number {
  return amountSEK / (FX_TO_SEK[currency] ?? 1);
}
