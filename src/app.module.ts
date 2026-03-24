import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { APP_FILTER } from '@nestjs/core';

import { AppController } from './app.controller';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { HttpExceptionFilter } from './common/http-exception.filter';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AppController, AuthController],
  providers: [
    AuthService,
    JwtAuthGuard,
    PrismaService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
