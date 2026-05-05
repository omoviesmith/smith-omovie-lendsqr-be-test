export type TransactionType =
  | 'FUNDING'
  | 'WITHDRAWAL'
  | 'TRANSFER_DEBIT'
  | 'TRANSFER_CREDIT';

export type TransactionStatus = 'PENDING' | 'SUCCESSFUL' | 'FAILED';
