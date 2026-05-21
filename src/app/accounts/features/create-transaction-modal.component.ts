import { ChangeDetectionStrategy, Component, ElementRef, input, output, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Account } from '../account.model';
import { TransactionType } from '../transaction.model';

export interface TransactionFormValue {
  date: string;
  type: TransactionType;
  amount: number;
  description: string;
}

@Component({
  selector: 'app-create-transaction-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  template: `
    <dialog
      #dialogEl
      class="m-auto w-full max-w-lg rounded-xl bg-(--color-surface) p-0 shadow-xl overflow-hidden backdrop:bg-black/50"
      (click)="onBackdropClick($event)"
      (close)="onDialogClose()"
    >
      <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate class="flex flex-col max-h-[90vh]">

        <div class="flex items-start justify-between border-b border-(--color-border) px-6 py-4">
          <div>
            <h2 class="text-lg font-semibold text-(--color-text)">Add transaction</h2>
            @if (account(); as a) {
              <p class="text-sm text-(--color-text-muted)">{{ a.name }} · {{ a.currency }}</p>
            }
          </div>
          <button
            type="button"
            (click)="close()"
            class="rounded-md p-1 text-(--color-text-muted) transition-colors hover:text-(--color-text)"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div class="flex-1 space-y-5 overflow-y-auto px-6 py-5">

          <div>
            <label for="tx-date" class="mb-1 block text-sm font-medium text-(--color-text)">Date</label>
            <input
              id="tx-date"
              type="date"
              formControlName="date"
              class="w-full rounded-lg border bg-(--color-surface) px-3 py-2 text-sm text-(--color-text) focus:outline-none focus:ring-2 focus:ring-blue-500"
              [class]="controls.date.invalid && controls.date.touched
                ? 'border-red-500'
                : 'border-(--color-border)'"
            />
            @if (controls.date.invalid && controls.date.touched) {
              <p class="mt-1 text-xs text-red-600 dark:text-red-400">Date is required.</p>
            }
          </div>

          <div>
            <label for="tx-type" class="mb-1 block text-sm font-medium text-(--color-text)">Type</label>
            <select
              id="tx-type"
              formControlName="type"
              class="w-full rounded-lg border bg-(--color-surface) px-3 py-2 text-sm text-(--color-text) focus:outline-none focus:ring-2 focus:ring-blue-500"
              [class]="controls.type.invalid && controls.type.touched
                ? 'border-red-500'
                : 'border-(--color-border)'"
            >
              <option value="trade">Trade</option>
              <option value="dividend">Dividend</option>
              <option value="fee">Fee</option>
              <option value="interest">Interest</option>
              <option value="cash">Cash</option>
            </select>
            @if (controls.type.invalid && controls.type.touched) {
              <p class="mt-1 text-xs text-red-600 dark:text-red-400">Type is required.</p>
            }
          </div>

          <div>
            <label for="tx-amount" class="mb-1 block text-sm font-medium text-(--color-text)">
              Amount
              @if (account(); as a) { ({{ a.currency }}) }
            </label>
            <input
              id="tx-amount"
              type="number"
              formControlName="amount"
              step="0.01"
              placeholder="e.g. -2400.00"
              class="w-full rounded-lg border bg-(--color-surface) px-3 py-2 text-sm text-(--color-text) focus:outline-none focus:ring-2 focus:ring-blue-500"
              [class]="controls.amount.invalid && controls.amount.touched
                ? 'border-red-500'
                : 'border-(--color-border)'"
            />
            <p class="mt-1 text-xs text-(--color-text-muted)">Negative for outflows</p>
            @if (controls.amount.invalid && controls.amount.touched) {
              <p class="mt-1 text-xs text-red-600 dark:text-red-400">Amount is required.</p>
            }
          </div>

          <div>
            <label for="tx-description" class="mb-1 block text-sm font-medium text-(--color-text)">Description</label>
            <input
              id="tx-description"
              type="text"
              formControlName="description"
              placeholder="e.g. AAPL sell — 20 shares"
              class="w-full rounded-lg border bg-(--color-surface) px-3 py-2 text-sm text-(--color-text) focus:outline-none focus:ring-2 focus:ring-blue-500"
              [class]="controls.description.invalid && controls.description.touched
                ? 'border-red-500'
                : 'border-(--color-border)'"
            />
            @if (controls.description.invalid && controls.description.touched) {
              <p class="mt-1 text-xs text-red-600 dark:text-red-400">Description is required.</p>
            }
          </div>

        </div>

        <div class="flex justify-end gap-3 border-t border-(--color-border) px-6 py-4">
          <button
            type="button"
            (click)="close()"
            class="rounded-lg px-4 py-2 text-sm font-medium text-(--color-text-muted) transition-colors hover:text-(--color-text)"
          >
            Cancel
          </button>
          <button
            type="submit"
            [disabled]="form.invalid"
            class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add transaction
          </button>
        </div>

      </form>
    </dialog>
  `,
})
export class CreateTransactionModalComponent {
  readonly account = input<Account | undefined>(undefined);
  readonly submitted = output<TransactionFormValue>();

  private readonly dialogEl = viewChild.required<ElementRef<HTMLDialogElement>>('dialogEl');

  protected readonly form = new FormGroup({
    date: new FormControl('', { validators: Validators.required, nonNullable: true }),
    type: new FormControl<TransactionType>('trade', { validators: Validators.required, nonNullable: true }),
    amount: new FormControl<number | null>(null, Validators.required),
    description: new FormControl('', { validators: Validators.required, nonNullable: true }),
  });

  protected get controls() {
    return this.form.controls;
  }

  open(): void {
    this.form.reset({ type: 'trade' });
    this.dialogEl().nativeElement.showModal();
  }

  close(): void {
    this.dialogEl().nativeElement.close();
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === this.dialogEl().nativeElement) {
      this.close();
    }
  }

  protected onDialogClose(): void {
    this.form.reset({ type: 'trade' });
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { date, type, amount, description } = this.form.getRawValue();
    this.submitted.emit({ date, type, amount: amount!, description });
  }
}
