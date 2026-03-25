import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import {
  CurrentUserDecorator,
  type CurrentUser,
} from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AvailabilityService } from './availability.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { ListAvailabilityDto } from './dto/list-availability.dto';
import { UpdateAvailabilityStatusDto } from './dto/update-availability-status.dto';

@Controller('availability')
@UseGuards(JwtAuthGuard)
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Post()
  async createAvailability(
    @CurrentUserDecorator() currentUser: CurrentUser,
    @Body() availability: CreateAvailabilityDto,
  ) {
    if (!currentUser.id) {
      throw new UnauthorizedException('Authenticated user id is missing.');
    }

    return {
      slots: await this.availabilityService.createAvailability(
        currentUser.id,
        availability,
      ),
    };
  }

  @Get()
  async listAvailability(
    @CurrentUserDecorator() currentUser: CurrentUser,
    @Query() query: ListAvailabilityDto,
  ) {
    if (!currentUser.id) {
      throw new UnauthorizedException('Authenticated user id is missing.');
    }

    return {
      slots: await this.availabilityService.listAvailability(
        currentUser.id,
        query.date,
      ),
    };
  }

  @Patch(':slotId/status')
  async updateAvailabilityStatus(
    @CurrentUserDecorator() currentUser: CurrentUser,
    @Param('slotId') slotId: string,
    @Body() update: UpdateAvailabilityStatusDto,
  ) {
    if (!currentUser.id) {
      throw new UnauthorizedException('Authenticated user id is missing.');
    }

    return {
      slot: await this.availabilityService.updateAvailabilityStatus(
        currentUser.id,
        slotId,
        update,
      ),
    };
  }

  @Delete(':slotId')
  async deleteAvailability(
    @CurrentUserDecorator() currentUser: CurrentUser,
    @Param('slotId') slotId: string,
  ) {
    if (!currentUser.id) {
      throw new UnauthorizedException('Authenticated user id is missing.');
    }

    await this.availabilityService.deleteAvailability(currentUser.id, slotId);

    return {
      success: true,
    };
  }
}
