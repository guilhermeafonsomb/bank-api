import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Put,
  Delete,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dtos/create-account.dto';
import { AddBalanceDto } from './dtos/add-balance.dto';
import { WithdrawDto } from './dtos/withdraw.dto';
import { Account } from './entities/account.entity';
import { UpdateAccountDto } from './dtos/update-account.dto';

@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  async create(@Body() createAccountDto: CreateAccountDto): Promise<Account> {
    return this.accountService.create(createAccountDto);
  }

  @Post(':id/add-balance')
  async addBalance(
    @Param('id') id: string,
    @Body() addBalanceDto: AddBalanceDto,
  ) {
    return this.accountService.addBalance(id, addBalanceDto.amount);
  }

  @Post(':id/withdraw')
  async withdraw(@Param('id') id: string, @Body() withdrawDto: WithdrawDto) {
    return this.accountService.withdraw(id, withdrawDto.amount);
  }

  @Get('user/:userId')
  async findAllByUser(@Param('userId') userId: string) {
    return this.accountService.findAllByUser(userId);
  }

  @Put(':accountId')
  async editAccount(
    @Param('accountId') accountId: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    return this.accountService.editAccount(accountId, updateAccountDto.name);
  }

  @Delete(':accountId')
  async deleteAccount(@Param('accountId') accountId: string) {
    return this.accountService.deleteAccount(accountId);
  }
}
