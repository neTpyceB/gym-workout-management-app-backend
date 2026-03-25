import { JwtService } from '@nestjs/jwt';
import request from 'supertest';

import { createTestApp } from './support/create-test-app';

describe('Availability integration', () => {
  it('creates one slot per selected date for the authenticated trainer only', async () => {
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

    const createResponse = await request(httpServer)
      .post('/availability')
      .set('Authorization', `Bearer ${token}`)
      .send({
        dates: ['2026-03-25', '2026-03-28'],
        endTime: '11:45 AM',
        sessionName: 'PT',
        startTime: '11:30 AM',
      })
      .expect(201);
    const createdSlots = createResponse.body as {
      slots: Array<{
        date: string;
        endTime: string;
        sessionName: string;
        startTime: string;
        status: string;
      }>;
    };

    expect(createdSlots.slots).toMatchObject([
      {
        date: '2026-03-25T00:00:00.000Z',
        endTime: '11:45 AM',
        sessionName: 'PT',
        startTime: '11:30 AM',
        status: 'OPEN',
      },
      {
        date: '2026-03-28T00:00:00.000Z',
        endTime: '11:45 AM',
        sessionName: 'PT',
        startTime: '11:30 AM',
        status: 'OPEN',
      },
    ]);

    const persistedSlots = (await prisma.availabilitySlot.findMany({
      orderBy: {
        date: 'asc',
      },
      where: {
        userId: trainer.id,
      },
    })) as Array<{
      sessionName: string;
    }>;

    expect(persistedSlots).toHaveLength(2);
    expect(persistedSlots[0].sessionName).toBe('PT');

    const otherTrainerSlots = (await prisma.availabilitySlot.findMany({
      where: {
        userId: otherTrainer.id,
      },
    })) as unknown[];

    expect(otherTrainerSlots).toEqual([]);

    await close();
  });

  it('lists, updates status, and deletes slots for one selected date', async () => {
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
    const slot = await prisma.availabilitySlot.create({
      data: {
        date: new Date('2026-03-25T00:00:00.000Z'),
        endTime: '11:45 AM',
        sessionName: 'PT',
        startTime: '11:00 AM',
        userId: trainer.id,
      },
    });
    await prisma.availabilitySlot.create({
      data: {
        date: new Date('2026-03-26T00:00:00.000Z'),
        endTime: '05:30 PM',
        sessionName: 'PT',
        startTime: '05:00 PM',
        userId: trainer.id,
      },
    });

    const listResponse = await request(httpServer)
      .get('/availability')
      .query({ date: '2026-03-25' })
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    const listedSlots = listResponse.body as {
      slots: Array<{
        id: string;
        status: string;
      }>;
    };

    expect(listedSlots.slots).toMatchObject([
      {
        id: slot.id,
        status: 'OPEN',
      },
    ]);

    const updateResponse = await request(httpServer)
      .patch(`/availability/${slot.id}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'BUSY' })
      .expect(200);
    const updatedSlot = updateResponse.body as {
      slot: {
        status: string;
      };
    };

    expect(updatedSlot.slot.status).toBe('BUSY');

    await request(httpServer)
      .delete(`/availability/${slot.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200, { success: true });

    const remainingSlots = await prisma.availabilitySlot.findMany({
      where: {
        userId: trainer.id,
      },
    });

    expect(remainingSlots).toHaveLength(1);

    await close();
  });

  it('rejects missing required availability fields', async () => {
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

    await request(httpServer)
      .post('/availability')
      .set('Authorization', `Bearer ${token}`)
      .send({
        dates: [],
        endTime: '',
        sessionName: '',
        startTime: '',
      })
      .expect(400);

    await close();
  });
});
