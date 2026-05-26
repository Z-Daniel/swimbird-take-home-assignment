import { Pipe, PipeTransform } from '@angular/core';
import { AccountStatus } from '../models/account.model';

@Pipe({ name: 'accountStatus' })
export class AccountStatusPipe implements PipeTransform {
  transform(status: AccountStatus): string {
    switch (status) {
      case 'active':
        return 'bg-success-bg text-success-fg';
      case 'restricted':
        return 'bg-warning-bg text-warning-fg';
      case 'closed':
        return 'bg-border text-muted';
    }
  }
}
