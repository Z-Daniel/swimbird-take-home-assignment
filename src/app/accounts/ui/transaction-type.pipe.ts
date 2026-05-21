import { Pipe, PipeTransform } from '@angular/core';
import { TransactionType } from '../transaction.model';

@Pipe({ name: 'transactionType' })
export class TransactionTypePipe implements PipeTransform {
  transform(type: TransactionType): string {
    switch (type) {
      case 'trade':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'dividend':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'fee':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      case 'interest':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      case 'cash':
        return 'bg-(--color-border) text-(--color-text-muted)';
    }
  }
}
