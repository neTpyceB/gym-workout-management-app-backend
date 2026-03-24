import request from 'supertest';
import { ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AuthController } from '../src/auth/auth.controller';
import { AuthService } from '../src/auth/auth.service';

describe('Google callback integration', () => {
  it('accepts Google callback query params beyond code and state', async () => {
    const authService = {
      completeGoogleAuth: jest.fn().mockResolvedValue({
        redirectUrl: 'http://localhost:8081#token=jwt',
      }),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compile();

    const app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        forbidNonWhitelisted: true,
        transform: true,
        whitelist: true,
      }),
    );

    await app.init();
    const httpServer = app.getHttpServer() as Parameters<typeof request>[0];

    await request(httpServer)
      .get('/auth/google/callback')
      .query({
        authuser: '0',
        code: 'google-code',
        iss: 'https://accounts.google.com',
        prompt: 'consent',
        scope: 'openid email profile',
        state: 'signed-state',
      })
      .expect(302)
      .expect('Location', 'http://localhost:8081#token=jwt');

    expect(authService.completeGoogleAuth).toHaveBeenCalledWith(
      'google-code',
      'signed-state',
    );

    await app.close();
  });

  it('rejects callbacks missing code or state', async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            completeGoogleAuth: jest.fn(),
          },
        },
      ],
    }).compile();

    const app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        forbidNonWhitelisted: true,
        transform: true,
        whitelist: true,
      }),
    );

    await app.init();
    const httpServer = app.getHttpServer() as Parameters<typeof request>[0];

    await request(httpServer)
      .get('/auth/google/callback')
      .query({ code: 'google-code' })
      .expect(400);

    await app.close();
  });
});
