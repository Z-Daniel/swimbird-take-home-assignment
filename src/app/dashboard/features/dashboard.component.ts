import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AccountsSectionComponent } from '../../accounts/features/accounts-section.component';
import { TopHoldingsSectionComponent } from '../../accounts/features/top-holdings-section.component';
import { PerformanceSectionComponent } from './performance-section.component';

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AccountsSectionComponent, TopHoldingsSectionComponent, PerformanceSectionComponent],
  template: `
    <div class="flex flex-col gap-6">
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-[3fr_2fr]">
        <app-performance-section />
        <app-top-holdings-section />
      </div>
      <app-accounts-section />
    </div>
  `,
})
export class DashboardComponent {}
