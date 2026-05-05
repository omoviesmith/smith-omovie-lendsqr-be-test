import { getDb } from '../../config/database';
import { userRepository } from '../users/user.repository';
import { AppError } from '../../shared/errors/AppError';
import {
  addMoney,
  formatMoneyInput,
  isMoneyLessThan,
  subtractMoney,
} from '../../shared/utils/money';
import { transactionRepository } from '../transactions/transaction.repository';
import { toTransactionResponse } from '../transactions/transaction.mapper';
import { walletRepository } from './wallet.repository';
import { generateReference } from '../../shared/utils/reference';
import type {
  FundWalletInput,
  TransferFundsInput,
  WithdrawFundsInput,
} from './wallet.types';

class WalletService {
  async getAuthenticatedWallet(userId: string) {
    const wallet = await walletRepository.getWalletByUserId(userId);

    if (!wallet) {
      throw new AppError('Wallet not found', 404);
    }

    return {
      wallet: {
        id: wallet.id,
        userId: wallet.user_id,
        balance: wallet.balance,
        currency: wallet.currency,
      },
    };
  }

  async fundWallet(userId: string, payload: FundWalletInput) {
    const amount = formatMoneyInput(payload.amount);

    return getDb().transaction(async (trx) => {
      const wallet = await walletRepository.getWalletByUserIdForUpdate(userId, trx);

      if (!wallet) {
        throw new AppError('Wallet not found', 404);
      }

      const balanceBefore = wallet.balance;
      const balanceAfter = addMoney(balanceBefore, amount);
      const reference = generateReference('fund');

      const updatedWallet = await walletRepository.updateBalance(String(wallet.id), balanceAfter, trx);

      if (!updatedWallet) {
        throw new AppError('Unable to update wallet balance', 500);
      }

      const transaction = await transactionRepository.create(
        {
          reference,
          wallet_id: wallet.id,
          type: 'FUNDING',
          amount,
          balance_before: balanceBefore,
          balance_after: balanceAfter,
          status: 'SUCCESSFUL',
          narration: 'Wallet funding',
          metadata: { action: 'fund' },
        },
        trx,
      );

      if (!transaction) {
        throw new AppError('Unable to create transaction record', 500);
      }

      return {
        message: 'Wallet funded successfully',
        reference,
        wallet: {
          id: updatedWallet.id,
          balance: updatedWallet.balance,
          currency: updatedWallet.currency,
        },
        transaction: toTransactionResponse(transaction),
      };
    });
  }

  async transferFunds(userId: string, payload: TransferFundsInput) {
    const amount = formatMoneyInput(payload.amount);
    const recipientEmail = payload.recipientEmail.trim().toLowerCase();

    return getDb().transaction(async (trx) => {
      const sender = await userRepository.findById(userId, trx);

      if (!sender) {
        throw new AppError('Authenticated user not found', 404);
      }

      if (sender.email === recipientEmail) {
        throw new AppError('You cannot transfer funds to yourself', 400);
      }

      const recipient = await userRepository.findByEmail(recipientEmail, trx);

      if (!recipient) {
        throw new AppError('Recipient not found', 404);
      }

      const senderWallet = await walletRepository.getWalletByUserIdForUpdate(String(sender.id), trx);
      const recipientWallet = await walletRepository.getWalletByUserIdForUpdate(String(recipient.id), trx);

      if (!senderWallet || !recipientWallet) {
        throw new AppError('Wallet not found', 404);
      }

      if (isMoneyLessThan(senderWallet.balance, amount)) {
        throw new AppError('Insufficient wallet balance', 400);
      }

      const senderBalanceBefore = senderWallet.balance;
      const senderBalanceAfter = subtractMoney(senderBalanceBefore, amount);
      const recipientBalanceBefore = recipientWallet.balance;
      const recipientBalanceAfter = addMoney(recipientBalanceBefore, amount);
      const reference = generateReference('trf');
      const debitReference = `${reference}_DR`;
      const creditReference = `${reference}_CR`;
      const narration = payload.narration?.trim() || 'Wallet transfer';

      const updatedSenderWallet = await walletRepository.updateBalance(
        String(senderWallet.id),
        senderBalanceAfter,
        trx,
      );
      const updatedRecipientWallet = await walletRepository.updateBalance(
        String(recipientWallet.id),
        recipientBalanceAfter,
        trx,
      );

      if (!updatedSenderWallet || !updatedRecipientWallet) {
        throw new AppError('Unable to update wallet balances', 500);
      }

      await transactionRepository.create(
        {
          reference: debitReference,
          wallet_id: senderWallet.id,
          source_wallet_id: senderWallet.id,
          destination_wallet_id: recipientWallet.id,
          type: 'TRANSFER_DEBIT',
          amount,
          balance_before: senderBalanceBefore,
          balance_after: senderBalanceAfter,
          status: 'SUCCESSFUL',
          narration,
          metadata: {
            action: 'transfer',
            direction: 'debit',
            recipientEmail,
            transferReference: reference,
          },
        },
        trx,
      );

      await transactionRepository.create(
        {
          reference: creditReference,
          wallet_id: recipientWallet.id,
          source_wallet_id: senderWallet.id,
          destination_wallet_id: recipientWallet.id,
          type: 'TRANSFER_CREDIT',
          amount,
          balance_before: recipientBalanceBefore,
          balance_after: recipientBalanceAfter,
          status: 'SUCCESSFUL',
          narration,
          metadata: {
            action: 'transfer',
            direction: 'credit',
            senderEmail: sender.email,
            transferReference: reference,
          },
        },
        trx,
      );

      return {
        message: 'Transfer completed successfully',
        reference,
        senderWallet: {
          id: updatedSenderWallet.id,
          balance: updatedSenderWallet.balance,
          currency: updatedSenderWallet.currency,
        },
      };
    });
  }

  async withdrawFunds(userId: string, payload: WithdrawFundsInput) {
    const amount = formatMoneyInput(payload.amount);

    return getDb().transaction(async (trx) => {
      const wallet = await walletRepository.getWalletByUserIdForUpdate(userId, trx);

      if (!wallet) {
        throw new AppError('Wallet not found', 404);
      }

      if (isMoneyLessThan(wallet.balance, amount)) {
        throw new AppError('Insufficient wallet balance', 400);
      }

      const balanceBefore = wallet.balance;
      const balanceAfter = subtractMoney(balanceBefore, amount);
      const reference = generateReference('wdr');

      const updatedWallet = await walletRepository.updateBalance(String(wallet.id), balanceAfter, trx);

      if (!updatedWallet) {
        throw new AppError('Unable to update wallet balance', 500);
      }

      const transaction = await transactionRepository.create(
        {
          reference,
          wallet_id: wallet.id,
          type: 'WITHDRAWAL',
          amount,
          balance_before: balanceBefore,
          balance_after: balanceAfter,
          status: 'SUCCESSFUL',
          narration: 'Wallet withdrawal',
          metadata: { action: 'withdraw' },
        },
        trx,
      );

      if (!transaction) {
        throw new AppError('Unable to create transaction record', 500);
      }

      return {
        message: 'Withdrawal completed successfully',
        reference,
        wallet: {
          id: updatedWallet.id,
          balance: updatedWallet.balance,
          currency: updatedWallet.currency,
        },
        transaction: toTransactionResponse(transaction),
      };
    });
  }
}

export const walletService = new WalletService();
