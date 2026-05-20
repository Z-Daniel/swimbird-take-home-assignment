import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { SectionState } from '../../core/section-state';
import { SectionShellComponent } from '../../shared/ui/section-shell.component';
import { AccountService } from '../account.service';
import { AccountsListComponent } from '../ui/accounts-list.component';

@Component({
  selector: 'app-accounts-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionShellComponent, AccountsListComponent],
  template: `
    <app-section-shell
      title="Accounts"
      [loading]="state.loading()"
      [error]="state.error()"
      [empty]="state.items().length === 0"
      emptyMessage="No accounts found."
      (retry)="state.load()"
    >
      <app-accounts-list [accounts]="state.items()" />
    </app-section-shell>
  `,
})
export class AccountsSectionComponent implements OnInit {
  private readonly accountService = inject(AccountService);

  protected readonly state = new SectionState(
    () => this.accountService.getAccounts(),
    'Failed to load accounts.',
    inject(DestroyRef),
  );

  ngOnInit(): void {
    this.state.load();
  }
}
