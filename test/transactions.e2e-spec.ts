import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateUserDto } from '../src/users/dtos/create-user.dto';
import { CreateAccountDto } from '../src/accounts/dtos/create-account.dto';
import { AddBalanceDto } from '../src/accounts/dtos/add-balance.dto';
import { CreateTransactionDto } from '../src/transactions/dtos/create-transaction.dto';

describe('Transactions E2E Tests', () => {
  let app: INestApplication;
  let userId: string;
  let fromAccountId: string;
  let toAccountId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const createUserDto: CreateUserDto = {
      name: 'Test User',
      cpf: `${Math.floor(Math.random() * 1000000000)}`,
    };

    const userResponse = await request(app.getHttpServer())
      .post('/users')
      .send(createUserDto)
      .expect(201);

    userId = userResponse.body.id;

    const createFromAccountDto: CreateAccountDto = {
      name: `From Account ${Date.now()}`,
      userId: userId,
    };

    const fromAccountResponse = await request(app.getHttpServer())
      .post('/accounts')
      .send(createFromAccountDto)
      .expect(201);

    fromAccountId = fromAccountResponse.body.id;

    const createToAccountDto: CreateAccountDto = {
      name: `To Account ${Date.now()}`,
      userId: userId,
    };

    const toAccountResponse = await request(app.getHttpServer())
      .post('/accounts')
      .send(createToAccountDto)
      .expect(201);

    toAccountId = toAccountResponse.body.id;

    const addBalanceDto: AddBalanceDto = {
      amount: 500,
    };

    await request(app.getHttpServer())
      .put(`/accounts/${fromAccountId}/deposit`)
      .send(addBalanceDto)
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should create a transaction between accounts', async () => {
    const createTransactionDto: CreateTransactionDto = {
      fromAccount: fromAccountId,
      toAccount: toAccountId,
      amount: 100,
      userId: userId,
      type: 'transferSent',
    };

    return request(app.getHttpServer())
      .post('/transactions')
      .send(createTransactionDto)
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveProperty('id');
        expect(response.body.amount).toBe(100);
        expect(response.body.fromAccount).toBe(fromAccountId);
        expect(response.body.toAccount).toBe(toAccountId);
      });
  });

  it('Should filter transactions by fromAccount', async () => {
    return request(app.getHttpServer())
      .get(`/transactions/user/${userId}?fromAccount=${fromAccountId}`)
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toBeGreaterThan(0);
        response.body.forEach((transaction) => {
          expect(transaction.fromAccountName).toBeDefined();
        });
      });
  });

  it('Should filter transactions by toAccount', async () => {
    return request(app.getHttpServer())
      .get(`/transactions/user/${userId}?toAccount=${toAccountId}`)
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toBeGreaterThan(0);
        response.body.forEach((transaction) => {
          expect(transaction.toAccountName).toBeDefined();
        });
      });
  });

  it('Should filter transactions by amount range', async () => {
    return request(app.getHttpServer())
      .get(`/transactions/user/${userId}?minAmount=50&maxAmount=200`)
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toBeGreaterThan(0);
        response.body.forEach((transaction) => {
          expect(transaction.amount).toBeGreaterThanOrEqual(50);
          expect(transaction.amount).toBeLessThanOrEqual(200);
        });
      });
  });
});
