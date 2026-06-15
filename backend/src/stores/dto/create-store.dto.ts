import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateStoreDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail({}, { message: 'Valid Email Format required' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(400, { message: 'Address cannot be longer than 400 characters' })
  address: string;

  @IsUUID()
  @IsNotEmpty()
  ownerId: string;
}
