import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { PrismaService } from 'prisma/prisma.service';
import { TransactionFilterDto } from './dtos/filter-transactions.dto';

@Injectable()
export class TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(transactionDto: CreateTransactionDto) {
    return this.prisma.transaction.create({
      data: {
        fromAccount: transactionDto.fromAccount,
        toAccount: transactionDto.toAccount,
        amount: transactionDto.amount,
        userId: transactionDto.userId,
        type: transactionDto.type,
      },
    });
  }

  async findAllByUserIdWithFilters(
    userId: string,
    filters: TransactionFilterDto,
  ) {
    const {
      fromAccount,
      toAccount,
      minAmount,
      maxAmount,
      startDate,
      endDate,
      type,
    } = filters;

    const whereClause: any = {
      userId,
    };

    if (fromAccount) {
      whereClause.fromAccount = fromAccount;
    }

    if (toAccount) {
      whereClause.toAccount = toAccount;
    }

    if (minAmount) {
      whereClause.amount = { ...whereClause.amount, gte: Number(minAmount) };
    }

    if (maxAmount) {
      whereClause.amount = { ...whereClause.amount, lte: Number(maxAmount) };
    }

    if (startDate) {
      const adjustedStartDate = new Date(startDate);
      adjustedStartDate.setHours(0, 0, 0, 0);
      whereClause.createdAt = {
        ...whereClause.createdAt,
        gte: adjustedStartDate,
      };
    }

    if (endDate) {
      const adjustedEndDate = new Date(endDate);
      adjustedEndDate.setHours(23, 59, 59, 999);
      whereClause.createdAt = {
        ...whereClause.createdAt,
        lte: adjustedEndDate,
      };
    }

    if (type) {
      whereClause.type = type;
    }

    return this.prisma.transaction.findMany({
      where: whereClause,
    });
  }
}
