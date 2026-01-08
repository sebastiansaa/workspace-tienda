import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { cleanDatabase } from '../src/test-utils/prisma-test-helpers';
import type { PrismaService as PrismaServiceType } from '../src/prisma/prisma.service';

const envPath = path.resolve('.env.test');
if (fs.existsSync(envPath)) dotenv.config({ path: envPath });


process.env.AUTH_JWT_SECRET = process.env.AUTH_JWT_SECRET ?? 'test-secret-1234567890';
process.env.AUTH_ACCESS_TOKEN_TTL = process.env.AUTH_ACCESS_TOKEN_TTL ?? '15m';
process.env.AUTH_REFRESH_TOKEN_TTL = process.env.AUTH_REFRESH_TOKEN_TTL ?? '7d';


let PrismaService: typeof import('../src/prisma/prisma.service').PrismaService;
let AppModule: typeof import('../src/app.module').AppModule;

describe('App e2e happy path', () => {
  let app: INestApplication;
  let prisma: PrismaServiceType;

  beforeAll(async () => {

    PrismaService = require('../src/prisma/prisma.service').PrismaService;

    AppModule = require('../src/app.module').AppModule;
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    prisma = app.get(PrismaService);
  });

  beforeEach(async () => {
    await cleanDatabase(prisma);
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  it('registers, logs in, creates product/category, stocks, orders, pays', async () => {
    // Sign up
    const email = `e2e-${Date.now()}@test.com`;
    const password = 'Password123!';
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password })
      .expect(201);

    // Login
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect(200);
    const accessToken = loginRes.body.tokens.accessToken;
    const authHeader = { Authorization: `Bearer ${accessToken}` };


    const category = await prisma.category.create({ data: { title: 'E2E Cat', slug: `e2e-cat-${Date.now()}`, image: 'img' } });
    const product = await prisma.product.create({
      data: {
        title: 'E2E Product',
        slug: `e2e-prod-${Date.now()}`,
        price: 99.5,
        categoryId: category.id,
        stock: 5,
        description: '',
        images: [],
      },
    });

    // Create order
    const orderRes = await request(app.getHttpServer())
      .post('/orders')
      .set(authHeader)
      .send({ items: [{ productId: product.id, quantity: 2 }] })
      .expect(201);

    // Initiate payment
    const payRes = await request(app.getHttpServer())
      .post('/payments/initiate')
      .set(authHeader)
      .send({ orderId: orderRes.body.id, amount: orderRes.body.totalAmount })
      .expect(201);

    // Confirm payment 
    await request(app.getHttpServer())
      .post(`/payments/${payRes.body.paymentId}/confirm`)
      .set(authHeader)
      .expect(201);

    // Verify order is retrievable
    const orderGet = await request(app.getHttpServer())
      .get(`/orders/${orderRes.body.id}`)
      .set(authHeader)
      .expect(200);
    expect(orderGet.body.id).toBe(orderRes.body.id);
  });
});
