import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(20, { message: 'Name must be at least 20 characters long' })
  @MaxLength(60, { message: 'Name cannot be longer than 60 characters' })
  name: string;

  @IsEmail({}, { message: 'Valid Email Format required' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(16, { message: 'Password cannot be longer than 16 characters' })
  @Matches(/(?=.*[A-Z])/, { message: 'Password must contain at least 1 uppercase letter' })
  @Matches(/(?=.*[!@#$%^&*()_+|~=`{}\[\]:";\'<>?,.\/])/, { message: 'Password must contain at least 1 special character' })
  password: string;

  @IsString()
  @IsOptional()
  @MaxLength(400, { message: 'Address cannot be longer than 400 characters' })
  address?: string;

  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;
}
