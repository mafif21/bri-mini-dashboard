import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Account } from '../../models/account.model';

@Component({
  selector: 'app-account-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account-card.html',
  styleUrl: './account-card.scss',
})
export class AccountCard {
  @Input({ required: true }) account!: Account;
}
