import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import type { CreateWorkoutDto } from './dto/create-workout.dto';

@Injectable()
export class WorkoutsService {
  constructor(private readonly prisma: PrismaService) {}

  async createWorkout(userId: string, workout: CreateWorkoutDto) {
    const createdWorkout = await this.prisma.workoutPlan.create({
      data: {
        days: {
          create: workout.days.map((day, dayIndex) => ({
            exercises: {
              create: day.exercises.map((exercise, exerciseIndex) => ({
                name: exercise.name,
                order: exerciseIndex,
                reps: exercise.reps,
                sets: exercise.sets,
              })),
            },
            name: day.name,
            order: dayIndex,
          })),
        },
        description: workout.description,
        name: workout.name,
        userId,
      },
      include: {
        days: {
          include: {
            exercises: {
              orderBy: {
                order: 'asc',
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    return this.toResponse(createdWorkout);
  }

  async listWorkouts(userId: string) {
    const workouts = await this.prisma.workoutPlan.findMany({
      include: {
        days: {
          include: {
            exercises: {
              orderBy: {
                order: 'asc',
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
      where: {
        userId,
      },
    });

    return workouts.map((workout) => this.toResponse(workout));
  }

  private toResponse(workout: {
    id: string;
    name: string;
    description: string;
    days: Array<{
      id: string;
      name: string;
      exercises: Array<{
        id: string;
        name: string;
        reps: number;
        sets: number;
      }>;
    }>;
  }) {
    return {
      days: workout.days.map((day) => ({
        exercises: day.exercises.map((exercise) => ({
          id: exercise.id,
          name: exercise.name,
          reps: exercise.reps,
          sets: exercise.sets,
        })),
        id: day.id,
        name: day.name,
      })),
      description: workout.description,
      id: workout.id,
      name: workout.name,
    };
  }
}
