import { computed, Injectable, signal } from '@angular/core';
import { Transaction } from '../models/account.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private transactionState = signal<Transaction[]>([]);
  readonly transactions = this.transactionState.asReadonly();

  transactionTotal = computed(() => this.transactionState().length);

  readonly recentTransaction = computed(() => {
    return [...this.transactionState()]
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
      .slice(0, 5);
  });

  addLog(transaction: Omit<Transaction, 'id' | 'timestamp'>): Transaction {
    const newTx: Transaction = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      accountId: transaction.accountId,
      amount: transaction.amount,
      transactionType: transaction.transactionType,
      description: transaction.description,
    };

    this.transactionState.update((data) => [...data, newTx]);
    return newTx;
  }

  getByAccountId(accountId: string): Transaction[] {
    return this.transactionState().filter((data) => data.accountId === accountId);
  }

  clear(): void {
    this.transactionState.set([]);
  }
}
