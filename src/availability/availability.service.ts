import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import type { CreateAvailabilityDto } from './dto/create-availability.dto';
import type { UpdateAvailabilityStatusDto } from './dto/update-availability-status.dto';

type AvailabilitySlotResponse = {
  date: string;
  endTime: string;
  id: string;
  sessionName: string;
  startTime: string;
  status: 'OPEN' | 'BUSY';
};

@Injectable()
export class AvailabilityService {
  constructor(private readonly prisma: PrismaService) {}

  async createAvailability(
    userId: string,
    availability: CreateAvailabilityDto,
  ): Promise<AvailabilitySlotResponse[]> {
    const createdSlots = await Promise.all(
      availability.dates.map((date) =>
        this.prisma.availabilitySlot.create({
          data: {
            date: new Date(`${date}T00:00:00.000Z`),
            endTime: availability.endTime,
            sessionName: availability.sessionName,
            startTime: availability.startTime,
            userId,
          },
        }),
      ),
    );

    return createdSlots
      .sort((left, right) => left.date.getTime() - right.date.getTime())
      .map((slot) => ({
        date: slot.date.toISOString(),
        endTime: slot.endTime,
        id: slot.id,
        sessionName: slot.sessionName,
        startTime: slot.startTime,
        status: slot.status as AvailabilitySlotResponse['status'],
      }));
  }

  async listAvailability(
    userId: string,
    date: string,
  ): Promise<AvailabilitySlotResponse[]> {
    const startOfDay = new Date(`${date}T00:00:00.000Z`);
    const endOfDay = new Date(`${date}T23:59:59.999Z`);
    const slots = await this.prisma.availabilitySlot.findMany({
      orderBy: {
        createdAt: 'asc',
      },
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        userId,
      },
    });

    return slots.map((slot) => ({
      date: slot.date.toISOString(),
      endTime: slot.endTime,
      id: slot.id,
      sessionName: slot.sessionName,
      startTime: slot.startTime,
      status: slot.status as AvailabilitySlotResponse['status'],
    }));
  }

  async updateAvailabilityStatus(
    userId: string,
    slotId: string,
    update: UpdateAvailabilityStatusDto,
  ): Promise<AvailabilitySlotResponse> {
    const slot = await this.prisma.availabilitySlot.findFirst({
      where: {
        id: slotId,
        userId,
      },
    });

    if (!slot) {
      throw new NotFoundException('Availability slot not found.');
    }

    const updatedSlot = await this.prisma.availabilitySlot.update({
      data: {
        status: update.status,
      },
      where: {
        id: slotId,
      },
    });

    return {
      date: updatedSlot.date.toISOString(),
      endTime: updatedSlot.endTime,
      id: updatedSlot.id,
      sessionName: updatedSlot.sessionName,
      startTime: updatedSlot.startTime,
      status: updatedSlot.status as AvailabilitySlotResponse['status'],
    };
  }

  async deleteAvailability(userId: string, slotId: string): Promise<void> {
    const slot = await this.prisma.availabilitySlot.findFirst({
      where: {
        id: slotId,
        userId,
      },
    });

    if (!slot) {
      throw new NotFoundException('Availability slot not found.');
    }

    await this.prisma.availabilitySlot.delete({
      where: {
        id: slotId,
      },
    });
  }
}
