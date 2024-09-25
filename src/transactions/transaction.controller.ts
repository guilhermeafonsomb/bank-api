import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { TransactionService } from './transaction.service';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async create(@Body() transactionDto: CreateTransactionDto) {
    return this.transactionService.create(transactionDto);
  }

  @Get('user/:userId')
  async findAllByUserId(
    @Param('userId') userId: string,
    @Query('fromAccount') fromAccount?: string,
    @Query('toAccount') toAccount?: string,
    @Query('minAmount') minAmount?: number,
    @Query('maxAmount') maxAmount?: number,
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
    @Query('type') type?: string,
  ) {
    return this.transactionService.findAllByUserIdWithFilters(userId, {
      fromAccount,
      toAccount,
      minAmount,
      maxAmount,
      startDate,
      endDate,
      type,
    });
  }
}
