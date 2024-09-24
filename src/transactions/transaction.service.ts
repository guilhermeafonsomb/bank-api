import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { FilterTransactionsDto } from './dtos/filter-transactions.dto';
import { TransactionRepository } from './transaction.repository';
import { AccountRepository } from 'src/accounts/account.repository';
import { TransactionResponseDto } from './dtos/transaction-response.dto';

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly accountRepository: AccountRepository,
  ) {}

  async create(transactionDto: CreateTransactionDto) {
    const { fromAccount, toAccount, amount } = transactionDto;

    if (amount <= 0) {
      throw new BadRequestException('O valor deve ser positivo para depósitos');
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
    }

    if (toAccount) {
      if (fromAccountData.balance < amount) {
        throw new BadRequestException('Saldo insuficiente para transferência');
      }
    } else if (fromAccountData.balance < amount) {
      throw new BadRequestException('Saldo insuficiente para saque');
    }

    if (toAccount) {
      await this.accountRepository.addBalance(toAccount, amount);
    }

    if (amount > 0) {
      await this.accountRepository.withdraw(fromAccount, amount);
    }

    let transactionType:
      | 'deposit'
      | 'withdraw'
      | 'transferSent'
      | 'transferReceived';

    if (toAccount) {
      transactionType = 'transferSent';
    } else if (amount < 0) {
      transactionType = 'withdraw';
    } else {
      transactionType = 'deposit';
    }

    return this.transactionRepository.create({
      fromAccount,
      toAccount,
      amount,
      userId: fromAccountData.userId,
      type: transactionType,
    });
  }

  async findAll(filterDto: FilterTransactionsDto) {
    return this.transactionRepository.findAll(filterDto);
  }

  async findAllByUser(
    userId: string,
    filterDto: FilterTransactionsDto,
  ): Promise<TransactionResponseDto[]> {
    const transactions = await this.transactionRepository.findAllByUser(
      userId,
      filterDto,
    );

    return Promise.all(
      transactions.map(async (transaction) => {
        let transactionType:
          | 'deposit'
          | 'withdraw'
          | 'transferSent'
          | 'transferReceived';

        if (transaction.type === 'transferSent') {
          transactionType = 'transferSent';
        } else if (transaction.type === 'transferReceived') {
          transactionType = 'transferReceived';
        } else if (transaction.type === 'withdraw') {
          transactionType = 'withdraw';
        } else {
          transactionType = 'deposit';
        }

        return {
          amount: transaction.amount,
          fromAccountName: await this.getAccountName(transaction.fromAccount),
          toAccountName: transaction.toAccount
            ? await this.getAccountName(transaction.toAccount)
            : undefined,
          type: transactionType,
        };
      }),
    );
  }

  private async getAccountName(accountId: string): Promise<string> {
    const account = await this.accountRepository.findById(accountId);
    return account?.name || 'Conta não encontrada';
  }
}
