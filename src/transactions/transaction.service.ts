import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { TransactionRepository } from './transaction.repository';
import { AccountRepository } from '../accounts/account.repository';
import { TransactionFilterDto } from './dtos/filter-transactions.dto';

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

    if (!toAccount) {
      throw new BadRequestException(
        'Conta destinatária é necessária para transferências',
      );
    }

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

    try {
      await this.accountRepository.withdraw(fromAccount, amount);
      await this.accountRepository.addBalance(toAccount, amount);

      const transferSent = await this.transactionRepository.create({
        fromAccount,
        toAccount,
        amount,
        userId: fromAccountData.userId,
        type: 'transferSent',
      });

      await this.transactionRepository.create({
        fromAccount,
        toAccount,
        amount,
        userId: toAccountData.userId,
        type: 'transferReceived',
      });

      return transferSent;
    } catch (error: unknown) {
      throw new BadRequestException('Erro ao processar a transferência.');
    }
  }

  async findAllByUserIdWithFilters(
    userId: string,
    filters: TransactionFilterDto,
  ) {
    try {
      return await this.transactionRepository.findAllByUserIdWithFilters(
        userId,
        filters,
      );
    } catch (error: unknown) {
      throw new BadRequestException('Erro ao buscar as transações.');
    }
  }
}
