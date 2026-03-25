import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { APP_FILTER } from '@nestjs/core';

import { AvailabilityController } from './availability/availability.controller';
import { AvailabilityService } from './availability/availability.service';
import { AppController } from './app.controller';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { HttpExceptionFilter } from './common/http-exception.filter';
import { PrismaService } from './prisma/prisma.service';
import { WorkoutsController } from './workouts/workouts.controller';
import { WorkoutsService } from './workouts/workouts.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [
    AppController,
    AuthController,
    AvailabilityController,
    WorkoutsController,
  ],
  providers: [
    AvailabilityService,
    AuthService,
    JwtAuthGuard,
    PrismaService,
    WorkoutsService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
