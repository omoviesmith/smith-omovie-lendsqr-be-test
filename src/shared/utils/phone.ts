import { AppError } from '../errors/AppError';

export const normalizePhoneNumber = (phone: string) => {
  const trimmedPhone = phone.trim();
  const digits = trimmedPhone.replace(/\D/g, '');

  if (digits.startsWith('234') && digits.length === 13) {
    return `+${digits}`;
  }

  if (digits.startsWith('0') && digits.length === 11) {
    return `+234${digits.slice(1)}`;
  }

  if (digits.length >= 10 && digits.length <= 15) {
    if (trimmedPhone.startsWith('+')) {
      return `+${digits}`;
    }

    return `+${digits}`;
  }

  throw new AppError('Phone number format is invalid', 400);
};
