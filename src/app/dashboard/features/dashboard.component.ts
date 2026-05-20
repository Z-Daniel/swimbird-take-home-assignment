import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AccountsSectionComponent } from '../../accounts/features/accounts-section.component';
import { TopHoldingsSectionComponent } from '../../accounts/features/top-holdings-section.component';

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AccountsSectionComponent, TopHoldingsSectionComponent],
  template: `
    <app-top-holdings-section />
    <app-accounts-section />
  `,
})
export class DashboardComponent {}
