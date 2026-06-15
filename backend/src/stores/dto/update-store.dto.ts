import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateStoreDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail({}, { message: 'Valid Email Format required' })
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @MaxLength(400, { message: 'Address cannot be longer than 400 characters' })
  address?: string;
}
