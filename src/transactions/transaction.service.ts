import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { TransactionRepository } from './transaction.repository';
import { AccountRepository } from 'src/accounts/account.repository';

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly accountRepository: AccountRepository,
  ) {}

  async create(transactionDto: CreateTransactionDto) {
    const { fromAccount, toAccount, amount } = transactionDto;

    if (amount <= 0) {
      throw new BadRequestException(
        'O valor deve ser positivo para transferências',
      );
    }

    const fromAccountData = await this.accountRepository.findById(fromAccount);
    if (!fromAccountData) {
      throw new BadRequestException('Conta remetente não encontrada');
    }

    if (toAccount) {
      const toAccountData = await this.accountRepository.findById(toAccount);
      if (!toAccountData) {
        throw new BadRequestException('Conta destinatária não encontrada');
      }

      if (fromAccountData.userId !== transactionDto.userId) {
        throw new BadRequestException(
          'Você não pode retirar valores de contas que não lhe pertencem',
        );
      }

      if (fromAccountData.balance < amount) {
        throw new BadRequestException('Saldo insuficiente para transferência');
      }

      await this.accountRepository.withdraw(fromAccount, amount);

      await this.accountRepository.addBalance(toAccount, amount);

      await this.transactionRepository.create({
        fromAccount,
        toAccount,
        amount,
        userId: fromAccountData.userId,
        type: 'transferSent',
      });

      await this.transactionRepository.create({
        fromAccount: fromAccount,
        toAccount: toAccount,
        amount,
        userId: toAccountData.userId,
        type: 'transferReceived',
      });

      return {
        message: 'Transferência realizada com sucesso',
      };
    } else {
      throw new BadRequestException(
        'Conta destinatária é necessária para transferências',
      );
    }
  }

  async findAllByUserId(userId: string) {
    const transactions =
      await this.transactionRepository.findAllByUserId(userId);
    return transactions.map((transaction) => ({
      amount: transaction.amount,
      fromAccountName: transaction.fromAccount,
      toAccountName: transaction.toAccount,
      type: transaction.type,
      createdAt: transaction.createdAt,
    }));
  }
}
