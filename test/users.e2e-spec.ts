import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateUserDto } from '../src/users/dtos/create-user.dto';

describe('Users E2E Tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should create a new user', async () => {
    const createUserDto: CreateUserDto = {
      name: 'Test User',
      cpf: `${Math.floor(Math.random() * 1000000000)}`,
    };

    return request(app.getHttpServer())
      .post('/users')
      .send(createUserDto)
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toEqual('Test User');
        expect(response.body.cpf).toEqual(createUserDto.cpf);
      });
  });

  it('Should list all users', async () => {
    const createUserDto: CreateUserDto = {
      name: 'Test User',
      cpf: `${Math.floor(Math.random() * 1000000000)}`,
    };

    await request(app.getHttpServer())
      .post('/users')
      .send(createUserDto)
      .expect(201);

    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toBeGreaterThan(0);
      });
  });
});
