import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Matches,
} from 'class-validator';

export class CreateWorkScheduleDto {
    @ApiProperty({ description: 'The start time of the work day', example: '08:00' })
    @IsNotEmpty()
    @IsString()
    @Matches(/^([01]\d|2[0-3]):?([0-5]\d)$/, { message: 'startTime must be in HH:mm format' })
    startTime: string;

    @ApiProperty({ description: 'The end time of the work day', example: '17:00' })
    @IsNotEmpty()
    @IsString()
    @Matches(/^([01]\d|2[0-3]):?([0-5]\d)$/, { message: 'endTime must be in HH:mm format' })
    endTime: string;

    @ApiProperty({ description: 'The duration of the break in minutes', example: 60 })
    @IsNotEmpty()
    @IsNumber()
    breakDuration: number;

    @ApiProperty({ description: 'The days of the week the user works (0-6, where 0 is Sunday)', example: [1, 2, 3, 4, 5] })
    @IsNotEmpty()
    @IsArray()
    @IsInt({ each: true })
    workingDays: number[];

    @ApiProperty({ description: 'The ID of the user', example: 'uuid' })
    @IsNotEmpty()
    @IsUUID()
    userId: string;
}
