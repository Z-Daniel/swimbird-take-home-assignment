import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export interface SettingOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-setting-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <span class="text-sm font-medium text-foreground">{{ label() }}</span>
      <div
        class="flex rounded-lg border border-border overflow-hidden w-fit"
        role="group"
        [attr.aria-label]="label()"
      >
        @for (opt of options(); track opt.value) {
          <button
            type="button"
            (click)="changed.emit(opt.value)"
            [attr.aria-pressed]="value() === opt.value"
            class="cursor-pointer px-4 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-ring"
            [class]="value() === opt.value
              ? 'bg-primary text-white'
              : 'text-muted hover:text-foreground hover:bg-border'"
          >
            {{ opt.label }}
          </button>
        }
      </div>
    </div>
  `,
})
export class SettingToggleComponent {
  readonly label = input.required<string>();
  readonly options = input.required<SettingOption[]>();
  readonly value = input.required<string>();
  readonly changed = output<string>();
}
