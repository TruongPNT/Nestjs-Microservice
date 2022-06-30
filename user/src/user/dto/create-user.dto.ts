// import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsEmail,
  IsNotEmpty,
  Length,
  IsEnum,
} from 'class-validator';
import { Column } from 'typeorm';
import { UserRole } from './user-roles.enum';

export class CreateUserDto {
  @IsString()
  full_name?: string;

  @IsNumber()
  @Type(() => Number)
  age?: number;

  @IsString()
  address?: string;

  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsEnum(UserRole)
  @IsString()
  role?: UserRole;

  @Column()
  @Length(6, 30, {
    message:
      'The password must be at least 6 but not longer than 30 characters',
  })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
