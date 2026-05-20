import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AccountsSectionComponent } from '../../accounts/features/accounts-section.component';
import { TopHoldingsSectionComponent } from '../../accounts/features/top-holdings-section.component';
import { PerformanceSectionComponent } from './performance-section.component';

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AccountsSectionComponent, TopHoldingsSectionComponent, PerformanceSectionComponent],
  template: `
    <app-performance-section />
    <app-top-holdings-section />
    <app-accounts-section />
  `,
})
export class DashboardComponent {}
