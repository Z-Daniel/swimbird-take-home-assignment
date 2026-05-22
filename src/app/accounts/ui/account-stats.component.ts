import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { StatTileComponent } from '../../shared/ui/stat-tile.component';
import { Holding } from '../models/holding.model';

@Component({
  selector: 'app-account-stats',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe, StatTileComponent],
  template: `
    <dl class="flex flex-wrap gap-6">
      <app-stat-tile label="Total value">{{ totalValue() | number:'1.0-0' }}</app-stat-tile>
      <app-stat-tile label="Holdings">{{ count() }}</app-stat-tile>
      @if (largest(); as h) {
        <app-stat-tile label="Largest holding">
          {{ h.symbol }} — {{ h.marketValue | number:'1.0-0' }}
        </app-stat-tile>
      }
    </dl>
  `,
})
export class AccountStatsComponent {
  readonly holdings = input.required<Holding[]>();

  protected readonly totalValue = computed(() =>
    this.holdings().reduce((sum, h) => sum + h.marketValue, 0),
  );

  protected readonly count = computed(() => this.holdings().length);

  protected readonly largest = computed(() => {
    const items = this.holdings();
    return items.length > 0
      ? items.reduce((max, h) => (h.marketValue > max.marketValue ? h : max))
      : null;
  });
}
