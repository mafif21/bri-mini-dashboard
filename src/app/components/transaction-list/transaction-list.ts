import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TransactionService } from '../../services/transaction-service';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tx-list">
      <h3>📜 Transaksi Terakhir ({{ txService.transactionTotal() }})</h3>

      @if (txService.recentTransaction().length === 0) {
        <p class="empty">Belum ada transaksi.</p>
      } @else {
        @for (tx of txService.recentTransaction(); track tx.id) {
          <div
            class="tx-item"
            [class.debit]="tx.transactionType === 'debit'"
            [class.credit]="tx.transactionType === 'credit'"
          >
            <div class="tx-header">
              <span class="badge">{{
                tx.transactionType === 'debit' ? '↓ DEBIT' : '↑ CREDIT'
              }}</span>
              <span class="time">{{ tx.timestamp | date: 'short' }}</span>
            </div>
            <div class="tx-desc">{{ tx.description }}</div>
            <div class="tx-amount">
              {{ tx.transactionType === 'debit' ? '-' : '+' }}{{ tx.amount | number: '1.0-0' }} IDR
            </div>
          </div>
        }
      }
    </div>
  `,
  styles: [
    `
      .tx-list {
        margin-top: 2rem;
        padding: 1rem;
        background: #fafafa;
        border-radius: 8px;
      }
      h3 {
        margin-top: 0;
        color: #455a64;
      }
      .empty {
        color: #999;
        text-align: center;
        padding: 1rem;
      }
      .tx-item {
        padding: 0.75rem;
        margin: 0.5rem 0;
        background: white;
        border-radius: 6px;
        border-left: 3px solid #ccc;
      }
      .tx-item.debit {
        border-left-color: #c62828;
      }
      .tx-item.credit {
        border-left-color: #2e7d32;
      }
      .tx-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.25rem;
      }
      .badge {
        font-size: 0.75rem;
        font-weight: bold;
        padding: 0.15rem 0.4rem;
        border-radius: 3px;
        background: #eee;
      }
      .time {
        font-size: 0.75rem;
        color: #888;
      }
      .tx-desc {
        font-size: 0.9rem;
        color: #555;
      }
      .tx-amount {
        font-weight: bold;
        margin-top: 0.25rem;
        font-family: 'Fira Code', monospace;
      }
      .debit .tx-amount {
        color: #c62828;
      }
      .credit .tx-amount {
        color: #2e7d32;
      }
    `,
  ],
})
export class TransactionList {
  protected txService = inject(TransactionService);
}
