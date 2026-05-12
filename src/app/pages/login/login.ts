import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  router = inject(Router);
  route = inject(ActivatedRoute);

  username = signal('');
  password = signal('');
  error = signal('');

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')]),
    password: new FormControl('', [Validators.required]),
  });

  onLogin() {
    if (!this.username() || !this.password()) {
      return this.error.set('Username dan Password wajib diisi');
    }

    localStorage.setItem('mock-token', 'fake-jwt-token');
    localStorage.setItem('mock-user', this.username());

    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    this.router.navigateByUrl(returnUrl);
  }
}
