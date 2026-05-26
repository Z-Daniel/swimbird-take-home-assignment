import { formatNumber } from '@angular/common';
import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';

/**
 * Formats a number with an explicit sign prefix and thousand separators.
 *
 * Usage:
 *   {{ value | signedNumber }}        →  "+1,234.56" / "-1,234.56"
 *   {{ value | signedNumber }}%       →  "+1,234.56%" / "-1,234.56%"
 *   {{ value | signedNumber:'1.0-0' }} →  "+1,235" / "-1,235"
 */
@Pipe({ name: 'signedNumber', standalone: true, pure: true })
export class SignedNumberPipe implements PipeTransform {
  constructor(@Inject(LOCALE_ID) private readonly locale: string) {}

  transform(value: number, digitsInfo = '1.2-2'): string {
    const formatted = formatNumber(Math.abs(value), this.locale, digitsInfo);
    return `${value >= 0 ? '+' : '-'}${formatted}`;
  }
}
