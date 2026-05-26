import { Pipe, PipeTransform } from '@angular/core';
import { Currency } from '../../core/models/currency.model';
import { fromSEK, toSEK } from '../../core/fx';

/**
 * Converts a monetary amount from one currency to another via SEK as the
 * intermediate pivot (matching the FX rate table in core/fx.ts).
 *
 * Usage: {{ amount | convertCurrency:fromCurrency:toCurrency }}
 */
@Pipe({ name: 'convertCurrency', standalone: true, pure: true })
export class ConvertCurrencyPipe implements PipeTransform {
  transform(amount: number, from: Currency, to: Currency): number {
    return fromSEK(toSEK(amount, from), to);
  }
}
