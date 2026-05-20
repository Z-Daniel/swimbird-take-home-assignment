import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Account } from '../account.model';
import { AccountStatusPipe } from './account-status.pipe';
import { TrendColorPipe } from '../../shared/ui/trend-color.pipe';

@Component({
  selector: 'app-accounts-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, DecimalPipe, TrendColorPipe, AccountStatusPipe],
  templateUrl: './accounts-list.component.html',
})
export class AccountsListComponent {
  readonly accounts = input.required<Account[]>();
}
