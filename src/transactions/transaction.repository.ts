import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { FilterTransactionsDto } from './dtos/filter-transactions.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(transactionDto: CreateTransactionDto) {
    return this.prisma.transaction.create({
      data: {
        fromAccount: transactionDto.fromAccount,
        toAccount: transactionDto.toAccount,
        amount: transactionDto.amount,
      },
    });
  }

  async findAll(filterDto: FilterTransactionsDto) {
    const { fromAccount, toAccount, minAmount, maxAmount, startDate, endDate } =
      filterDto;

    return this.prisma.transaction.findMany({
      where: {
        ...(fromAccount && { fromAccount }),
        ...(toAccount && { toAccount }),
        ...(minAmount && { amount: { gte: minAmount } }),
        ...(maxAmount && { amount: { lte: maxAmount } }),
        ...(startDate && { createdAt: { gte: startDate } }),
        ...(endDate && { createdAt: { lte: endDate } }),
      },
    });
  }
}
