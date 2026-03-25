import {
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import {
  CurrentUserDecorator,
  type CurrentUser,
} from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { WorkoutsService } from './workouts.service';

@Controller('workouts')
@UseGuards(JwtAuthGuard)
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @Post()
  async createWorkout(
    @CurrentUserDecorator() currentUser: CurrentUser,
    @Body() workout: CreateWorkoutDto,
  ) {
    if (!currentUser.id) {
      throw new UnauthorizedException('Authenticated user id is missing.');
    }

    return {
      workout: await this.workoutsService.createWorkout(
        currentUser.id,
        workout,
      ),
    };
  }

  @Get()
  async listWorkouts(@CurrentUserDecorator() currentUser: CurrentUser) {
    if (!currentUser.id) {
      throw new UnauthorizedException('Authenticated user id is missing.');
    }

    return {
      workouts: await this.workoutsService.listWorkouts(currentUser.id),
    };
  }
}
