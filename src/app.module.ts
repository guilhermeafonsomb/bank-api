import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UserController } from './users/user.controller';
import { UserRepository } from './users/user.repository';
import { UserService } from './users/user.service';
import { AccountController } from './accounts/account.controller';
import { AccountRepository } from './accounts/account.repository';
import { AccountService } from './accounts/account.service';
import { TransactionController } from './transactions/transaction.controller';
import { TransactionRepository } from './transactions/transaction.repository';
import { TransactionService } from './transactions/transaction.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AccountController, TransactionController, UserController],
  providers: [
    AccountService,
    AccountRepository,
    TransactionService,
    TransactionRepository,
    UserService,
    UserRepository,
    PrismaService,
  ],
})
export class AppModule {}
