import { DecimalPipe, SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { StatTileComponent } from '../../shared/ui/stat-tile.component';
import { Account } from '../models/account.model';
import { AccountStatusPipe } from './account-status.pipe';
import { TrendColorPipe } from '../../shared/ui/trend-color.pipe';
import { ConvertCurrencyPipe } from '../../shared/ui/convert-currency.pipe';
import { SettingsService } from '../../core/services/settings.service';

@Component({
  selector: 'app-account-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe, SlicePipe, StatTileComponent, AccountStatusPipe, TrendColorPipe, ConvertCurrencyPipe],
  template: `
    @let a = account();
    <div class="space-y-4">
      <div>
        <h1 class="text-2xl font-bold text-foreground">{{ a.name }}</h1>
        <p class="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted">
          {{ a.type }} · {{ a.currency }} · Opened {{ a.openedAt | slice:0:10 }} · {{ a.owner }}
          <span
            class="rounded-full px-2 py-0.5 text-xs font-medium"
            [class]="a.status | accountStatus"
          >
            {{ a.status }}
          </span>
        </p>
      </div>

      <dl class="flex flex-wrap gap-6">
        <app-stat-tile label="Balance" valueClass="text-2xl font-bold text-foreground">
          {{ a.balance | convertCurrency:a.currency:displayCurrency() | number:'1.0-0' }} {{ displayCurrency() }}
        </app-stat-tile>
        <app-stat-tile label="Change today" [valueClass]="'text-2xl font-bold ' + (a.changeToday | trendColor)">
          {{ a.changeToday >= 0 ? '+' : '' }}{{ a.changeToday | number:'1.2-2' }}%
        </app-stat-tile>
        <app-stat-tile label="Risk level" valueClass="text-2xl font-bold text-foreground">
          {{ a.riskLevel }}
        </app-stat-tile>
      </dl>
    </div>
  `,
})
export class AccountHeaderComponent {
  readonly account = input.required<Account>();
  protected readonly displayCurrency = inject(SettingsService).currency;
}
