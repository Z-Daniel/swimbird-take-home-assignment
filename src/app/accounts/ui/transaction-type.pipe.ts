import { Pipe, PipeTransform } from '@angular/core';
import { TransactionType } from '../models/transaction.model';

@Pipe({ name: 'transactionType' })
export class TransactionTypePipe implements PipeTransform {
  transform(type: TransactionType): string {
    switch (type) {
      case 'trade':
        return 'bg-info-bg text-info-fg';
      case 'dividend':
        return 'bg-success-bg text-success-fg';
      case 'fee':
        return 'bg-danger-bg text-danger-fg';
      case 'interest':
        return 'bg-accent-bg text-accent-fg';
      case 'cash':
        return 'bg-border text-muted';
    }
  }
}
