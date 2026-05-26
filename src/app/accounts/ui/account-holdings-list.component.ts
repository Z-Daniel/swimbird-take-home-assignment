import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Currency } from '../../core/models/currency.model';
import { SettingsService } from '../../core/services/settings.service';
import { ConvertCurrencyPipe } from '../../shared/ui/convert-currency.pipe';
import { Holding } from '../models/holding.model';

@Component({
  selector: 'app-account-holdings-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe, ConvertCurrencyPipe],
  template: `
    <!-- Desktop table (md+) -->
    <div class="hidden md:block overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-border text-left text-xs font-medium uppercase tracking-wide text-muted">
            <th scope="col" class="py-3 pr-4">Symbol</th>
            <th scope="col" class="py-3 pr-4">Name</th>
            <th scope="col" class="py-3 pr-4 text-right">Qty</th>
            <th scope="col" class="py-3 pr-4 text-right">Value</th>
            <th scope="col" class="py-3 text-right">Weight</th>
          </tr>
        </thead>
        <tbody>
          @for (holding of holdings(); track holding.symbol) {
            @let from = holding.currency ?? accountCurrency();
            <tr class="border-b border-border">
              <td class="py-3 pr-4 font-medium text-foreground">{{ holding.symbol }}</td>
              <td class="py-3 pr-4 text-muted">{{ holding.name }}</td>
              <td class="py-3 pr-4 text-right text-foreground">{{ holding.quantity | number:'1.0-0' }}</td>
              <td class="py-3 pr-4 text-right font-medium text-foreground">
                {{ holding.marketValue | convertCurrency:from:displayCurrency() }}
              </td>
              <td class="py-3 text-right text-muted">
                {{ holding.weight | number:'1.1-1' }}%
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>

    <!-- Mobile cards (< md) -->
    <ul class="flex flex-col divide-y divide-border md:hidden" role="list">
      @for (holding of holdings(); track holding.symbol) {
        @let from = holding.currency ?? accountCurrency();
        <li class="flex items-center justify-between gap-4 py-3">
          <div class="min-w-0">
            <p class="font-medium text-foreground">{{ holding.symbol }}</p>
            <p class="truncate text-xs text-muted">{{ holding.name }}</p>
            <p class="text-xs text-muted">Qty {{ holding.quantity | number:'1.0-0' }}</p>
          </div>
          <div class="shrink-0 text-right">
            <p class="font-medium text-foreground">
              {{ holding.marketValue | convertCurrency:from:displayCurrency() }}
            </p>
            <p class="text-xs text-muted">{{ holding.weight | number:'1.1-1' }}%</p>
          </div>
        </li>
      }
    </ul>
  `,
})
export class AccountHoldingsListComponent {
  readonly holdings = input.required<Holding[]>();
  readonly accountCurrency = input.required<Currency>();

  protected readonly displayCurrency = inject(SettingsService).currency;
}
