import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateExerciseDto {
  @IsString()
  name!: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  sets!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  reps!: number;
}

export class CreateWorkoutDayDto {
  @IsString()
  name!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateExerciseDto)
  exercises!: CreateExerciseDto[];
}

export class CreateWorkoutDto {
  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateWorkoutDayDto)
  days!: CreateWorkoutDayDto[];
}
