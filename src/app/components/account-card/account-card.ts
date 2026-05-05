import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Account } from './../../models/account.model';

@Component({
  selector: 'app-account-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account-card.html',
  styleUrl: './account-card.scss',
})
export class AccountCard {
  // @Input({ required: true }) account!: Account;
  account = input.required<Account>();
  isSelected = input<boolean>(false);

  cardClicked = output<Account>();
  cardDeleted = output<string>();

  onCardClick() {
    this.cardClicked.emit(this.account());
  }

  onDelete(event: Event) {
    event.stopPropagation();
    this.cardDeleted.emit(this.account().id);
  }
}
