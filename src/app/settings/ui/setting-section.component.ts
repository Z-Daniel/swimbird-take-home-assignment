import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-setting-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      [id]="id()"
      class="rounded-xl border border-border bg-surface p-(--density-padding) flex flex-col gap-(--density-gap)"
    >
      <div class="space-y-1">
        <h2 class="text-base font-semibold text-foreground">{{ title() }}</h2>
        <p class="text-sm text-muted">{{ description() }}</p>
      </div>
      <ng-content />
    </section>
  `,
})
export class SettingSectionComponent {
  readonly id = input<string>('');
  readonly title = input.required<string>();
  readonly description = input.required<string>();
}
