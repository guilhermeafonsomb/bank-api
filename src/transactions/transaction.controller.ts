import { Controller, Post, Body, Get, Query } from '@nestjs/common';
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

  @Get()
  async findAll(@Query() filterDto: FilterTransactionsDto) {
    return this.transactionService.findAll(filterDto);
  }
}
