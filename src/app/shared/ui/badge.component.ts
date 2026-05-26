import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="rounded-full px-2 py-0.5 text-xs font-medium" [class]="classes()">
      <ng-content />
    </span>
  `,
})
export class BadgeComponent {
  readonly classes = input.required<string>();
}
