import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Holding } from '../holding.model';

@Component({
  selector: 'app-account-holdings-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe],
  template: `
    <!-- Desktop table (md+) -->
    <div class="hidden md:block overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-(--color-border) text-left text-xs font-medium uppercase tracking-wide text-(--color-text-muted)">
            <th class="py-3 pr-4">Symbol</th>
            <th class="py-3 pr-4">Name</th>
            <th class="py-3 pr-4 text-right">Qty</th>
            <th class="py-3 pr-4 text-right">Value</th>
            <th class="py-3 text-right">Weight</th>
          </tr>
        </thead>
        <tbody>
          @for (holding of holdings(); track holding.symbol) {
            <tr class="border-b border-(--color-border)">
              <td class="py-3 pr-4 font-medium text-(--color-text)">{{ holding.symbol }}</td>
              <td class="py-3 pr-4 text-(--color-text-muted)">{{ holding.name }}</td>
              <td class="py-3 pr-4 text-right text-(--color-text)">{{ holding.quantity | number:'1.0-0' }}</td>
              <td class="py-3 pr-4 text-right font-medium text-(--color-text)">
                {{ holding.marketValue | number:'1.0-0' }}
              </td>
              <td class="py-3 text-right text-(--color-text-muted)">
                {{ holding.weight | number:'1.1-1' }}%
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>

    <!-- Mobile cards (< md) -->
    <ul class="flex flex-col divide-y divide-(--color-border) md:hidden" role="list">
      @for (holding of holdings(); track holding.symbol) {
        <li class="flex items-center justify-between gap-4 py-3">
          <div class="min-w-0">
            <p class="font-medium text-(--color-text)">{{ holding.symbol }}</p>
            <p class="truncate text-xs text-(--color-text-muted)">{{ holding.name }}</p>
            <p class="text-xs text-(--color-text-muted)">Qty {{ holding.quantity | number:'1.0-0' }}</p>
          </div>
          <div class="shrink-0 text-right">
            <p class="font-medium text-(--color-text)">{{ holding.marketValue | number:'1.0-0' }}</p>
            <p class="text-xs text-(--color-text-muted)">{{ holding.weight | number:'1.1-1' }}%</p>
          </div>
        </li>
      }
    </ul>
  `,
})
export class AccountHoldingsListComponent {
  readonly holdings = input.required<Holding[]>();
}
