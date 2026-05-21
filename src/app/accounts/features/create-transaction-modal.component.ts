import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Account } from '../account.model';
import { TransactionService } from '../transaction.service';
import { Transaction, TransactionType, ValidationError } from '../transaction.model';

@Component({
  selector: 'app-create-transaction-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  template: `
    @let isSubmitting = submitting();
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
            [disabled]="isSubmitting"
            class="cursor-pointer rounded-md p-1 text-(--color-text-muted) transition-colors hover:text-(--color-text) disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div class="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          @let errors = fieldErrors();

          @if (serverError()) {
            <div role="alert" class="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
              {{ serverError() }}
            </div>
          }

          <div>
            <label for="tx-date" class="mb-1 block text-sm font-medium text-(--color-text)">Date</label>
            <input
              id="tx-date"
              type="date"
              formControlName="date"
              class="w-full rounded-lg border bg-(--color-surface) px-3 py-2 text-sm text-(--color-text) focus:outline-none focus:ring-2 focus:ring-blue-500"
              [class]="(controls.date.invalid && controls.date.touched) || errors.date ? 'border-red-500' : 'border-(--color-border)'"
            />
            @if ((controls.date.invalid && controls.date.touched) || errors.date) {
              <p class="mt-1 text-xs text-red-600 dark:text-red-400">
                {{ errors.date ?? 'Date is required.' }}
              </p>
            }
          </div>

          <div>
            <label for="tx-type" class="mb-1 block text-sm font-medium text-(--color-text)">Type</label>
            <select
              id="tx-type"
              formControlName="type"
              class="w-full rounded-lg border bg-(--color-surface) px-3 py-2 text-sm text-(--color-text) focus:outline-none focus:ring-2 focus:ring-blue-500"
              [class]="(controls.type.invalid && controls.type.touched) || errors.type ? 'border-red-500' : 'border-(--color-border)'"
            >
              <option value="trade">Trade</option>
              <option value="dividend">Dividend</option>
              <option value="fee">Fee</option>
              <option value="interest">Interest</option>
              <option value="cash">Cash</option>
            </select>
            @if ((controls.type.invalid && controls.type.touched) || errors.type) {
              <p class="mt-1 text-xs text-red-600 dark:text-red-400">
                {{ errors.type ?? 'Type is required.' }}
              </p>
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
              [class]="(controls.amount.invalid && controls.amount.touched) || errors.amount ? 'border-red-500' : 'border-(--color-border)'"
            />
            <p class="mt-1 text-xs text-(--color-text-muted)">Negative for outflows</p>
            @if ((controls.amount.invalid && controls.amount.touched) || errors.amount) {
              <p class="mt-1 text-xs text-red-600 dark:text-red-400">
                {{ errors.amount ?? 'Amount is required.' }}
              </p>
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
              [class]="(controls.description.invalid && controls.description.touched) || errors.description ? 'border-red-500' : 'border-(--color-border)'"
            />
            @if ((controls.description.invalid && controls.description.touched) || errors.description) {
              <p class="mt-1 text-xs text-red-600 dark:text-red-400">
                {{ errors.description ?? 'Description is required.' }}
              </p>
            }
          </div>

        </div>

        <div class="flex justify-end gap-3 border-t border-(--color-border) px-6 py-4">
          <button
            type="button"
            (click)="close()"
            [disabled]="isSubmitting"
            class="cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-(--color-text-muted) transition-colors hover:text-(--color-text) disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            [disabled]="form.invalid || isSubmitting"
            class="flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            @if (isSubmitting) {
              <span class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden="true"></span>
            }
            Add transaction
          </button>
        </div>

      </form>
    </dialog>
  `,
})
export class CreateTransactionModalComponent {
  readonly account = input<Account | undefined>(undefined);
  readonly transactionCreated = output<Transaction>();

  private readonly transactionService = inject(TransactionService);
  private readonly dialogEl = viewChild.required<ElementRef<HTMLDialogElement>>('dialogEl');
  private sub: Subscription | null = null;

  protected readonly form = new FormGroup({
    date: new FormControl('', { validators: Validators.required, nonNullable: true }),
    type: new FormControl<TransactionType>('trade', { validators: Validators.required, nonNullable: true }),
    amount: new FormControl<number | null>(null, Validators.required),
    description: new FormControl('', { validators: Validators.required, nonNullable: true }),
  });

  protected readonly submitting = signal(false);
  protected readonly serverError = signal<string | null>(null);
  protected readonly fieldErrors = signal<Partial<Record<keyof Transaction, string>>>({});

  protected get controls() {
    return this.form.controls;
  }

  constructor() {
    inject(DestroyRef).onDestroy(() => this.sub?.unsubscribe());
  }

  open(): void {
    this.form.reset({ type: 'trade' });
    this.serverError.set(null);
    this.fieldErrors.set({});
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
    this.sub?.unsubscribe();
    this.submitting.set(false);
    this.form.enable();
    this.form.reset({ type: 'trade' });
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const account = this.account();
    if (!account) return;

    this.submitting.set(true);
    this.serverError.set(null);
    this.fieldErrors.set({});
    this.form.disable();

    const { date, type, amount, description } = this.form.getRawValue();

    this.sub = this.transactionService
      .createTransaction(account.id, { date, type, amount: amount!, description })
      .subscribe({
        next: (transaction) => {
          this.submitting.set(false);
          this.transactionCreated.emit(transaction);
          this.close();
        },
        error: (err) => {
          this.submitting.set(false);
          this.form.enable();
          const body: ValidationError = err?.error;
          if (body?.fields) {
            this.fieldErrors.set(body.fields);
            this.form.markAllAsTouched();
          }
          this.serverError.set(body?.error ?? 'Something went wrong. Please try again.');
        },
      });
  }
}
