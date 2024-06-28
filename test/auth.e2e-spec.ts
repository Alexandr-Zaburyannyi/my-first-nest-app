import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('signing up', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: '4kthfghfhgfhQpH@example.com',
        password: '1234ghyfjjgjg5',
      })
      .expect(201 || 201)
      .then((res) => {
        console.log(res.body);
      });
  });

  it('testing /me route', async () => {
    const email = '4kthfghfhgfhQpH@example.com';
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email,
        password: '1234ghyfjjgjg5',
      })
      .expect(201);
    const cookie = res.get('Set-Cookie');
    return request(app.getHttpServer())
      .get('/auth/me')
      .set('Cookie', cookie)
      .expect(200)
      .then((res) => {
        expect(res.body.email).toEqual(email);
      });
  });
});
