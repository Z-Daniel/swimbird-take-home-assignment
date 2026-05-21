import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, input, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { SectionState } from '../../core/section-state';
import { SectionShellComponent } from '../../shared/ui/section-shell.component';
import { PerformanceService } from '../../dashboard/performance.service';
import { PerformanceChartComponent } from '../../dashboard/ui/performance-chart.component';
import { AccountService } from '../account.service';
import { HoldingService } from '../holding.service';
import { TransactionService } from '../transaction.service';
import { Transaction } from '../transaction.model';
import { AccountHeaderComponent } from '../ui/account-header.component';
import { AccountHoldingsListComponent } from '../ui/account-holdings-list.component';
import { AccountStatsComponent } from '../ui/account-stats.component';
import { TransactionsListComponent } from '../ui/transactions-list.component';
import { CreateTransactionModalComponent } from './create-transaction-modal.component';

@Component({
  selector: 'app-account-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    SectionShellComponent,
    AccountHeaderComponent,
    AccountStatsComponent,
    PerformanceChartComponent,
    AccountHoldingsListComponent,
    TransactionsListComponent,
    CreateTransactionModalComponent,
  ],
  template: `
    @let account = accountState.items()[0];

    <div class="flex flex-col gap-6">
      <a
        routerLink="/dashboard"
        class="flex w-fit items-center gap-1 text-sm text-(--color-text-muted) transition-colors hover:text-(--color-text)"
      >
        ← Back to dashboard
      </a>

      <div class="flex items-start justify-between gap-4">
        <div class="flex-1">
          <app-section-shell
            [loading]="accountState.loading()"
            [error]="accountState.error()"
            [empty]="false"
            (retry)="accountState.load()"
          >
            <app-account-header [account]="account" />
          </app-section-shell>
        </div>
        @if (account) {
          <button
            (click)="createTransactionModal().open()"
            class="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            + Add transaction
          </button>
        }
      </div>

      @let holdings = holdingsState.items();
      @if (holdings.length > 0) {
        <app-account-stats [holdings]="holdings" />
      }

      <app-section-shell
        title="Performance"
        [loading]="performanceState.loading()"
        [error]="performanceState.error()"
        [empty]="performanceState.items().length === 0"
        emptyMessage="No performance data found."
        (retry)="performanceState.load()"
      >
        <app-performance-chart [data]="performanceState.items()" />
      </app-section-shell>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <app-section-shell
          title="Holdings"
          [loading]="holdingsState.loading()"
          [error]="holdingsState.error()"
          [empty]="holdings.length === 0"
          emptyMessage="No holdings found."
          (retry)="holdingsState.load()"
        >
          <app-account-holdings-list [holdings]="holdings" />
        </app-section-shell>

        @let transactions = transactionsState.items();
        <app-section-shell
          title="Recent transactions"
          [loading]="transactionsState.loading()"
          [error]="transactionsState.error()"
          [empty]="transactions.length === 0"
          emptyMessage="No transactions yet."
          (retry)="transactionsState.load()"
        >
          <app-transactions-list [transactions]="transactions" />
        </app-section-shell>
      </div>
    </div>

    <app-create-transaction-modal
      [account]="account"
      (transactionCreated)="onTransactionCreated($event)"
    />
  `,
})
export class AccountDetailComponent {
  protected readonly createTransactionModal = viewChild.required(CreateTransactionModalComponent);

  private readonly accountService = inject(AccountService);
  private readonly holdingService = inject(HoldingService);
  private readonly transactionService = inject(TransactionService);
  private readonly performanceService = inject(PerformanceService);

  readonly id = input.required<string>();

  protected readonly accountState = new SectionState(
    () => this.accountService.getAccount(this.id()).pipe(map((a) => [a])),
    'Failed to load account.',
    inject(DestroyRef),
  );

  protected readonly holdingsState = new SectionState(
    () => this.holdingService.getHoldings(this.id()),
    'Failed to load holdings.',
    inject(DestroyRef),
  );

  protected readonly transactionsState = new SectionState(
    () => this.transactionService.getTransactions(this.id()),
    'Failed to load transactions.',
    inject(DestroyRef),
  );

  protected readonly performanceState = new SectionState(
    () => this.performanceService.getAccountPerformance(this.id()),
    'Failed to load performance data.',
    inject(DestroyRef),
  );

  protected onTransactionCreated(transaction: Transaction): void {
    this.transactionsState.items.update((current) => [transaction, ...current]);
  }

  constructor() {
    effect(() => {
      this.id(); // re-run all loads when id changes
      this.accountState.load();
      this.holdingsState.load();
      this.transactionsState.load();
      this.performanceState.load();
    });
  }
}
