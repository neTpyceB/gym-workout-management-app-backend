import { IsEnum } from 'class-validator';

export enum AvailabilityStatusDto {
  BUSY = 'BUSY',
  OPEN = 'OPEN',
}

export class UpdateAvailabilityStatusDto {
  @IsEnum(AvailabilityStatusDto)
  status!: AvailabilityStatusDto;
}
