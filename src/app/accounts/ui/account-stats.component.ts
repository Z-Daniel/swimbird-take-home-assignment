import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Currency } from '../../core/models/currency.model';
import { fromSEK, toSEK } from '../../core/fx';
import { SettingsService } from '../../core/services/settings.service';
import { ConvertCurrencyPipe } from '../../shared/ui/convert-currency.pipe';
import { StatTileComponent } from '../../shared/ui/stat-tile.component';
import { Holding } from '../models/holding.model';

@Component({
  selector: 'app-account-stats',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe, StatTileComponent, ConvertCurrencyPipe],
  template: `
    <dl class="flex flex-wrap gap-6">
      <app-stat-tile label="Total value">
        {{ totalValue() | number:'1.0-0' }} {{ displayCurrency() }}
      </app-stat-tile>
      <app-stat-tile label="Holdings">{{ count() }}</app-stat-tile>
      @if (largest(); as h) {
        @let from = h.currency ?? accountCurrency();
        <app-stat-tile label="Largest holding">
          {{ h.symbol }} —
          {{ h.marketValue | convertCurrency:from:displayCurrency() | number:'1.0-0' }}
          {{ displayCurrency() }}
        </app-stat-tile>
      }
    </dl>
  `,
})
export class AccountStatsComponent {
  readonly holdings = input.required<Holding[]>();
  readonly accountCurrency = input.required<Currency>();

  private readonly settings = inject(SettingsService);
  protected readonly displayCurrency = this.settings.currency;

  /** Sum all holding market values via SEK as pivot, then convert to display currency. */
  protected readonly totalValue = computed(() => {
    const to = this.settings.currency();
    const fallback = this.accountCurrency();
    const totalSEK = this.holdings().reduce(
      (sum, h) => sum + toSEK(h.marketValue, h.currency ?? fallback),
      0,
    );
    return fromSEK(totalSEK, to);
  });

  protected readonly count = computed(() => this.holdings().length);

  protected readonly largest = computed(() => {
    const items = this.holdings();
    return items.length > 0
      ? items.reduce((max, h) => (h.marketValue > max.marketValue ? h : max))
      : null;
  });
}
