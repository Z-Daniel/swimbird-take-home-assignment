import { DecimalPipe, SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BadgeComponent } from '../../shared/ui/badge.component';
import { SignedNumberPipe } from '../../shared/ui/signed-number.pipe';
import { Transaction } from '../models/transaction.model';
import { TransactionTypePipe } from './transaction-type.pipe';
import { TrendColorPipe } from '../../shared/ui/trend-color.pipe';

@Component({
  selector: 'app-transactions-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SlicePipe, TransactionTypePipe, TrendColorPipe, BadgeComponent, SignedNumberPipe],
  template: `
    <!-- Desktop table (md+) -->
    <div class="hidden md:block overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-border text-left text-xs font-medium uppercase tracking-wide text-muted">
            <th scope="col" class="py-3 pr-4">Date</th>
            <th scope="col" class="py-3 pr-4">Type</th>
            <th scope="col" class="py-3 pr-4 text-right">Amount</th>
            <th scope="col" class="hidden lg:table-cell py-3">Description</th>
          </tr>
        </thead>
        <tbody>
          @for (tx of transactions(); track tx.id) {
            <tr class="border-b border-border">
              <td class="py-3 pr-4 text-muted">{{ tx.date | slice:0:10 }}</td>
              <td class="py-3 pr-4">
                <app-badge [classes]="tx.type | transactionType">{{ tx.type }}</app-badge>
              </td>
              <td class="py-3 pr-4 text-right font-medium" [class]="tx.amount | trendColor">
                {{ tx.amount | signedNumber }}
              </td>
              <td class="hidden lg:table-cell py-3 text-muted">{{ tx.description }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>

    <!-- Mobile cards (< md) -->
    <ul class="flex flex-col divide-y divide-border md:hidden" role="list">
      @for (tx of transactions(); track tx.id) {
        <li class="py-3">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <app-badge [classes]="tx.type | transactionType">{{ tx.type }}</app-badge>
                <span class="text-xs text-muted">{{ tx.date | slice:0:10 }}</span>
              </div>
              <p class="mt-1 truncate text-sm text-muted">{{ tx.description }}</p>
            </div>
            <p class="shrink-0 font-medium" [class]="tx.amount | trendColor">
              {{ tx.amount | signedNumber }}
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
