import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AccountService } from '../../services/account_service';
import { TransactionService } from '../../services/transaction-service';

@Component({
  selector: 'app-account-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './account-detail.html',
  styleUrl: './account-detail.scss',
})
export class AccountDetail implements OnInit {
  router = inject(ActivatedRoute);
  accountService = inject(AccountService);
  txService = inject(TransactionService);

  accountId = signal('');

  // business logic
  account = computed(() => this.accountService.findById(this.accountId()));
  accountTx = computed(() => this.txService.getByAccountId(this.accountId()));

  ngOnInit(): void {
    this.router.params.subscribe((params) => this.accountId.set(params['id']));
  }
}
