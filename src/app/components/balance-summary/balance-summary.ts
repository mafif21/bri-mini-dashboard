import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, effect, input, signal } from '@angular/core';

@Component({
  selector: 'app-balance-summary',
  imports: [DecimalPipe, DatePipe],
  standalone: true,
  template: `
    <div class="summary">
      <div class="label">Total Saldo (IDR)</div>
      <div class="amount">{{ showBalance() | number: '1.0-0' }}</div>
      <div class="meta">Last updated: {{ lastUpdated() | date: 'short' }}</div>
    </div>
  `,
  styles: [
    `
      .summary {
        padding: 2rem;
        background: linear-gradient(135deg, #283593, #5e35b1);
        color: white;
        border-radius: 12px;
        margin: 1rem 0;
        text-align: center;
        font-family: 'Fira Code', monospace;
      }
      .label {
        font-size: 0.9rem;
        opacity: 0.8;
      }
      .amount {
        font-size: 2.5rem;
        font-weight: bold;
        margin: 0.5rem 0;
        transition: color 0.3s;
      }
      .meta {
        font-size: 0.75rem;
        opacity: 0.6;
      }
    `,
  ],
})
export class BalanceSummary {
  totalBalance = input.required<number>();

  showBalance = signal(0);
  lastUpdated = signal(new Date());

  private animationFrame: number | null = null;

  constructor() {
    effect(() => {
      const target = this.totalBalance();
      this.animateTo(target);
      this.lastUpdated.set(new Date());
    });
  }

  ngOnInit() {
    console.log('💰 BalanceSummary mounted, initial balance:', this.totalBalance());
  }

  ngOnDestroy() {
    console.log('💰 BalanceSummary destroyed, cleaning up animation');
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  private animateTo(target: number) {
    const start = this.showBalance();
    const duration = 600;
    const startTime = performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      const current = start + (target - start) * eased;
      this.showBalance.set(Math.round(current));

      if (progress < 1) {
        this.animationFrame = requestAnimationFrame(step);
      }
    };

    if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
    this.animationFrame = requestAnimationFrame(step);
  }
}
