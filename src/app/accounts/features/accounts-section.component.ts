import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { EmptyStateComponent } from '../../shared/ui/empty-state.component';
import { ErrorMessageComponent } from '../../shared/ui/error-message.component';
import { SkeletonListComponent } from '../../shared/ui/skeleton-list.component';
import { Account } from '../account.model';
import { AccountService } from '../account.service';
import { AccountsListComponent } from '../ui/accounts-list.component';

@Component({
  selector: 'app-accounts-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AccountsListComponent, ErrorMessageComponent, EmptyStateComponent, SkeletonListComponent],
  template: `
    <section aria-labelledby="accounts-heading">
      <h2 id="accounts-heading" class="mb-4 text-lg font-semibold text-(--color-text)">Accounts</h2>

      @if (loading()) {
        <app-skeleton-list />
      } @else if (error()) {
        <app-error-message
          [message]="error()!"
          [showRetry]="true"
          (retry)="load()"
        />
      } @else if (accounts().length === 0) {
        <app-empty-state message="No accounts found." />
      } @else {
        <app-accounts-list [accounts]="accounts()" />
      }
    </section>
  `,
})
export class AccountsSectionComponent implements OnInit {
  private readonly accountService = inject(AccountService);
  private readonly destroyRef = inject(DestroyRef);
  private sub: Subscription | null = null;

  protected readonly loading = signal(true);
  protected readonly accounts = signal<Account[]>([]);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.destroyRef.onDestroy(() => this.sub?.unsubscribe());
    this.load();
  }

  protected load(): void {
    this.sub?.unsubscribe();
    this.loading.set(true);
    this.error.set(null);

    this.sub = this.accountService.getAccounts().subscribe({
      next: (accounts) => {
        this.accounts.set(accounts);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load accounts.');
        this.loading.set(false);
      },
    });
  }
}
