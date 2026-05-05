import { AppError } from '../errors/AppError';

const MONEY_SCALE = 10_000n;

export const formatMoneyInput = (amount: number) => {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new AppError('Amount must be a positive number', 400);
  }

  return amount.toFixed(4);
};

const toMinorUnits = (value: string) => {
  const trimmed = value.trim();
  const negative = trimmed.startsWith('-');
  const sanitized = negative ? trimmed.slice(1) : trimmed;
  const [whole, fraction = ''] = sanitized.split('.');
  const paddedFraction = `${fraction}0000`.slice(0, 4);
  const normalizedWhole = whole === '' ? '0' : whole;
  const units = BigInt(normalizedWhole) * MONEY_SCALE + BigInt(paddedFraction);

  return negative ? units * -1n : units;
};

const fromMinorUnits = (value: bigint) => {
  const negative = value < 0n;
  const absolute = negative ? value * -1n : value;
  const whole = absolute / MONEY_SCALE;
  const fraction = (absolute % MONEY_SCALE).toString().padStart(4, '0');

  return `${negative ? '-' : ''}${whole.toString()}.${fraction}`;
};

export const addMoney = (left: string, right: string) => {
  return fromMinorUnits(toMinorUnits(left) + toMinorUnits(right));
};

export const subtractMoney = (left: string, right: string) => {
  return fromMinorUnits(toMinorUnits(left) - toMinorUnits(right));
};

export const isMoneyLessThan = (left: string, right: string) => {
  return toMinorUnits(left) < toMinorUnits(right);
};
