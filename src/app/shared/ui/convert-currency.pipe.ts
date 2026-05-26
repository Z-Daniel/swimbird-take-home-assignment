import { formatNumber } from '@angular/common';
import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { Currency } from '../../core/models/currency.model';
import { fromSEK, toSEK } from '../../core/fx';

/**
 * Converts a monetary amount from one currency to another via SEK as the
 * intermediate pivot (matching the FX rate table in core/fx.ts), then
 * formats it with thousand separators and appends the currency code.
 *
 * Usage: {{ amount | convertCurrency:fromCurrency:toCurrency }}
 * Output example: "1,234,567 USD"
 */
@Pipe({ name: 'convertCurrency', standalone: true, pure: true })
export class ConvertCurrencyPipe implements PipeTransform {
  constructor(@Inject(LOCALE_ID) private readonly locale: string) {}

  transform(amount: number, from: Currency, to: Currency): string {
    const converted = fromSEK(toSEK(amount, from), to);
    return `${formatNumber(converted, this.locale, '1.0-0')} ${to}`;
  }
}
