import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Gender } from './users.schema'
import { IsString, IsEmail, IsISO8601, IsEnum, MinLength, IsNumber, IsNumberString, IsNotEmpty, IsOptional } from 'class-validator'

export class CreateUserDto {

  @ApiProperty()
  @IsString()
  readonly firstName: string;

  @ApiProperty()
  @IsString()
  readonly lastName: string;

  @ApiProperty()
  @IsNumber()
  readonly age: number;

  @ApiProperty({ enum: Gender })
  @IsEnum(Gender)
  readonly gender: Gender;

  @ApiProperty()
  @IsISO8601()
  readonly dob: Date

  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsNumberString()
  readonly phoneNumber: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password: string;
}

export class LoginDto {
  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly firstName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly lastName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  readonly age?: number;

  @ApiPropertyOptional({ enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  readonly gender?: Gender;

  @ApiPropertyOptional()
  @IsOptional()
  @IsISO8601()
  readonly dob?: Date

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  readonly phoneNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}
