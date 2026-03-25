import { JwtService } from '@nestjs/jwt';
import request from 'supertest';

import { createTestApp } from './support/create-test-app';

describe('Workouts integration', () => {
  it('creates and lists workouts for the authenticated trainer only', async () => {
    const { app, close, prisma } = await createTestApp();
    const httpServer = app.getHttpServer() as Parameters<typeof request>[0];
    const jwtService = new JwtService({
      secret: process.env.JWT_SECRET,
    });
    const trainerRole = await prisma.role.create({
      data: {
        name: 'Trainer',
      },
    });
    const trainer = await prisma.user.create({
      data: {
        email: 'trainer@adlerclub.tech',
        googleId: 'google-trainer',
        name: 'Trainer',
        roleId: trainerRole.id,
      },
    });
    const otherTrainer = await prisma.user.create({
      data: {
        email: 'other@adlerclub.tech',
        googleId: 'google-other',
        name: 'Other Trainer',
        roleId: trainerRole.id,
      },
    });
    const token = jwtService.sign(
      {
        email: trainer.email,
        name: trainer.name,
        role: 'Trainer',
        sub: trainer.id,
      },
      {
        expiresIn: '15m',
        secret: process.env.JWT_SECRET,
      },
    );
    const otherToken = jwtService.sign(
      {
        email: otherTrainer.email,
        name: otherTrainer.name,
        role: 'Trainer',
        sub: otherTrainer.id,
      },
      {
        expiresIn: '15m',
        secret: process.env.JWT_SECRET,
      },
    );

    const createResponse = await request(httpServer)
      .post('/workouts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        days: [
          {
            exercises: [
              {
                name: 'Bench Press',
                reps: 10,
                sets: 4,
              },
            ],
            name: 'Day 1',
          },
        ],
        description: 'Chest focus',
        name: 'Starter Plan',
      })
      .expect(201);
    const createdWorkout = createResponse.body as {
      workout: {
        days: Array<{
          exercises: Array<{
            name: string;
            reps: number;
            sets: number;
          }>;
        }>;
        name: string;
      };
    };

    expect(createdWorkout.workout.name).toBe('Starter Plan');
    expect(createdWorkout.workout.days).toHaveLength(1);
    expect(createdWorkout.workout.days[0].exercises[0]).toMatchObject({
      name: 'Bench Press',
      reps: 10,
      sets: 4,
    });

    const listResponse = await request(httpServer)
      .get('/workouts')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    const listedWorkouts = listResponse.body as {
      workouts: Array<{
        description: string;
      }>;
    };

    expect(listedWorkouts.workouts).toHaveLength(1);
    expect(listedWorkouts.workouts[0].description).toBe('Chest focus');

    const otherListResponse = await request(httpServer)
      .get('/workouts')
      .set('Authorization', `Bearer ${otherToken}`)
      .expect(200);
    const otherTrainerWorkouts = otherListResponse.body as {
      workouts: unknown[];
    };

    expect(otherTrainerWorkouts.workouts).toEqual([]);

    await close();
  });

  it('accepts workout payloads with empty strings and zero values', async () => {
    const { app, close, prisma } = await createTestApp();
    const httpServer = app.getHttpServer() as Parameters<typeof request>[0];
    const jwtService = new JwtService({
      secret: process.env.JWT_SECRET,
    });
    const trainerRole = await prisma.role.create({
      data: {
        name: 'Trainer',
      },
    });
    const trainer = await prisma.user.create({
      data: {
        email: 'trainer@adlerclub.tech',
        googleId: 'google-trainer',
        name: 'Trainer',
        roleId: trainerRole.id,
      },
    });
    const token = jwtService.sign(
      {
        email: trainer.email,
        name: trainer.name,
        role: 'Trainer',
        sub: trainer.id,
      },
      {
        expiresIn: '15m',
        secret: process.env.JWT_SECRET,
      },
    );

    const createResponse = await request(httpServer)
      .post('/workouts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        days: [
          {
            exercises: [
              {
                name: '',
                reps: 0,
                sets: 0,
              },
            ],
            name: '',
          },
        ],
        description: '',
        name: '',
      })
      .expect(201);
    const createdWorkout = createResponse.body as {
      workout: {
        days: Array<{
          exercises: Array<{
            name: string;
            reps: number;
            sets: number;
          }>;
          name: string;
        }>;
        description: string;
        name: string;
      };
    };

    expect(createdWorkout.workout).toMatchObject({
      days: [
        {
          exercises: [
            {
              name: '',
              reps: 0,
              sets: 0,
            },
          ],
          name: '',
        },
      ],
      description: '',
      name: '',
    });

    await close();
  });
});
