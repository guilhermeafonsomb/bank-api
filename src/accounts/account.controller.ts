import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dtos/create-account.dto';
import { AddBalanceDto } from './dtos/add-balance.dto';
import { WithdrawDto } from './dtos/withdraw.dto';
import { Account } from './entities/account.entity';

@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  async create(@Body() createAccountDto: CreateAccountDto): Promise<Account> {
    return this.accountService.create(createAccountDto);
  }

  @Post('add-balance/:id')
  async addBalance(
    @Param('id') id: string,
    @Body() addBalanceDto: AddBalanceDto,
  ) {
    return this.accountService.addBalance(id, addBalanceDto.amount);
  }

  @Post('withdraw/:id')
  async withdraw(@Param('id') id: string, @Body() withdrawDto: WithdrawDto) {
    return this.accountService.withdraw(id, withdrawDto.amount);
  }

  @Get('/:userId')
  async findAllByUser(@Param('userId') userId: string) {
    return this.accountService.findAllByUser(userId);
  }
}
