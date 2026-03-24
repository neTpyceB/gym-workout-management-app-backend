import request from 'supertest';

import { createTestApp } from './support/create-test-app';

describe('Auth integration', () => {
  it('rejects redirect origins outside the allowlist', async () => {
    const { app, close } = await createTestApp();
    const httpServer = app.getHttpServer() as Parameters<typeof request>[0];

    await request(httpServer)
      .get('/auth/google')
      .query({ redirectUri: 'http://malicious.example' })
      .expect(400);

    await close();
  });

  it('redirects allowed origins into the Google OAuth flow', async () => {
    const { app, close } = await createTestApp();
    const httpServer = app.getHttpServer() as Parameters<typeof request>[0];

    const response = await request(httpServer)
      .get('/auth/google')
      .query({ redirectUri: 'http://localhost:8081' })
      .expect(302);

    expect(response.headers.location).toContain(
      'https://accounts.google.com/o/oauth2/v2/auth',
    );
    expect(response.headers.location).toContain(
      encodeURIComponent('http://localhost:3000/auth/google/callback'),
    );

    await close();
  });
});
