import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AccountService } from '../../services/account_service';

interface BulkRecipient {
  toAccountNumber: string;
  amount: number;
}

@Component({
  selector: 'app-bulk-transfer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './bulk-transfer.html',
  styleUrl: './bulk-transfer.scss',
})
export class BulkTransfer implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  protected accountService = inject(AccountService);

  bulkTransferForm = this.fb.nonNullable.group({
    fromAccountId: ['', Validators.required],
    recipients: this.fb.nonNullable.array([this.createRecipient()]),
  });

  createRecipient(): FormGroup {
    return this.fb.nonNullable.group({
      toAccountNumber: ['', [Validators.required]],
      amount: [0, [Validators.required, Validators.min(10000)]],
    });
  }

  get recipients(): FormArray {
    return this.bulkTransferForm.get('recipients') as FormArray;
  }

  totalAmount = signal(0);

  ngOnInit(): void {
    this.recipients.valueChanges.subscribe((values: any[]) => {
      const dynamicTotal = values.reduce((sum, curr) => sum + (+curr.amount || 0), 0);
      this.totalAmount.set(dynamicTotal);
    });
  }

  addRecipient() {
    this.recipients.push(this.createRecipient());
  }

  removeRecipients(index: number) {
    if (this.recipients.length > 1) {
      this.recipients.removeAt(index);
    }
  }

  isSubmit = signal(false);
  submitMessage = signal<{ type: 'success' | 'error'; text: string } | null>(null);

  onSubmit() {
    this.submitMessage.set(null);

    if (this.bulkTransferForm.invalid) {
      this.bulkTransferForm.markAllAsTouched();
      this.submitMessage.set({ type: 'error', text: 'Form belum valid, cek kembali' });
      return;
    }

    this.isSubmit.set(true);
    const { fromAccountId, recipients } = this.bulkTransferForm.getRawValue();

    setTimeout(() => {
      const result: { recipient: string; success: boolean; message: string }[] = [];
      for (const v of recipients as BulkRecipient[]) {
        const toAccount = this.accountService
          .accounts()
          .find((a) => a.accountNumber === v.toAccountNumber);

        if (!toAccount) {
          result.push({
            recipient: v.toAccountNumber,
            success: false,
            message: `Akun ${v.toAccountNumber} tidak ditemukan`,
          });
          continue;
        }

        const transferResult = this.accountService.transfer(
          fromAccountId,
          v.toAccountNumber,
          v.amount,
        );

        result.push({
          recipient: v.toAccountNumber,
          success: transferResult.success,
          message: transferResult.message,
        });

        const allSuccess = result.every((r) => r.success);
        if (allSuccess) {
          this.submitMessage.set({
            type: 'success',
            text: `Berhasil transfer ke ${result.length} penerima!`,
          });
          this.bulkTransferForm.reset();
          setTimeout(() => this.router.navigate(['/dashboard']), 1500);
        } else {
          const failed = result.filter((r) => !r.success);
          this.submitMessage.set({
            type: 'error',
            text: `${failed.length} transfer gagal: ${failed.map((f) => f.message).join(', ')}`,
          });
        }
      }
    }, 300);
  }
}
