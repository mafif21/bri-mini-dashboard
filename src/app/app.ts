import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountCard } from './components/account-card/account-card';
import { Account } from './models/account.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, AccountCard, CommonModule],
  template: `
    <div class="page">
      <h1>Hello, {{ name }}! 👋</h1>
      <p>Akun BRI kamu hari ini:</p>

      @for (account of accounts; track account.id) {
        <app-account-card [account]="account"></app-account-card>
      }

      <!-- @if (accounts.length === 0) {
        <div class="empty">Belum ada akun.</div>
      } -->
      <p class="empty" *ngIf="accounts.length === 0">Belum ada akun.</p>
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
      h1 {
        color: #1976d2;
      }
    `,
  ],
})
export class App {
  name = 'Muhammad Afif';
  dayNumber = signal(1);

  addDay() {
    this.dayNumber.set(this.dayNumber() + 1);
  }

  resetDay() {
    this.dayNumber.set(1);
  }

  accounts: Account[] = [
    // {
    //   id: '1',
    //   accountNumber: '1223-4452-5432-4532',
    //   balance: 100000,
    //   ownerName: 'Apip',
    //   currency: 'SGD',
    //   accountType: 'savings',
    // },
    // {
    //   id: '2',
    //   accountNumber: '1223-4452-5432-7764',
    //   balance: 90000000,
    //   ownerName: 'Apip',
    //   currency: 'IDR',
    //   accountType: 'checking',
    // },
    // {
    //   id: '3',
    //   accountNumber: '1223-9982-5432-4532',
    //   balance: 100000,
    //   ownerName: 'Apip',
    //   currency: 'SGD',
    //   accountType: 'savings',
    // },
  ];
}
