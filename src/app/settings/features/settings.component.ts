import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SettingsService } from '../../core/services/settings.service';
import { SettingToggleComponent, SettingOption } from '../ui/setting-toggle.component';
import { SettingSectionComponent } from '../ui/setting-section.component';

const THEME_OPTIONS: SettingOption[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

const DENSITY_OPTIONS: SettingOption[] = [
  { value: 'compact', label: 'Compact' },
  { value: 'default', label: 'Default' },
  { value: 'comfortable', label: 'Comfortable' },
];

const CURRENCY_OPTIONS: SettingOption[] = [
  { value: 'SEK', label: 'SEK' },
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
];

@Component({
  selector: 'app-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SettingToggleComponent, SettingSectionComponent],
  template: `
    <div class="mx-auto max-w-2xl">
      <h1 class="mb-8 text-2xl font-bold text-foreground">Settings</h1>

      <div class="flex flex-col gap-(--density-gap)">

        <app-setting-section
          id="appearance"
          title="Appearance"
          description="Choose how the interface looks."
        >
          <app-setting-toggle
            label="Theme"
            [options]="themeOptions"
            [value]="settings.theme()"
            (changed)="settings.theme.set($any($event))"
          />
          <app-setting-toggle
            label="Density"
            [options]="densityOptions"
            [value]="settings.density()"
            (changed)="settings.density.set($any($event))"
          />
        </app-setting-section>

        <app-setting-section
          id="preferences"
          title="Preferences"
          description="Customise display and data preferences."
        >
          <app-setting-toggle
            label="Display currency"
            [options]="currencyOptions"
            [value]="settings.currency()"
            (changed)="settings.currency.set($any($event))"
          />
        </app-setting-section>

      </div>
    </div>
  `,
})
export class SettingsComponent {
  protected readonly settings = inject(SettingsService);

  protected readonly themeOptions = THEME_OPTIONS;
  protected readonly densityOptions = DENSITY_OPTIONS;
  protected readonly currencyOptions = CURRENCY_OPTIONS;
}
