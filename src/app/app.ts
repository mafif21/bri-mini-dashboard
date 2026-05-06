import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountCard } from './components/account-card/account-card';
import { BalanceSummary } from './components/balance-summary/balance-summary';
import { TransactionList } from './components/transaction-list/transaction-list';
import { Account } from './models/account.model';
import { AccountService } from './services/account_service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, AccountCard, CommonModule, BalanceSummary, TransactionList],
  template: `
    <div class="page">
      <header>
        <h1>Halo, {{ name() }}! 👋</h1>
        <p class="subtitle">
          Total saldo:
          <strong>Rp.{{ accountService.totalBalance() | number: '1.0-0' }}</strong>
        </p>
        <p class="account-count">Kamu punya: {{ accountService.accountTotal() }} akun aktif</p>
      </header>

      <app-balance-summary [totalBalance]="accountService.totalBalance()"></app-balance-summary>

      @if (selectedAccount()) {
        <div class="selected-info">
          📌 Dipilih: <strong>{{ selectedAccount()!.accountNumber }}</strong> (Saldo:
          {{ selectedAccount()!.balance | number: '1.0-0' }} {{ selectedAccount()!.currency }})
        </div>
      }

      @for (account of accountService.accounts(); track account.id) {
        <app-account-card
          [account]="account"
          [isSelected]="account.id === selectedId()"
          (cardClicked)="selectedCard($event)"
          (cardDeleted)="onCardDelete($event)"
        ></app-account-card>
      } @empty {
        <p class="empty">Belum ada akun.</p>
      }

      <div class="actions">
        <button (click)="addRandomAccount()">+ Tambah akun</button>
        <button (click)="resetData()" class="secondary">Hapus semua</button>
      </div>

      @if (accountService.accountTotal() > 1) {
        <div class="transfer-demo">
          <h3>🧪 Test transfer</h3>
          <button (click)="testTransfer()">Transfer Rp100,000 dari akun 1 ke akun 2</button>
          @if (transferMessage()) {
            <p [class.success]="transferStatus()" [class.error]="!transferStatus()">
              {{ transferMessage() }}
            </p>
          }
        </div>
      }

      <app-transaction-list></app-transaction-list>
    </div>
  `,
  styles: [
    `
      .page {
        padding: 2rem;
        font-family: 'Fira Code', monospace;
        max-width: 600px;
        margin: 2rem auto;
      }
      header {
        margin-bottom: 1rem;
      }
      h1 {
        color: #1976d2;
        margin: 0 0 0.5rem;
      }
      .account-count {
        color: #888;
        font-size: 0.9rem;
      }
      .selected-info {
        padding: 1rem;
        background: #fff8e1;
        border-left: 4px solid #ffd700;
        border-radius: 4px;
        margin-bottom: 1rem;
      }
      .empty {
        padding: 2rem;
        text-align: center;
        background: #f5f5f5;
        border-radius: 8px;
      }
      .actions {
        margin-top: 2rem;
        display: flex;
        gap: 0.5rem;
      }
      .transfer-demo {
        margin-top: 2rem;
        padding: 1rem;
        background: #f0f4f8;
        border-radius: 8px;
      }
      .transfer-demo h3 {
        margin-top: 0;
        color: #455a64;
      }
      .success {
        color: #2e7d32;
        font-weight: bold;
      }
      .error {
        color: #c62828;
        font-weight: bold;
      }
      button {
        padding: 0.6rem 1.2rem;
        cursor: pointer;
        border: none;
        background: #1976d2;
        color: white;
        border-radius: 6px;
        font-family: inherit;
      }
      button.secondary {
        background: #757575;
      }
      button:hover {
        opacity: 0.9;
      }
    `,
  ],
})
export class App {
  // service
  accountService = inject(AccountService);

  // ui only state data
  name = signal('Muhammad Afif');
  selectedId = signal<string | null>(null);
  transferStatus = signal(false);
  transferMessage = signal('');

  addRandomAccount() {
    this.accountService.add({
      accountNumber: `${Math.floor(Math.random() * 9000 + 1000)}-XXXX-XXXX`,
      balance: Math.floor(Math.random() * 100000),
      ownerName: this.name(),
      currency: 'IDR',
      accountType: Math.random() > 0.5 ? 'checking' : 'savings',
    });
  }

  onCardClicked(account: Account) {
    this.selectedId.update((current) => (current === account.id ? null : account.id));
  }

  onCardDelete(id: string) {
    this.accountService.remove(id);
    if (this.selectedId() == id) this.selectedId.set(null);
  }

  resetData() {
    this.accountService.clear();
    this.selectedId.set(null);
  }

  selectedAccount() {
    const id = this.selectedId();
    if (!id) return null;
    return this.accountService.findById(id);
  }

  selectedCard(account: Account) {
    this.selectedId.update((current) => (current === account.id ? null : account.id));
    console.log('Card clicked:', account);
  }

  testTransfer() {
    const accounts = this.accountService.accounts();
    if (accounts.length < 2) return;

    const result = this.accountService.transfer(accounts[0].id, accounts[1].id, 100000);
    this.transferMessage.set(result.message);
    this.transferStatus.set(result.success);

    setTimeout(() => {
      this.transferMessage.set('');
    }, 3000);
  }
}
