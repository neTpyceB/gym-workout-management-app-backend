import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { GenericContainer, Wait } from 'testcontainers';
import type { PrismaService as PrismaServiceType } from '../../src/prisma/prisma.service';

const rootDir = join(__dirname, '..', '..');

type TestApp = {
  app: INestApplication;
  close: () => Promise<void>;
  prisma: PrismaServiceType;
};

export async function createTestApp(): Promise<TestApp> {
  const postgres = await new GenericContainer('postgres:17-alpine')
    .withEnvironment({
      POSTGRES_DB: 'gym_auth_test',
      POSTGRES_PASSWORD: 'postgres',
      POSTGRES_USER: 'postgres',
    })
    .withExposedPorts(5432)
    .withWaitStrategy(
      Wait.forLogMessage('database system is ready to accept connections'),
    )
    .start();

  process.env.DATABASE_URL = `postgresql://postgres:postgres@${postgres.getHost()}:${postgres.getMappedPort(
    5432,
  )}/gym_auth_test?schema=public`;

  execFileSync('npx', ['prisma', 'generate'], {
    cwd: rootDir,
    env: process.env,
    stdio: 'ignore',
  });
  execFileSync('npx', ['prisma', 'migrate', 'deploy'], {
    cwd: rootDir,
    env: process.env,
    stdio: 'ignore',
  });

  jest.resetModules();

  const importedModule = (await import('../../src/app.module')) as {
    AppModule: new (...args: never[]) => unknown;
  };
  const importedPrisma = (await import('../../src/prisma/prisma.service')) as {
    PrismaService: new (...args: never[]) => unknown;
  };
  const { AppModule } = importedModule;
  const { PrismaService } = importedPrisma;
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  const app: INestApplication = moduleRef.createNestApplication();

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true,
    }),
  );
  await app.init();
  const prisma: PrismaServiceType = moduleRef.get(PrismaService);

  return {
    app,
    close: async () => {
      await prisma.$disconnect();
      await app.close();
      await postgres.stop();
    },
    prisma,
  };
}
