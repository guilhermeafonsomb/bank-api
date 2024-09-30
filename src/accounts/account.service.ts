import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { AccountRepository } from './account.repository';
import { Account, AccountByName } from './entities/account.entity';
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
    try {
      return await this.accountRepository.addBalance(id, amount);
    } catch (error: unknown) {
      throw new BadRequestException('Erro ao adicionar saldo à conta.');
    }
  }

  async findAccountByName(accountName: string): Promise<AccountByName | null> {
    const account = await this.accountRepository.findAccountByName(accountName);

    if (!account) {
      throw new BadRequestException('Conta não existe');
    }

    return account;
  }

  async withdraw(id: string, amount: number): Promise<Account> {
    const account = await this.accountRepository.findById(id);
    if (!account) {
      throw new BadRequestException('Conta não encontrada');
    }

    if (account.balance < amount) {
      throw new BadRequestException('Saldo insuficiente para saque');
    }

    try {
      return await this.accountRepository.withdraw(id, amount);
    } catch (error: unknown) {
      throw new BadRequestException('Erro ao realizar saque.');
    }
  }

  async findAllByUser(userId: string): Promise<Account[]> {
    try {
      return await this.accountRepository.findByUserId(userId);
    } catch (error: unknown) {
      throw new BadRequestException('Erro ao buscar contas do usuário.');
    }
  }

  async editAccount(accountId: string, accountName: string): Promise<Account> {
    const account = await this.accountRepository.findById(accountId);
    if (!account) {
      throw new BadRequestException('Conta não encontrada');
    }

    try {
      return await this.accountRepository.editAccount(accountId, accountName);
    } catch (error: unknown) {
      throw new BadRequestException('Erro ao editar a conta.');
    }
  }

  async deleteAccount(accountId: string): Promise<Account> {
    const account = await this.accountRepository.findById(accountId);

    if (!account) {
      throw new BadRequestException('Conta não encontrada');
    }

    if (account.balance > 0) {
      throw new BadRequestException(
        'A conta precisa ter saldo igual a 0 para ser deletada.',
      );
    }

    try {
      return await this.accountRepository.deleteAccount(accountId);
    } catch (error: unknown) {
      throw new BadRequestException('Erro ao deletar a conta.');
    }
  }
}
