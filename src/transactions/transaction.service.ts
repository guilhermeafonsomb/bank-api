import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { FilterTransactionsDto } from './dtos/filter-transactions.dto';
import { TransactionRepository } from './transaction.repository';
import { AccountRepository } from 'src/accounts/account.repository';

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly accountRepository: AccountRepository,
  ) {}

  async create(transactionDto: CreateTransactionDto) {
    const fromAccount = await this.accountRepository.findById(
      transactionDto.fromAccount,
    );
    const toAccount = await this.accountRepository.findById(
      transactionDto.toAccount,
    );

    if (!fromAccount || !toAccount) {
      throw new BadRequestException(
        'Conta remetente ou destinatária não encontrada',
      );
    }

    if (fromAccount.balance < transactionDto.amount) {
      throw new BadRequestException('Saldo insuficiente para a transação');
    }

    await this.accountRepository.withdraw(
      transactionDto.fromAccount,
      transactionDto.amount,
    );
    await this.accountRepository.addBalance(
      transactionDto.toAccount,
      transactionDto.amount,
    );

    return this.transactionRepository.create(transactionDto);
  }

  async findAll(filterDto: FilterTransactionsDto) {
    return this.transactionRepository.findAll(filterDto);
  }
}
