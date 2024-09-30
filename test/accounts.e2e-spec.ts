import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateAccountDto } from '../src/accounts/dtos/create-account.dto';
import { AddBalanceDto } from '../src/accounts/dtos/add-balance.dto';
import { WithdrawDto } from '../src/accounts/dtos/withdraw.dto';
import { CreateUserDto } from '../src/users/dtos/create-user.dto';

describe('Accounts E2E Tests', () => {
  let app: INestApplication;
  let userId: string;

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
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should create account', async () => {
    const createAccountDto: CreateAccountDto = {
      name: `Conta Teste ${Date.now()}`, // Nome dinâmico
      userId: userId,
    };

    return request(app.getHttpServer())
      .post('/accounts')
      .send(createAccountDto)
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toEqual(createAccountDto.name);
        expect(response.body.balance).toEqual(0);
      });
  });

  it('Should add balance to account', async () => {
    const createAccountDto: CreateAccountDto = {
      name: `Conta para Depósito ${Date.now()}`, // Nome dinâmico
      userId: userId,
    };

    const account = await request(app.getHttpServer())
      .post('/accounts')
      .send(createAccountDto)
      .expect(201);

    const addBalanceDto: AddBalanceDto = {
      amount: 100,
    };

    return request(app.getHttpServer())
      .put(`/accounts/${account.body.id}/deposit`)
      .send(addBalanceDto)
      .expect(200)
      .then((response) => {
        expect(response.body.balance).toEqual(100);
      });
  });

  it('Should withdraw from account', async () => {
    const createAccountDto: CreateAccountDto = {
      name: `Conta para Saque ${Date.now()}`, // Nome dinâmico
      userId: userId,
    };

    const account = await request(app.getHttpServer())
      .post('/accounts')
      .send(createAccountDto)
      .expect(201);

    const addBalanceDto: AddBalanceDto = {
      amount: 100,
    };

    await request(app.getHttpServer())
      .put(`/accounts/${account.body.id}/deposit`)
      .send(addBalanceDto)
      .expect(200);

    const withdrawDto: WithdrawDto = {
      amount: 50,
    };

    return request(app.getHttpServer())
      .put(`/accounts/${account.body.id}/withdraw`)
      .send(withdrawDto)
      .expect(200)
      .then((response) => {
        expect(response.body.balance).toEqual(50);
      });
  });
});
