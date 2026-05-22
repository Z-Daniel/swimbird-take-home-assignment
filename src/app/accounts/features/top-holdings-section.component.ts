import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { SectionState } from '../../core/section-state';
import { SectionShellComponent } from '../../shared/ui/section-shell.component';
import { HoldingService } from '../services/holding.service';
import { TopHoldingsListComponent } from '../ui/top-holdings-list.component';

const TOP_N = 5;

@Component({
  selector: 'app-top-holdings-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionShellComponent, TopHoldingsListComponent],
  template: `
    <app-section-shell
      title="Top holdings"
      [loading]="state.loading()"
      [error]="state.error()"
      [empty]="state.items().length === 0"
      emptyMessage="No holdings found."
      (retry)="state.load()"
    >
      <app-top-holdings-list [holdings]="state.items()" />
    </app-section-shell>
  `,
})
export class TopHoldingsSectionComponent implements OnInit {
  private readonly holdingService = inject(HoldingService);

  protected readonly state = new SectionState(
    () => this.holdingService.getAllHoldings({ sortBy: 'marketValue', direction: 'desc' }).pipe(
      map((holdings) => holdings.slice(0, TOP_N)),
    ),
    'Failed to load holdings.',
    inject(DestroyRef),
  );

  ngOnInit(): void {
    this.state.load();
  }
}
