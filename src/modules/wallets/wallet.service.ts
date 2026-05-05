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
import {
  recordWalletTransaction,
  requireWalletByUserId,
  requireWalletByUserIdForUpdate,
  updateWalletBalanceOrThrow,
} from './wallet.helpers';
import { toWalletResponse } from './wallet.mapper';
import { generateReference } from '../../shared/utils/reference';
import type {
  FundWalletInput,
  TransferFundsInput,
  WithdrawFundsInput,
} from './wallet.types';

class WalletService {
  async getAuthenticatedWallet(userId: string) {
    const wallet = await requireWalletByUserId(userId);

    return {
      wallet: toWalletResponse(wallet),
    };
  }

  async fundWallet(userId: string, payload: FundWalletInput) {
    const amount = formatMoneyInput(payload.amount);

    return getDb().transaction(async (trx) => {
      const wallet = await requireWalletByUserIdForUpdate(userId, trx);

      const balanceBefore = wallet.balance;
      const balanceAfter = addMoney(balanceBefore, amount);
      const reference = generateReference('fund');
      const updatedWallet = await updateWalletBalanceOrThrow(String(wallet.id), balanceAfter, trx);
      const transaction = await recordWalletTransaction(
        {
          reference,
          walletId: wallet.id,
          transactionType: 'FUNDING',
          amount,
          balanceBefore,
          balanceAfter,
          narration: 'Wallet funding',
          metadata: { action: 'fund' },
        },
        trx,
      );

      return {
        message: 'Wallet funded successfully',
        reference,
        wallet: toWalletResponse(updatedWallet),
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

      const senderWallet = await requireWalletByUserIdForUpdate(String(sender.id), trx);
      const recipientWallet = await requireWalletByUserIdForUpdate(String(recipient.id), trx);

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

      const updatedSenderWallet = await updateWalletBalanceOrThrow(
        String(senderWallet.id),
        senderBalanceAfter,
        trx,
      );
      const updatedRecipientWallet = await updateWalletBalanceOrThrow(
        String(recipientWallet.id),
        recipientBalanceAfter,
        trx,
      );

      await recordWalletTransaction(
        {
          reference: debitReference,
          walletId: senderWallet.id,
          sourceWalletId: senderWallet.id,
          destinationWalletId: recipientWallet.id,
          transactionType: 'TRANSFER_DEBIT',
          amount,
          balanceBefore: senderBalanceBefore,
          balanceAfter: senderBalanceAfter,
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

      await recordWalletTransaction(
        {
          reference: creditReference,
          walletId: recipientWallet.id,
          sourceWalletId: senderWallet.id,
          destinationWalletId: recipientWallet.id,
          transactionType: 'TRANSFER_CREDIT',
          amount,
          balanceBefore: recipientBalanceBefore,
          balanceAfter: recipientBalanceAfter,
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
        senderWallet: toWalletResponse(updatedSenderWallet),
        recipientWallet: toWalletResponse(updatedRecipientWallet),
      };
    });
  }

  async withdrawFunds(userId: string, payload: WithdrawFundsInput) {
    const amount = formatMoneyInput(payload.amount);

    return getDb().transaction(async (trx) => {
      const wallet = await requireWalletByUserIdForUpdate(userId, trx);

      if (isMoneyLessThan(wallet.balance, amount)) {
        throw new AppError('Insufficient wallet balance', 400);
      }

      const balanceBefore = wallet.balance;
      const balanceAfter = subtractMoney(balanceBefore, amount);
      const reference = generateReference('wdr');
      const updatedWallet = await updateWalletBalanceOrThrow(String(wallet.id), balanceAfter, trx);
      const transaction = await recordWalletTransaction(
        {
          reference,
          walletId: wallet.id,
          transactionType: 'WITHDRAWAL',
          amount,
          balanceBefore,
          balanceAfter,
          narration: 'Wallet withdrawal',
          metadata: { action: 'withdraw' },
        },
        trx,
      );

      return {
        message: 'Withdrawal completed successfully',
        reference,
        wallet: toWalletResponse(updatedWallet),
        transaction: toTransactionResponse(transaction),
      };
    });
  }
}

export const walletService = new WalletService();
