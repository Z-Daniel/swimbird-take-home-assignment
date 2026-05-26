import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

type NavVariant = 'desktop' | 'mobile';

const VARIANT_CLASS: Record<NavVariant, string> = {
  desktop: 'text-sm font-medium text-muted transition-colors hover:text-foreground',
  mobile: 'block rounded-md px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-border hover:text-foreground',
};

const ACTIVE_CLASS: Record<NavVariant, string> = {
  desktop: 'text-sm font-medium text-primary transition-colors',
  mobile: 'block rounded-md px-3 py-2 text-sm font-medium text-primary transition-colors',
};

@Component({
  selector: 'app-nav-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <li>
      <a
        [routerLink]="link()"
        routerLinkActive #rla="routerLinkActive"
        [ariaCurrentWhenActive]="'page'"
        [class]="rla.isActive ? activeClass() : inactiveClass()"
      >
        <ng-content />
      </a>
    </li>
  `,
})
export class NavItemComponent {
  readonly link = input.required<string>();
  readonly variant = input<NavVariant>('desktop');

  protected readonly inactiveClass = computed(() => VARIANT_CLASS[this.variant()]);
  protected readonly activeClass = computed(() => ACTIVE_CLASS[this.variant()]);
}
