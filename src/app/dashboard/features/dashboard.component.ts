import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AccountsSectionComponent } from '../../accounts/features/accounts-section.component';

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AccountsSectionComponent],
  template: `
    <app-accounts-section />
  `,
})
export class DashboardComponent {}
