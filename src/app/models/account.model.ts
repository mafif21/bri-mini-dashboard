export type Currency = 'IDR' | 'USD' | 'SGD';
export type AccountType = 'savings' | 'checking';
export type TransactionType = 'debit' | 'credit';

export interface Account {
  id: string;
  accountNumber: string;
  balance: number;
  ownerName: string;
  currency: Currency;
  accountType: AccountType;
}

export interface Transaction {
  id: string;
  accountId: string;
  amount: number;
  transactionType: TransactionType;
  description: string;
  timestamp: Date;
}
