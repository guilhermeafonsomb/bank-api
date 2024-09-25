import { Controller, Post, Body, Get, Param } from '@nestjs/common';
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
  async findAllByUserId(@Param('userId') userId: string) {
    return this.transactionService.findAllByUserId(userId);
  }
}
