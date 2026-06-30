import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsDateString,
} from 'class-validator';
import { RecordType } from 'src/common/enums/auxi.enums';

export class CreateTimeRecordDto {
    @ApiProperty({ description: 'The type of the time record', enum: RecordType, example: RecordType.CHECK_IN })
    @IsNotEmpty()
    @IsEnum(RecordType)
    type: RecordType;

    @ApiProperty({ description: 'The timestamp of the record', required: false, example: '2023-10-27T10:00:00Z' })
    @IsOptional()
    @IsDateString()
    timestamp?: Date;

    @ApiProperty({ description: 'Information about the device used', required: false })
    @IsOptional()
    @IsString()
    deviceInfo?: string;

    @ApiProperty({ description: 'The IP address of the user', required: false })
    @IsOptional()
    @IsString()
    ipAddress?: string;

    @ApiProperty({ description: 'The ID of the user', example: 'uuid' })
    @IsNotEmpty()
    @IsUUID()
    userId: string;
}
