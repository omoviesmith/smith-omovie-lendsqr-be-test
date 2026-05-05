export class WalletRepository {
  async getWalletByUserId(userId: string) {
    return { userId, balance: '0.00', currency: 'NGN' };
  }
}

export const walletRepository = new WalletRepository();
