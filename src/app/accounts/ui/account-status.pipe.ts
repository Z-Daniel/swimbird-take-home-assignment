import { Pipe, PipeTransform } from '@angular/core';
import { AccountStatus } from '../account.model';

@Pipe({ name: 'accountStatus' })
export class AccountStatusPipe implements PipeTransform {
  transform(status: AccountStatus): string {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'restricted':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300';
      case 'closed':
        return 'bg-(--color-border) text-(--color-text-muted)';
    }
  }
}
