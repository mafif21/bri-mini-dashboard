import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule, RouterLinkActive],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {
  router = inject(Router);
  username = signal(localStorage.getItem('mock-user') || 'Guest');

  logout() {
    localStorage.removeItem('mock-token');
    localStorage.removeItem('mock-user');
    this.router.navigate(['/login']);
  }
}
