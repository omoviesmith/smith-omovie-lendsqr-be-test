import type { WalletRecord } from './wallet.repository';

export const toWalletResponse = (wallet: WalletRecord) => {
  return {
    id: wallet.id,
    userId: wallet.user_id,
    balance: wallet.balance,
    currency: wallet.currency,
  };
};
