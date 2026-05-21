import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject, of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { Account } from '../account.model';
import { Transaction } from '../transaction.model';
import { TransactionService } from '../transaction.service';
import { CreateTransactionModalComponent } from './create-transaction-modal.component';

const mockAccount: Account = {
  id: 'acc-1',
  name: 'Growth',
  type: 'Investment',
  currency: 'USD',
  balance: 100_000,
  changeToday: 0.5,
  riskLevel: 'Medium',
  owner: 'John',
  status: 'active',
  openedAt: '2020-01-01T00:00:00Z',
};

const mockTransaction: Transaction = {
  id: 'tx-1',
  date: '2026-05-21',
  type: 'trade',
  amount: -2400,
  description: 'AAPL sell',
  currency: 'USD',
  accountId: 'acc-1',
};

const validFormValue = {
  date: '2026-05-21',
  type: 'trade' as const,
  amount: -2400,
  description: 'AAPL sell',
};

describe('CreateTransactionModalComponent', () => {
  let fixture: ComponentFixture<CreateTransactionModalComponent>;
  let component: CreateTransactionModalComponent;
  let createTransactionSpy: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    createTransactionSpy = vi.fn();

    HTMLDialogElement.prototype.showModal = vi.fn();
    HTMLDialogElement.prototype.close = vi.fn();

    await TestBed.configureTestingModule({
      imports: [CreateTransactionModalComponent],
      providers: [
        { provide: TransactionService, useValue: { createTransaction: createTransactionSpy } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateTransactionModalComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('account', mockAccount);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display account name and currency in the header', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Growth');
    expect(el.textContent).toContain('USD');
  });

  describe('form validation', () => {
    it('should mark all controls as touched when submitting an empty form', () => {
      component['onSubmit']();
      const controls = component['form'].controls;
      expect(controls.date.touched).toBe(true);
      expect(controls.type.touched).toBe(true);
      expect(controls.amount.touched).toBe(true);
      expect(controls.description.touched).toBe(true);
    });

    it('should not call createTransaction when the form is invalid', () => {
      component['onSubmit']();
      expect(createTransactionSpy).not.toHaveBeenCalled();
    });
  });

  describe('successful submission', () => {
    beforeEach(() => {
      createTransactionSpy.mockReturnValue(of(mockTransaction));
      component['form'].setValue(validFormValue);
    });

    it('should call createTransaction with the correct payload', () => {
      component['onSubmit']();
      expect(createTransactionSpy).toHaveBeenCalledWith('acc-1', {
        date: '2026-05-21',
        type: 'trade',
        amount: -2400,
        description: 'AAPL sell',
      });
    });

    it('should emit transactionCreated with the returned transaction', () => {
      const emitted: Transaction[] = [];
      component.transactionCreated.subscribe((t) => emitted.push(t));
      component['onSubmit']();
      expect(emitted).toEqual([mockTransaction]);
    });

    it('should close the dialog on success', () => {
      component['onSubmit']();
      expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
    });
  });

  describe('server error handling', () => {
    it('should surface server field errors under the relevant inputs', () => {
      createTransactionSpy.mockReturnValue(
        throwError(() => ({
          error: {
            error: 'Validation failed.',
            fields: { amount: 'Amount must be non-zero.' },
          },
        })),
      );
      component['form'].setValue(validFormValue);
      component['onSubmit']();
      fixture.detectChanges();

      expect(component['fieldErrors']()).toEqual({ amount: 'Amount must be non-zero.' });
      expect((fixture.nativeElement as HTMLElement).textContent).toContain(
        'Amount must be non-zero.',
      );
    });

    it('should show a general error banner when there are no field errors', () => {
      createTransactionSpy.mockReturnValue(
        throwError(() => ({ error: { error: 'Internal server error.' } })),
      );
      component['form'].setValue(validFormValue);
      component['onSubmit']();
      fixture.detectChanges();

      expect(component['serverError']()).toBe('Internal server error.');
      expect((fixture.nativeElement as HTMLElement).textContent).toContain(
        'Internal server error.',
      );
    });

    it('should fall back to a generic message when the server response has no error body', () => {
      createTransactionSpy.mockReturnValue(throwError(() => ({})));
      component['form'].setValue(validFormValue);
      component['onSubmit']();

      expect(component['serverError']()).toBe('Something went wrong. Please try again.');
    });
  });

  describe('loading state', () => {
    it('should disable the form and set submitting while the request is in flight', () => {
      const subject = new Subject<Transaction>();
      createTransactionSpy.mockReturnValue(subject.asObservable());
      component['form'].setValue(validFormValue);

      component['onSubmit']();

      expect(component['submitting']()).toBe(true);
      expect(component['form'].disabled).toBe(true);
    });

    it('should re-enable the form and clear submitting after a server error', () => {
      const subject = new Subject<Transaction>();
      createTransactionSpy.mockReturnValue(subject.asObservable());
      component['form'].setValue(validFormValue);

      component['onSubmit']();
      subject.error({ error: { error: 'Server error.' } });

      expect(component['submitting']()).toBe(false);
      expect(component['form'].enabled).toBe(true);
    });
  });

  describe('open()', () => {
    it('should call showModal', () => {
      component.open();
      expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
    });

    it('should reset the form and clear server errors', () => {
      component['serverError'].set('Previous error');
      component['fieldErrors'].set({ date: 'Invalid date.' });
      component['form'].setValue({ date: '2020-01-01', type: 'fee', amount: 100, description: 'old' });

      component.open();

      expect(component['serverError']()).toBeNull();
      expect(component['fieldErrors']()).toEqual({});
      expect(component['form'].value.date).toBe('');
    });
  });
});
