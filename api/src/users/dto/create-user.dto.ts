import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserRole } from 'src/common/enums/auxi.enums';

export class CreateUserDto {
    @ApiProperty({ description: 'The name of the user', example: 'John Doe' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ description: 'The email of the user', example: 'john.doe@example.com' })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'The password of the user', example: 'P@ssw0rd' })
    @IsNotEmpty()
    @IsString()
    password: string;


    @ApiProperty({ description: 'The role of the user', required: false, enum: UserRole, example: UserRole.EMPLOYEE })
    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;

    @ApiProperty({ description: 'Indicates if the user is active', required: false, example: true })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
