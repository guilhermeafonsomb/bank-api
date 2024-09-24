import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { AccountRepository } from './account.repository';
import { Account } from './entities/account.entity';
import { CreateAccountDto } from './dtos/create-account.dto';

@Injectable()
export class AccountService {
  constructor(private readonly accountRepository: AccountRepository) {}

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    const existingAccount = await this.accountRepository.findByNameIgnoreCase(
      createAccountDto.name,
    );
    if (existingAccount) {
      throw new ConflictException('Conta já existe');
    }
    return this.accountRepository.create(createAccountDto);
  }

  async addBalance(id: string, amount: number): Promise<Account> {
    return this.accountRepository.addBalance(id, amount);
  }

  async withdraw(id: string, amount: number): Promise<Account> {
    const account = await this.accountRepository.findById(id);
    if (account.balance < amount) {
      throw new BadRequestException('Saldo insuficiente para saque');
    }
    return this.accountRepository.withdraw(id, amount);
  }

  async findAllByUser(userId: string): Promise<Account[]> {
    return this.accountRepository.findByUserId(userId);
  }
}
