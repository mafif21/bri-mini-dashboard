import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountCard } from './components/account-card/account-card';
import { BalanceSummary } from './components/balance-summary/balance-summary';
import { Account } from './models/account.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, AccountCard, CommonModule, BalanceSummary],
  template: `
    <div class="page">
      <header>
        <h1>Halo, {{ name() }}! 👋</h1>
        <p class="subtitle">
          Total saldo:
          <strong>Rp.{{ totalBalance() | number: '1.0-0' }}</strong>
        </p>
        <p class="account-count">Kamu punya: {{ totalAccount() }} akun aktif</p>
      </header>

      <app-balance-summary [totalBalance]="totalBalance()"></app-balance-summary>

      @if (selectedAccount()) {
        <div class="selected-info">
          📌 Dipilih: <strong>{{ selectedAccount()!.accountNumber }}</strong> (Saldo:
          {{ selectedAccount()!.balance | number: '1.0-0' }} {{ selectedAccount()!.currency }})
        </div>
      }

      @for (account of accounts(); track account.id) {
        <app-account-card
          [account]="account"
          [isSelected]="account.id === selectedId()"
          (cardClicked)="selectedCard($event)"
          (cardDeleted)="deletedCard($event)"
        ></app-account-card>
      } @empty {
        <p class="empty">Belum ada akun.</p>
      }

      <div class="actions">
        <button (click)="addRandomAccount()">+ Tambah akun</button>
        <button (click)="resetData()" class="secondary">Hapus semua</button>
      </div>
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
        margin-bottom: 2rem;
      }
      h1 {
        color: #1976d2;
        margin: 0 0 0.5rem;
      }
      .subtitle {
        color: #555;
        margin: 0.25rem 0;
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
  name = signal('Muhammad Afif');
  dayNumber = signal(1);
  selectedId = signal<string | null>(null);

  addDay() {
    this.dayNumber.set(this.dayNumber() + 1);
  }

  resetDay() {
    this.dayNumber.set(1);
  }

  accounts = signal<Account[]>([
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

  totalBalance = computed(() =>
    this.accounts()
      .filter((e) => e.currency === 'IDR')
      .reduce((sum, a) => sum + a.balance, 0),
  );

  totalAccount = computed(() => this.accounts().length);

  addRandomAccount() {
    const newAcc: Account = {
      id: crypto.randomUUID(),
      accountNumber: `${Math.floor(Math.random() * 9000 + 1000)}-XXXX-XXXX`,
      balance: Math.floor(Math.random() * 100000),
      ownerName: this.name(),
      currency: 'IDR',
      accountType: Math.random() > 0.5 ? 'checking' : 'savings',
    };

    this.accounts.update((datas) => [...datas, newAcc]);
  }

  resetData() {
    this.accounts.set([]);
    this.selectedId.set(null);
  }

  selectedAccount() {
    const id = this.selectedId();
    if (!id) return null;
    return this.accounts().find((v) => v.id === id) ?? null;
  }

  selectedCard(account: Account) {
    this.selectedId.update((current) => (current === account.id ? null : account.id));
    console.log('Card clicked:', account);
  }

  deletedCard(id: string) {
    this.accounts.update((list) => {
      return list.filter((v) => v.id !== id);
    });
    if (this.selectedId() === id) this.selectedId.set(null);
  }
}
