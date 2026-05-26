import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-stat-tile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <dt class="text-xs font-medium uppercase tracking-wide text-muted">{{ label() }}</dt>
      <dd [class]="ddClass()"><ng-content /></dd>
    </div>
  `,
})
export class StatTileComponent {
  readonly label = input.required<string>();
  readonly valueClass = input<string>('text-xl font-bold text-foreground');

  protected readonly ddClass = computed(() => `mt-1 ${this.valueClass()}`);
}
