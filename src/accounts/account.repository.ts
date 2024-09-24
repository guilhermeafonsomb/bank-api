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
          increment: amount,
        },
      },
    });
  }

  async withdraw(id: string, amount: number): Promise<Account> {
    return this.prisma.account.update({
      where: { id },
      data: {
        balance: {
          decrement: amount,
        },
      },
    });
  }

  async findByUserId(userId: string): Promise<Account[]> {
    return this.prisma.account.findMany({
      where: { userId },
    });
  }
}
