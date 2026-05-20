import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-account-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<h1>Account {{ id() }}</h1>`,
})
export class AccountDetailComponent {
  readonly id = input.required<string>();
}
