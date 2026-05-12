import { computed, inject, Injectable, signal } from '@angular/core';
import { Account } from './../models/account.model';
import { TransactionService } from './transaction-service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  transactionService = inject(TransactionService);

  private accountState = signal<Account[]>([
    {
      id: '1',
      accountNumber: '1223-4452-5432-4532',
      balance: 100000,
      ownerName: 'Apip',
      currency: 'IDR',
      accountType: 'savings',
    },
    {
      id: '2',
      accountNumber: '1223-4452-5432-7764',
      balance: 90000000,
      ownerName: 'Apip',
      currency: 'IDR',
      accountType: 'checking',
    },
    {
      id: '3',
      accountNumber: '1223-9982-5432-4532',
      balance: 100000,
      ownerName: 'Apip',
      currency: 'IDR',
      accountType: 'savings',
    },
  ]);
  readonly accounts = this.accountState.asReadonly();

  readonly totalBalance = computed(() => {
    return this.accountState()
      .filter((v) => v.currency === 'IDR')
      .reduce((sum, v) => sum + v.balance, 0);
  });

  readonly accountTotal = computed(() => this.accountState().length);
  readonly hasAccounts = computed(() => this.accountState().length > 0);

  add(account: Omit<Account, 'id'>): Account {
    const newAccount: Account = {
      ...account,
      id: crypto.randomUUID(),
    };

    this.accountState.update((current) => [...current, newAccount]);
    return newAccount;
  }

  remove(id: string): boolean {
    const account = this.accountState().some((v) => v.id === id);
    if (!account) return false;

    this.accountState.update((data) => data.filter((v) => v.id !== id));
    return true;
  }

  clear(): void {
    this.accountState.set([]);
  }

  findById(id: string): Account | undefined {
    return this.accountState().find((data) => data.id === id);
  }

  canTransfer(fromId: string, amount: number): boolean {
    const account = this.findById(fromId);
    return !!account && account.balance >= amount && amount > 0;
  }

  transfer(
    fromId: string,
    toAccountNumber: string,
    amount: number,
  ): { success: boolean; message: string } {
    const toAccount = this.accounts().find((e) => e.accountNumber === toAccountNumber);
    if (!toAccount) return { success: false, message: 'Akun tujuan tidak ditemukan' };

    if (fromId === toAccount.id)
      return { success: false, message: 'Tidak bisa transfer ke akun yang sama' };

    if (!this.canTransfer(fromId, amount))
      return { success: false, message: 'Saldo tidak cukup atau jumlah tidak valid' };

    this.accountState.update((datas) => {
      return datas.map((acc) => {
        if (acc.id === fromId) return { ...acc, balance: acc.balance - amount };
        if (acc.id === toAccount.id) return { ...acc, balance: acc.balance + amount };
        return acc;
      });
    });

    this.transactionService.addLog({
      accountId: fromId,
      amount,
      transactionType: 'debit',
      description: `Transfer ke ${toAccount.accountNumber}`,
    });

    this.transactionService.addLog({
      accountId: toAccount.id,
      amount,
      transactionType: 'credit',
      description: `Transfer dari akun ${fromId}`,
    });

    return { success: true, message: 'success' };
  }
}
