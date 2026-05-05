import { AppError } from '../errors/AppError';

export const formatMoneyInput = (amount: number) => {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new AppError('Amount must be a positive number', 400);
  }

  return amount.toFixed(2);
};
