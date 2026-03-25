import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateAvailabilityDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsDateString({}, { each: true })
  dates!: string[];

  @IsString()
  @MinLength(1)
  startTime!: string;

  @IsString()
  @MinLength(1)
  endTime!: string;

  @IsString()
  @MinLength(1)
  sessionName!: string;
}
