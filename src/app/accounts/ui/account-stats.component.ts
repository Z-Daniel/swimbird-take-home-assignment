import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Currency } from '../../core/models/currency.model';
import { toSEK } from '../../core/fx';
import { SettingsService } from '../../core/services/settings.service';
import { ConvertCurrencyPipe } from '../../shared/ui/convert-currency.pipe';
import { StatTileComponent } from '../../shared/ui/stat-tile.component';
import { Holding } from '../models/holding.model';

@Component({
  selector: 'app-account-stats',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StatTileComponent, ConvertCurrencyPipe],
  template: `
    <dl class="flex flex-wrap gap-6">
      <app-stat-tile label="Total value">
        {{ totalValueSEK() | convertCurrency:'SEK':displayCurrency() }}
      </app-stat-tile>
      <app-stat-tile label="Holdings">{{ count() }}</app-stat-tile>
      @if (largest(); as h) {
        @let from = h.currency ?? accountCurrency();
        <app-stat-tile label="Largest holding">
          {{ h.symbol }} — {{ h.marketValue | convertCurrency:from:displayCurrency() }}
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

  /** Sum all holding market values in SEK — the pipe handles conversion to display currency. */
  protected readonly totalValueSEK = computed(() => {
    const fallback = this.accountCurrency();
    return this.holdings().reduce(
      (sum, h) => sum + toSEK(h.marketValue, h.currency ?? fallback),
      0,
    );
  });

  protected readonly count = computed(() => this.holdings().length);

  protected readonly largest = computed(() => {
    const items = this.holdings();
    return items.length > 0
      ? items.reduce((max, h) => (h.marketValue > max.marketValue ? h : max))
      : null;
  });
}
