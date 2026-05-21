import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <li>
      <a
        [routerLink]="link()"
        routerLinkActive="text-(--color-text)"
        [ariaCurrentWhenActive]="'page'"
        [class]="linkClass()"
      >
        <ng-content />
      </a>
    </li>
  `,
})
export class NavItemComponent {
  readonly link = input.required<string>();
  readonly linkClass = input<string>(
    'text-sm font-medium text-(--color-text-muted) transition-colors hover:text-(--color-text)',
  );
}
