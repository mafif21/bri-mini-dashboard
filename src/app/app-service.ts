import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private readonly title = signal(1);

  getTitle() {
    return this.title();
  }

  changeTitle() {
    this.title.set(this.title() + 1);
  }
}
