import { Injectable } from '@nestjs/common';
import { Account } from './entities/account.entity';
import { PrismaService } from 'prisma/prisma.service';
import { CreateAccountDto } from './dtos/create-account.dto';

@Injectable()
export class AccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    return this.prisma.account.create({
      data: {
        name: createAccountDto.name,
        userId: createAccountDto.userId,
        balance: 0,
      },
    });
  }

  async findByNameIgnoreCase(name: string): Promise<Account | null> {
    return this.prisma.account.findUnique({
      where: { name: name.toLowerCase() },
    });
  }

  async findById(id: string): Promise<Account | null> {
    return this.prisma.account.findUnique({
      where: { id },
    });
  }

  async addBalance(id: string, amount: number): Promise<Account> {
    return this.prisma.account.update({
      where: { id },
      data: {
        balance: {
          increment: Number(amount),
        },
      },
    });
  }

  async withdraw(id: string, amount: number): Promise<Account> {
    return this.prisma.account.update({
      where: { id },
      data: {
        balance: {
          decrement: Number(amount),
        },
      },
    });
  }

  async findByUserId(userId: string): Promise<Account[]> {
    return this.prisma.account.findMany({
      where: { userId },
    });
  }

  async editAccount(accountId: string, accountName: string): Promise<Account> {
    return this.prisma.account.update({
      where: { id: accountId },
      data: {
        name: accountName,
      },
    });
  }

  async deleteAccount(id: string): Promise<Account> {
    return this.prisma.account.delete({
      where: { id },
    });
  }

  async findAccountByName(accountName: string) {
    return this.prisma.account.findMany({
      where: {
        name: {
          contains: accountName,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        name: true,
      },
    });
  }
}
