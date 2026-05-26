import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Account } from '../models/account.model';
import { AccountStatusPipe } from './account-status.pipe';
import { TrendColorPipe } from '../../shared/ui/trend-color.pipe';

@Component({
  selector: 'app-accounts-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DecimalPipe, TrendColorPipe, AccountStatusPipe],
  template: `
    <!-- Desktop table (md+) -->
    <div class="hidden md:block overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-border text-left text-xs font-medium uppercase tracking-wide text-muted">
            <th scope="col" class="py-3 pr-4">Name</th>
            <th scope="col" class="hidden lg:table-cell py-3 pr-4">Type</th>
            <th scope="col" class="hidden lg:table-cell py-3 pr-4">Currency</th>
            <th scope="col" class="py-3 pr-4 text-right">Balance</th>
            <th scope="col" class="py-3 pr-4 text-right">Change today</th>
            <th scope="col" class="py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          @for (account of accounts(); track account.id) {
            <tr
              [routerLink]="['/accounts', account.id]"
              tabindex="0"
              (keydown.enter)="navigate(account.id)"
              class="cursor-pointer border-b border-border transition-colors hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-ring"
            >
              <td class="py-3 pr-4 font-medium text-foreground">{{ account.name }}</td>
              <td class="hidden lg:table-cell py-3 pr-4 text-muted">{{ account.type }}</td>
              <td class="hidden lg:table-cell py-3 pr-4 text-muted">{{ account.currency }}</td>
              <td class="py-3 pr-4 text-right font-medium text-foreground">
                {{ account.balance | number:'1.0-0' }} {{ account.currency }}
              </td>
              <td class="py-3 pr-4 text-right" [class]="account.changeToday | trendColor">
                {{ account.changeToday >= 0 ? '+' : '' }}{{ account.changeToday | number:'1.2-2' }}%
              </td>
              <td class="py-3">
                <span class="rounded-full px-2 py-0.5 text-xs font-medium" [class]="account.status | accountStatus">
                  {{ account.status }}
                </span>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>

    <!-- Mobile cards (< md) -->
    <ul class="flex flex-col gap-(--density-gap) md:hidden" role="list">
      @for (account of accounts(); track account.id) {
        <li>
          <a
            [routerLink]="['/accounts', account.id]"
            class="block rounded-lg border border-border bg-surface p-(--density-padding) no-underline transition-colors hover:bg-border focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-ring"
          >
            <div class="flex items-start justify-between gap-2">
              <div>
                <p class="font-medium text-foreground">{{ account.name }}</p>
                <p class="text-xs text-muted">{{ account.type }} · {{ account.currency }}</p>
              </div>
              <span class="rounded-full px-2 py-0.5 text-xs font-medium" [class]="account.status | accountStatus">
                {{ account.status }}
              </span>
            </div>
            <div class="mt-3 flex items-end justify-between">
              <p class="text-lg font-semibold text-foreground">
                {{ account.balance | number:'1.0-0' }} {{ account.currency }}
              </p>
              <p class="text-sm font-medium" [class]="account.changeToday | trendColor">
                {{ account.changeToday >= 0 ? '+' : '' }}{{ account.changeToday | number:'1.2-2' }}%
              </p>
            </div>
          </a>
        </li>
      }
    </ul>
  `,
})
export class AccountsListComponent {
  readonly accounts = input.required<Account[]>();

  private readonly router = inject(Router);

  navigate(id: string): void {
    this.router.navigate(['/accounts', id]);
  }
}
