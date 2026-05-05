import { Component, computed, effect, signal } from '@angular/core';

@Component({
  selector: 'app-counter-demo',
  imports: [],
  standalone: true,
  template: `
    <div class="demo">
      <p>Count: {{ count() }}</p>
      <p>Double: {{ doubled() }}</p>
      <p>Status: {{ status() }}</p>
      <button (click)="increment()">+1</button>
      <button (click)="reset()">Reset</button>
    </div>
  `,
})
export class CounterDemo {
  constructor() {
    effect(() => {
      console.log(`Count berubah jadi: ${this.count()}`);
    });
  }

  count = signal(0);
  doubled = computed(() => this.count() * 2);

  status = computed(() => {
    const c = this.count();
    if (c === 0) return 'mulai';
    if (c < 5) return 'masih awal';
    if (c < 10) return 'lumayan';
    return 'mantap';
  });

  increment() {
    this.count.update((v) => v + 1);
  }

  reset() {
    this.count.set(0);
  }
}
