import { Controller, Post, Body, Get, Query, Param } from '@nestjs/common';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { FilterTransactionsDto } from './dtos/filter-transactions.dto';
import { TransactionService } from './transaction.service';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async create(@Body() transactionDto: CreateTransactionDto) {
    return this.transactionService.create(transactionDto);
  }

  @Get('user/:userId')
  async findAllByUser(
    @Param('userId') userId: string,
    @Query() filterDto: FilterTransactionsDto,
  ) {
    return this.transactionService.findAllByUser(userId, filterDto);
  }
}
