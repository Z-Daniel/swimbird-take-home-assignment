import { DecimalPipe, SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Transaction } from '../models/transaction.model';
import { TransactionTypePipe } from './transaction-type.pipe';
import { TrendColorPipe } from '../../shared/ui/trend-color.pipe';

@Component({
  selector: 'app-transactions-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe, SlicePipe, TransactionTypePipe, TrendColorPipe],
  template: `
    <!-- Desktop table (md+) -->
    <div class="hidden md:block overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-(--color-border) text-left text-xs font-medium uppercase tracking-wide text-(--color-text-muted)">
            <th scope="col" class="py-3 pr-4">Date</th>
            <th scope="col" class="py-3 pr-4">Type</th>
            <th scope="col" class="py-3 pr-4 text-right">Amount</th>
            <th scope="col" class="hidden lg:table-cell py-3">Description</th>
          </tr>
        </thead>
        <tbody>
          @for (tx of transactions(); track tx.id) {
            <tr class="border-b border-(--color-border)">
              <td class="py-3 pr-4 text-(--color-text-muted)">{{ tx.date | slice:0:10 }}</td>
              <td class="py-3 pr-4">
                <span class="rounded-full px-2 py-0.5 text-xs font-medium" [class]="tx.type | transactionType">
                  {{ tx.type }}
                </span>
              </td>
              <td class="py-3 pr-4 text-right font-medium" [class]="tx.amount | trendColor">
                {{ tx.amount >= 0 ? '+' : '' }}{{ tx.amount | number:'1.2-2' }}
              </td>
              <td class="hidden lg:table-cell py-3 text-(--color-text-muted)">{{ tx.description }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>

    <!-- Mobile cards (< md) -->
    <ul class="flex flex-col divide-y divide-(--color-border) md:hidden" role="list">
      @for (tx of transactions(); track tx.id) {
        <li class="py-3">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <span class="rounded-full px-2 py-0.5 text-xs font-medium" [class]="tx.type | transactionType">
                  {{ tx.type }}
                </span>
                <span class="text-xs text-(--color-text-muted)">{{ tx.date | slice:0:10 }}</span>
              </div>
              <p class="mt-1 truncate text-sm text-(--color-text-muted)">{{ tx.description }}</p>
            </div>
            <p class="shrink-0 font-medium" [class]="tx.amount | trendColor">
              {{ tx.amount >= 0 ? '+' : '' }}{{ tx.amount | number:'1.2-2' }}
            </p>
          </div>
        </li>
      }
    </ul>
  `,
})
export class TransactionsListComponent {
  readonly transactions = input.required<Transaction[]>();
}
