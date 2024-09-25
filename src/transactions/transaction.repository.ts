import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
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
        userId: transactionDto.userId,
        type: transactionDto.type,
      },
    });
  }

  async findAllByUserId(userId: string) {
    return this.prisma.transaction.findMany({
      where: {
        userId: userId,
      },
    });
  }
}
