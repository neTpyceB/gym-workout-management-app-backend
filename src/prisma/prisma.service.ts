import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

import { env } from '../config/env';
import { PrismaClient } from '../generated/prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleDestroy, OnModuleInit
{
  private readonly pool: Pool;

  constructor() {
    const pool = new Pool({
      connectionString: env.databaseUrl,
    });

    pool.on('error', () => undefined);

    super({
      adapter: new PrismaPg(pool),
    });

    this.pool = pool;
  }

  async onModuleDestroy() {
    await this.$disconnect();
    await this.pool.end();
  }

  async onModuleInit() {
    await this.$connect();
  }
}
