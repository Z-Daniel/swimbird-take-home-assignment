import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Holding } from '../models/holding.model';

@Component({
  selector: 'app-top-holdings-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe],
  template: `
    <ol role="list" class="divide-y divide-(--color-border)">
      @for (holding of holdings(); track holding.symbol) {
        <li class="flex items-center justify-between gap-4 py-3">
          <div class="min-w-0">
            <p class="font-medium text-(--color-text)">{{ holding.symbol }}</p>
            <p class="truncate text-xs text-(--color-text-muted)">{{ holding.name }}</p>
          </div>
          <div class="text-right shrink-0">
            <p class="font-medium text-(--color-text)">
              {{ holding.marketValue | number:'1.0-0' }}
            </p>
            <p class="text-xs text-(--color-text-muted)">{{ holding.weight | number:'1.1-1' }}%</p>
          </div>
        </li>
      }
    </ol>
  `,
})
export class TopHoldingsListComponent {
  readonly holdings = input.required<Holding[]>();
}
