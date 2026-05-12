import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AccountService } from '../../services/account_service';
import { TransactionService } from '../../services/transaction-service';
import {
  insufficientBalanceValidator,
  notSameAccountValidator,
} from '../../validators/transfer.validator';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './transfer.html',
  styleUrl: './transfer.scss',
})
export class Transfer {
  fb = inject(FormBuilder);
  router = inject(Router);

  protected accountService = inject(AccountService);
  protected txService = inject(TransactionService);

  transferForm = this.fb.nonNullable.group(
    {
      fromAccountId: ['', Validators.required, Validators.pattern(/^\d{4}-\d{4}-\d{4}$/)],
      toAccountNumber: ['', [Validators.required]],
      amount: [0, [Validators.required, Validators.min(10000)]],
      note: [''],
    },
    {
      validators: [
        insufficientBalanceValidator(() => this.accountService.accounts()),
        notSameAccountValidator(() => this.accountService.accounts()),
      ],
    },
  );

  isInvalid(controlName: string): boolean {
    const control = this.transferForm.get(controlName);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  isSubmit = signal(false);
  submitMessage = signal<{ type: 'success' | 'error'; text: string } | null>(null);

  onSubmit() {
    this.submitMessage.set(null);

    if (this.transferForm.invalid) {
      this.transferForm.markAllAsTouched();
      this.submitMessage.set({ type: 'error', text: 'Form belum valid, cek kembali isiannya' });
      return;
    }

    const { fromAccountId, toAccountNumber, amount } = this.transferForm.getRawValue();
    const toAccount = this.accountService
      .accounts()
      .find((e) => e.accountNumber === toAccountNumber);

    if (!toAccount) {
      this.submitMessage.set({ type: 'error', text: `Akun ${toAccountNumber} tidak ditemukan` });
      return;
    }

    this.isSubmit.set(true);

    setTimeout(() => {
      const result = this.accountService.transfer(fromAccountId, toAccountNumber, amount);
      this.isSubmit.set(false);

      if (!result.success) {
        this.submitMessage.set({ type: 'error', text: result.message });
      } else {
        this.submitMessage.set({
          type: 'success',
          text: `Transfer Rp ${amount.toLocaleString('id-ID')} ke ${toAccountNumber} berhasil!`,
        });
        this.transferForm.reset({ fromAccountId: '', toAccountNumber: '', amount: 0, note: '' });
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 200);
      }
    }, 800);
  }

  getAllErrors() {
    const errors: any = {};
    Object.keys(this.transferForm.controls).map((key) => {
      const control = this.transferForm.get(key);
      if (control && control.errors) {
        errors[key] = control.errors;
      }
    });

    return errors;
  }
}
