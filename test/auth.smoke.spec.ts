import request from 'supertest';

import { createTestApp } from './support/create-test-app';

describe('Health smoke', () => {
  it('starts and reports ok health', async () => {
    const { app, close } = await createTestApp();
    const httpServer = app.getHttpServer() as Parameters<typeof request>[0];

    await request(httpServer).get('/health').expect(200, {
      status: 'ok',
    });

    await close();
  });
});
