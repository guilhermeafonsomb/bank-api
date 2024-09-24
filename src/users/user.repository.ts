import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: User) {
    return this.prisma.user.create({
      data: {
        name: user.name,
        cpf: user.cpf,
      },
    });
  }

  async findByCpf(cpf: string) {
    return this.prisma.user.findUnique({
      where: { cpf },
    });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }
}
