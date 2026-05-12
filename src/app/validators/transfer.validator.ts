import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Account } from '../models/account.model';

export const insufficientBalanceValidator = (getAccounts: () => Account[]): ValidatorFn => {
  return (group: AbstractControl): ValidationErrors | null => {
    const fromAccountId = group.get('fromAccountId')?.value;
    const amount = +(group.get('amount')?.value || 0);

    if (!fromAccountId || !amount) return null;

    const fromAccount = getAccounts().find((e) => e.id === fromAccountId);
    if (!fromAccount) return null;

    if (amount > fromAccount.balance) {
      const amountControl = group.get('amount');
      const existingErrors = amountControl?.errors || {};
      amountControl?.setErrors({
        ...existingErrors,
        exceedsBalance: { max: fromAccount.balance, actual: amount },
      });

      return { exceedsBalance: true };
    }

    return null;
  };
};

export const notSameAccountValidator = (getAccounts: () => Account[]): ValidatorFn => {
  return (group: AbstractControl): ValidationErrors | null => {
    const fromAccountId = group.get('fromAccountId')?.value;
    const toAccountNumber = group.get('toAccountNumber')?.value;

    if (!fromAccountId || !toAccountNumber) return null;

    const foundAccount = getAccounts().find((e) => e.id === fromAccountId);
    if (foundAccount && foundAccount.accountNumber === toAccountNumber) {
      group.get('toAccountNumber')?.setErrors({ sameAccount: true });
      return { sameAccount: true };
    }

    return null;
  };
};
