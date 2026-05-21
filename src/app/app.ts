import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppHeaderComponent } from './shared/ui/app-header.component';
import { ToastOutletComponent } from './shared/ui/toast-outlet.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppHeaderComponent, ToastOutletComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
