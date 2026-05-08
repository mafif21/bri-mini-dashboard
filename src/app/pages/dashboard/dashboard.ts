import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AccountCard } from '../../components/account-card/account-card';
import { BalanceSummary } from '../../components/balance-summary/balance-summary';
import { TransactionList } from '../../components/transaction-list/transaction-list';
import { Account } from '../../models/account.model';
import { AccountService } from '../../services/account_service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, AccountCard, CommonModule, BalanceSummary, TransactionList, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  // service
  accountService = inject(AccountService);
  router = inject(Router);

  // ui only state data
  name = signal('Muhammad Afif');
  selectedId = signal<string | null>(null);
  transferStatus = signal(false);
  transferMessage = signal('');

  // navigate to detail
  goToDetail(account: Account) {
    this.router.navigate(['/accounts', account.id]);
  }

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
