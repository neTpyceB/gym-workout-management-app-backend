import { IsDateString } from 'class-validator';

export class ListAvailabilityDto {
  @IsDateString()
  date!: string;
}
