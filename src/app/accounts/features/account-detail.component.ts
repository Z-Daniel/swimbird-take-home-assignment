import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { SectionState } from '../../core/section-state';
import { SectionShellComponent } from '../../shared/ui/section-shell.component';
import { AccountService } from '../account.service';
import { HoldingService } from '../holding.service';
import { TransactionService } from '../transaction.service';
import { AccountHeaderComponent } from '../ui/account-header.component';
import { AccountHoldingsListComponent } from '../ui/account-holdings-list.component';
import { TransactionsListComponent } from '../ui/transactions-list.component';

@Component({
  selector: 'app-account-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, SectionShellComponent, AccountHeaderComponent, AccountHoldingsListComponent, TransactionsListComponent],
  template: `
    <div class="flex flex-col gap-6">
      <a
        routerLink="/dashboard"
        class="flex w-fit items-center gap-1 text-sm text-(--color-text-muted) transition-colors hover:text-(--color-text)"
      >
        ← Back to dashboard
      </a>

      <app-section-shell
        [loading]="accountState.loading()"
        [error]="accountState.error()"
        [empty]="false"
        (retry)="accountState.load()"
      >
        <app-account-header [account]="accountState.items()[0]" />
      </app-section-shell>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        @let holdings = holdingsState.items();
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
  `,
})
export class AccountDetailComponent {
  private readonly accountService = inject(AccountService);
  private readonly holdingService = inject(HoldingService);
  private readonly transactionService = inject(TransactionService);

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

  constructor() {
    effect(() => {
      this.id(); // re-run load when id changes
      this.accountState.load();
      this.holdingsState.load();
      this.transactionsState.load();
    });
  }
}
